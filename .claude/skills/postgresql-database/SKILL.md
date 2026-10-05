---
name: postgresql-database
description: Guide PostgreSQL schema design, constraints, indexes, transactions, migrations, query performance, and data integrity.
---

# PostgreSQL Database Skill

## Use When
Use for schema design, migrations, SQL queries, constraints, transactions, indexes, and database performance.

## Instructions
- Model real business relationships with separate tables and clear ownership.
- Use primary keys, foreign keys, unique constraints, check constraints, and non-null constraints intentionally.
- Add timestamps consistently.
- Use soft deletion only when recovery, audit, or reporting requires it.
- Add indexes for common filters, joins, search, and ordering paths.
- Use transactions for multi-step order, payment, and inventory operations.
- Avoid denormalization unless there is a measured or clearly justified need.
- Paginate large result sets.
- Review query plans for slow or critical paths.
