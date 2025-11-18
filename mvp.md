# Harbor MVP

## Objective

Deliver a production style multi tenant dashboard where a business can:

- Upload CSV data for sales and expenses
- See key metrics in a clean dashboard
- Receive simple AI generated insights
- Get one working automation alert

MVP should be deployable, monitored, and safe to show to employers or clients.

## In Scope

1. Multi tenant authentication with roles  
2. CSV upload and processing for at least:
   - sales
   - expenses
3. PostgreSQL schema for tenants, users, files, records, insights, rules, audit logs  
4. Dashboard with:
   - sales trend line
   - expense breakdown
   - KPI cards
5. AI insights generation:
   - daily summary
   - weekly summary
6. One automation rule:
   - drop in sales triggers email alert
7. Deployment on live infrastructure with monitoring

## Out of Scope for MVP

- Visual automation builder
- Real time streaming data
- Third party integrations like Stripe or GA4
- Fine grained per module permissions

## Tech Decisions (MVP)

- Backend: NestJS, Node 20, TypeScript  
- Frontend: Next.js App Router, TypeScript  
- DB: PostgreSQL with Prisma  
- Queue: Redis with BullMQ  
- Storage: DigitalOcean Spaces for raw CSV files  
- AI: single LLM provider behind an internal service  
- Auth: JWT access token (15 min) plus refresh token cookie  
- Hosting: DigitalOcean App Platform or Render for backend, Vercel or DO for frontend  
- Monitoring: Sentry for frontend, backend, workers
