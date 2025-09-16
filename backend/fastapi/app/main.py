# app/main.py
from fastapi import FastAPI, Request, HTTPException, Header
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, List
from datetime import datetime, timezone
import hmac, hashlib, time, os, asyncio, uuid
from sqlalchemy import DateTime
from datetime import datetime

from dotenv import load_dotenv

from sqlalchemy import (
    select, text, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.exc import IntegrityError

# -------------------- App & config --------------------
load_dotenv()
app = FastAPI(title="FastAPI + PostgreSQL POC")

POSTGRES_URI = os.getenv(
    "POSTGRES_URI",
    "postgresql+asyncpg://app:app@postgres:5432/zapier_poc"
)
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "devsecret")

# -------------------- ORM --------------------
class Base(DeclarativeBase):
    pass

class Workflow(Base):
    __tablename__ = "workflows"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[Optional[uuid.UUID]] = mapped_column(nullable=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    definition: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), default=lambda: datetime.utcnow()
    )

    runs: Mapped[List["Run"]] = relationship(back_populates="workflow", lazy="raise")

class Run(Base):
    __tablename__ = "runs"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    workflow_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("workflows.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(default="queued")
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), default=lambda: datetime.utcnow()
    )

    workflow: Mapped[Optional[Workflow]] = relationship(back_populates="runs", lazy="raise")

class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    event_id: Mapped[str] = mapped_column(index=True)  # id fourni par le provider
    provider: Mapped[str]
    received_at: Mapped[datetime] = mapped_column(default=lambda: datetime.now(timezone.utc))
    payload: Mapped[Dict[str, Any]] = mapped_column(JSONB, default=dict)

    __table_args__ = (UniqueConstraint("event_id", name="uq_webhook_event_event_id"),)

engine = create_async_engine(POSTGRES_URI, echo=False, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# -------------------- Schemas --------------------
class WorkflowIn(BaseModel):
    name: str
    definition: Dict[str, Any] = Field(default_factory=dict)

class WorkflowOut(BaseModel):
    id: uuid.UUID
    name: str
    definition: Dict[str, Any]
    created_at: datetime

class WorkflowCreated(BaseModel):
    id: uuid.UUID
    name: str

class RunRequest(BaseModel):
    workflow_id: Optional[str] = None           # UUID string
    workflow_name: Optional[str] = None         # alternative au UUID
    input: Dict[str, Any] = Field(default_factory=dict)

class RunOut(BaseModel):
    id: uuid.UUID
    workflow_id: Optional[uuid.UUID]
    status: str
    payload: Dict[str, Any]
    created_at: datetime

# -------------------- Utils --------------------
def verify_hmac(secret: str, body: bytes, ts: str, signature: str) -> bool:
    base = f"t={ts}.{body.decode()}".encode()
    mac = hmac.new(secret.encode(), base, hashlib.sha256).hexdigest()
    return hmac.compare_digest(mac, signature)

# -------------------- Startup --------------------
@app.on_event("startup")
async def on_startup():
    # attend Postgres si besoin puis crée les tables
    for attempt in range(30):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            break
        except Exception:
            if attempt == 29:
                raise
            await asyncio.sleep(1)

# -------------------- Health --------------------
@app.get("/ready")
async def ready():
    async with engine.connect() as conn:
        await conn.execute(text("SELECT 1"))
    return {"ok": True}

# -------------------- Workflows --------------------
@app.post("/workflows", response_model=WorkflowCreated, status_code=201)
async def create_workflow(wf: WorkflowIn):
    async with SessionLocal() as session:
        obj = Workflow(name=wf.name, definition=wf.definition)
        session.add(obj)
        try:
            await session.commit()
            await session.refresh(obj)
        except IntegrityError:
            await session.rollback()
            raise HTTPException(status_code=409, detail="workflow name already exists")
        return WorkflowCreated(id=obj.id, name=obj.name)

@app.get("/workflows", response_model=List[WorkflowOut])
async def list_workflows():
    async with SessionLocal() as session:
        res = await session.execute(select(Workflow).order_by(Workflow.created_at.desc()))
        items = res.scalars().all()
        return [WorkflowOut(id=i.id, name=i.name, definition=i.definition, created_at=i.created_at) for i in items]

# -------------------- Runs --------------------
@app.post("/runs/manual", response_model=Dict[str, Any])
async def run_manual(body: RunRequest):
    # Résoudre le workflow UUID depuis workflow_id ou workflow_name
    workflow_uuid: Optional[uuid.UUID] = None
    if body.workflow_id:
        try:
            workflow_uuid = uuid.UUID(body.workflow_id)
        except Exception:
            raise HTTPException(status_code=400, detail="workflow_id must be a valid UUID")

    if not workflow_uuid and body.workflow_name:
        async with SessionLocal() as session:
            res = await session.execute(select(Workflow).where(Workflow.name == body.workflow_name))
            wf = res.scalar_one_or_none()
            if not wf:
                raise HTTPException(status_code=404, detail="workflow_name not found")
            workflow_uuid = wf.id

    if not workflow_uuid:
        raise HTTPException(status_code=400, detail="Provide workflow_id (UUID) or workflow_name")

    async with SessionLocal() as session:
        run = Run(workflow_id=workflow_uuid, status="queued", payload={"input": body.input})
        session.add(run)
        await session.commit()
        await session.refresh(run)
        return {"ok": True, "run": RunOut(
            id=run.id, workflow_id=run.workflow_id, status=run.status,
            payload=run.payload, created_at=run.created_at
        ).model_dump()}

@app.get("/runs", response_model=List[RunOut])
async def list_runs(limit: int = 20):
    async with SessionLocal() as session:
        res = await session.execute(select(Run).order_by(Run.created_at.desc()).limit(limit))
        items = res.scalars().all()
        return [RunOut(
            id=i.id, workflow_id=i.workflow_id, status=i.status,
            payload=i.payload, created_at=i.created_at
        ) for i in items]

# -------------------- Webhooks --------------------
@app.post("/webhooks/{provider}")
async def ingest(provider: str,
                 request: Request,
                 x_signature: str = Header(alias="X-Signature"),
                 x_timestamp: str = Header(alias="X-Timestamp")):
    # 1) anti-replay temporel
    now = int(time.time())
    try:
        ts = int(x_timestamp)
    except Exception:
        raise HTTPException(400, "bad timestamp")
    if abs(now - ts) > 300:
        raise HTTPException(400, "stale timestamp")

    # 2) signature HMAC
    body = await request.body()
    if not verify_hmac(WEBHOOK_SECRET, body, x_timestamp, x_signature):
        raise HTTPException(401, "bad signature")

    data = await request.json()
    event_id = data.get("id")
    if not event_id:
        raise HTTPException(400, "missing event id")

    async with SessionLocal() as session:
        # 3) idempotence via contrainte UNIQUE
        evt = WebhookEvent(event_id=event_id, provider=provider, payload=data)
        session.add(evt)
        try:
            await session.commit()
        except IntegrityError:
            await session.rollback()
            return {"ok": True, "duplicate": True}

        # 4) enregistrer un run simulé
        workflow_uuid: Optional[uuid.UUID] = None
        wf_id = data.get("workflow_id")
        if isinstance(wf_id, str):
            try:
                workflow_uuid = uuid.UUID(wf_id)
            except Exception:
                workflow_uuid = None

        run = Run(workflow_id=workflow_uuid, status="queued", payload=data)
        session.add(run)
        await session.commit()
        return {"ok": True, "provider": provider, "queued": True}
