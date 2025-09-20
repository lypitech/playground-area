# Database Benchmark: PostgreSQL vs MongoDB vs MariaDB

## Comparison Table

| Criteria             | PostgreSQL                                     | MongoDB                                     | MariaDB                                 |
| -------------------- | ---------------------------------------------- | ------------------------------------------- | --------------------------------------- |
| **Type**             | Relational (SQL)                               | NoSQL (document-oriented)                   | Relational (SQL, MySQL fork)            |
| **Raw Performance**  | Very good, especially for complex queries      | Excellent for massive read/write operations | Good, optimized for simple queries      |
| **Scalability**      | Vertical and horizontal (extensions available) | Excellent (sharding, native replication)    | Good but less advanced than MongoDB     |
| **Data Flexibility** | Strict schema, but supports JSON/JSONB         | Very flexible (schema-less documents)       | SQL schema, low flexibility             |
| **Transactions**     | Full ACID                                      | Limited multi-document transactions         | Full ACID                               |
| **Ecosystem**        | Rich (PostGIS, TimescaleDB, many extensions)   | Large (big data tools, BI, integrations)    | Large (MySQL compatibility, many tools) |
| **Learning Curve**   | Medium (advanced SQL features)                 | Medium (document paradigm differs from SQL) | Low if familiar with MySQL              |
| **Typical Use Case** | Critical apps, complex analytics, BI           | Big Data, IoT, logs, flexible apps          | Classic web apps, MySQL replacement     |

---

## Conclusion

- **PostgreSQL**

  - Strength: very robust, feature-rich (ACID, extensions like PostGIS), ideal for mission-critical and analytics-heavy apps.
  - Weakness: more complex to administer and optimize than MariaDB.

- **MongoDB**

  - Strength: excellent flexibility and scalability, perfect for Big Data and unstructured data.
  - Weakness: transaction handling less robust than SQL databases.

- **MariaDB**
  - Strength: simplicity, MySQL compatibility, solid performance for standard web apps.
  - Weakness: lacks advanced features, not suited for large unstructured datasets.
