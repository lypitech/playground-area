# PostgreSQL

## Pros

- Open-source, free, and very mature
- Strict compliance with SQL standards
- Advanced support for transactions (ACID)
- Extensible (custom data types, functions, extensions like PostGIS)
- High reliability and data integrity
- Large community and rich documentation
- Compatible with many languages and frameworks

## Cons

- More complex to administer than databases like MySQL
- Sometimes slower for very simple read queries (vs MySQL)
- Higher memory consumption
- Can be difficult to optimize without expertise
- Fewer "out-of-the-box" tools compared to some cloud-oriented DBMS (e.g., Aurora, BigQuery)

---

### Test command

```bash
docker exec -i pg-test psql -U app -d appdb < test.sql
```
