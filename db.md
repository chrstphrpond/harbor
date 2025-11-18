# Harbor Database

## Engine

- PostgreSQL 14 or newer
- Managed service such as DigitalOcean Managed PostgreSQL or Neon

## Access

- Prisma as ORM and migration tool
- `schema.prisma` defines all models
- Migrations committed to repo

## Models (high level)

- Tenant
- User
- RawFile
- ProcessedRecord
- Insight
- AutomationRule
- AuditLog

Rationale:

- Structured, relational data
- Easy aggregation for metrics
- Strong fit for multi tenant SaaS
