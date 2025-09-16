CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  name VARCHAR NOT NULL,
  definition JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO workflows (tenant_id, name, definition) VALUES
  (NULL, 'hello-world', '{"steps": []}');
SELECT id, name, created_at FROM workflows;
