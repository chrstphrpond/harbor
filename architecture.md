# Harbor Architecture

## High Level Diagram

Client (Next.js)
  |
  | HTTPS
  |
Backend API (NestJS)
  |
  | SQL via Prisma
  |
PostgreSQL
  |
  | Jobs via Redis
  |
Workers (BullMQ)
  |
  | File IO
  |
DigitalOcean Spaces
  |
  | Outbound HTTP
  |
LLM Provider and Email Provider

## Components

### 1. Frontend

- Next.js App Router
- Auth pages and protected app shell
- Pages:
  - Dashboard
  - Data upload
  - Insights
  - Automation
  - Settings
- Uses TanStack Query for calls to the backend API

### 2. Backend API (NestJS)

Modules:

- AuthModule
  - JWT issue and refresh
  - Password hashing
- TenantModule
  - Tenant creation
  - User management within a tenant
- FileModule
  - CSV upload endpoints
  - Temporary pre signed upload URL from Spaces
- DataModule
  - Read processed records
  - Aggregate metrics for dashboard
- InsightsModule
  - Read AI generated insights
- AutomationModule
  - CRUD for rules
  - Manual test trigger endpoint
- AuditModule
  - Log important actions

Cross cutting:

- Tenant guard that reads tenantId from JWT and scopes all queries
- Role guard that checks role against route metadata

### 3. Database

- PostgreSQL
- Prisma for migrations and queries

Core tables:

- tenants
- users
- raw_files
- processed_records
- insights
- automation_rules
- audit_logs

### 4. Queue and Workers

- Redis instance
- BullMQ queues:
  - fileProcessingQueue
  - insightsQueue
  - automationQueue
  - emailQueue

Worker processes:

- FileProcessingWorker
  - Download CSV from Spaces
  - Parse and validate
  - Insert processed_records rows
- InsightsWorker
  - Aggregate metrics per tenant and time period
  - Call LLM with prompt
  - Save insights rows
- AutomationWorker
  - Evaluate automation_rules JSON for each tenant
  - Fetch relevant metrics
  - If condition satisfied, enqueue email job
- EmailWorker
  - Send transactional email via provider (for example Resend, SendGrid, Mailgun)

### 5. File Storage

- DigitalOcean Spaces bucket
- Access via S3 compatible SDK
- Raw CSVs stored with key pattern:
  - `tenants/{tenantId}/files/{fileId}.csv`

### 6. AI Integration Path

- Worker only
- InsightsWorker calls `AiInsightsService`
- AiInsightsService wraps an LLM client
- Requests are:
  - rate limited per tenant
  - size limited (pre aggregated numeric metrics, no raw PII)
- Response stored in `insights.content` a
