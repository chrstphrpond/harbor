# Harbor Tech Stack Explained

## Overview
Harbor is a multi-tenant business intelligence platform. Here's what each technology does and why we chose it.

---

## Backend Technologies

### **NestJS** - Backend Framework
**What it does:**
- Provides structure for the API server that handles all business logic
- Manages HTTP requests (login, upload files, get dashboard data, etc.)
- Enforces clean architecture with modules, controllers, and services

**Why we use it:**
- TypeScript-first framework (type safety prevents bugs)
- Built-in dependency injection (easier to test and maintain)
- Perfect for enterprise apps with complex business logic
- Similar to Angular (familiar to many developers)

**In Harbor:**
- Handles all API endpoints (`/api/auth/login`, `/api/files/upload`, etc.)
- Enforces multi-tenant isolation via guards
- Manages authentication with JWT tokens

---

### **Prisma** - Database ORM (Object-Relational Mapping)
**What it does:**
- Translates between your TypeScript code and the PostgreSQL database
- Generates type-safe database queries
- Manages database schema migrations

**Why we use it:**
- Auto-completion when writing database queries (no SQL typos!)
- Type safety: if you query a `User`, TypeScript knows exactly what fields exist
- Automatic migrations: change schema.prisma → run migrate → database updates

**In Harbor:**
```typescript
// Without Prisma (raw SQL - error prone):
const users = await db.query('SELECT * FROM users WHERE tenantId = ?', [id])

// With Prisma (type-safe):
const users = await prisma.user.findMany({
  where: { tenantId: id }
})
// ↑ TypeScript knows `user.email`, `user.role`, etc. exist
```

**Example from Harbor:**
- When you upload a CSV, Prisma saves it to the `raw_files` table
- When dashboard loads, Prisma fetches `processed_records` and aggregates metrics

---

### **PostgreSQL** - Database
**What it does:**
- Stores all your business data permanently
- Handles complex queries and relationships between tables

**Why we use it:**
- **Reliable:** Industry standard, used by Uber, Instagram, Netflix
- **Relational:** Perfect for linked data (Users → Tenants, Files → Records)
- **ACID compliant:** Transactions are safe (no data corruption)
- **JSON support:** Can store flexible data (like automation rule definitions)

**In Harbor:**
- Stores 7 tables: tenants, users, raw_files, processed_records, insights, automation_rules, audit_logs
- Each tenant's data is isolated by `tenantId` foreign key
- Example: When you register, PostgreSQL stores tenant + admin user in one atomic transaction

---

### **Redis** - In-Memory Data Store
**What it does:**
- Ultra-fast temporary storage (data lives in RAM, not disk)
- Acts as a message queue for background jobs

**Why we use it:**
- **Speed:** 100,000+ operations per second (vs PostgreSQL ~1,000)
- **Queue management:** Tracks which jobs are pending, running, or failed
- **Persistence options:** Can save to disk periodically

**In Harbor:**
- Stores BullMQ job queues: `fileProcessing`, `insights`, `automation`, `email`
- When you upload a CSV:
  1. Backend adds job to Redis queue
  2. Worker picks it up and processes CSV
  3. Redis tracks progress/failures

**Analogy:**
- PostgreSQL = filing cabinet (permanent, organized, slower)
- Redis = sticky notes on your desk (temporary, instant access)

---

### **BullMQ** - Job Queue System
**What it does:**
- Manages background tasks that take time (CSV processing, sending emails)
- Ensures jobs run reliably even if server crashes
- Handles retries, prioritization, and concurrency

**Why we use it:**
- **Asynchronous:** User doesn't wait for CSV to process (returns immediately)
- **Scalable:** Can add more worker servers to process jobs faster
- **Fault-tolerant:** If a worker crashes, job goes back to queue

**In Harbor - Example Flow:**

**Without BullMQ (bad):**
```
User uploads 10,000 row CSV → Backend processes it → User waits 30 seconds → Timeout!
```

**With BullMQ (good):**
```
User uploads CSV
  ↓
Backend: "Got it! Processing in background" (instant response)
  ↓
BullMQ queues the job in Redis
  ↓
Worker picks up job, processes CSV in background
  ↓
User can browse dashboard while processing happens
```

**Harbor's 4 Queues:**
1. **fileProcessing** - Parse CSVs, validate data, save to database
2. **insights** - Call AI to generate summaries from data
3. **automation** - Check if sales dropped, trigger alerts
4. **email** - Send notification emails to users

---

### **DigitalOcean Spaces** - File Storage (S3-compatible)
**What it does:**
- Cloud storage for uploaded CSV files
- Like Dropbox, but for applications

**Why we use it:**
- **Scalable:** Store gigabytes of files without filling up server disk
- **S3-compatible:** Same API as Amazon S3 (industry standard)
- **CDN included:** Files load fast globally

**In Harbor:**
1. User uploads CSV to frontend
2. Backend generates pre-signed upload URL (secure temporary link)
3. Frontend uploads directly to Spaces (doesn't go through backend)
4. Worker downloads from Spaces to process

**File path pattern:**
```
spaces://harbor-files/tenants/{tenantId}/files/{fileId}.csv
```

---

## Frontend Technologies

### **Next.js** - React Framework
**What it does:**
- Builds the web interface users interact with
- Handles routing (dashboard, settings, insights pages)
- Server-side rendering for fast initial page loads

**Why we use it:**
- **App Router:** Modern file-based routing (`app/dashboard/page.tsx` → `/dashboard`)
- **Performance:** Pre-renders pages for instant loading
- **Full-stack:** Can write API routes if needed

**In Harbor:**
- Renders dashboard charts, KPI cards, tables
- Handles navigation between pages
- Manages user authentication state

---

### **Tailwind CSS** - Styling Framework
**What it does:**
- Utility-first CSS framework for styling components
- Instead of writing custom CSS, you compose classes

**Why we use it:**
- **Fast development:** No need to name CSS classes
- **Consistent design:** Predefined spacing, colors from design system
- **Responsive:** Mobile-friendly with `md:`, `lg:` breakpoints

**Example in Harbor:**
```tsx
// Old way (custom CSS):
<div className="kpi-card">  // Need to write .kpi-card { ... } in CSS file

// Tailwind way:
<div className="rounded-lg border bg-white shadow-sm p-6">
//               ↑ rounded corners
//                     ↑ border
//                           ↑ white background
//                                    ↑ shadow
//                                             ↑ padding
```

---

### **shadcn/ui** - Component Library
**What it does:**
- Pre-built React components (cards, buttons, dialogs)
- Based on Radix UI (accessible, composable primitives)

**Why we use it:**
- **Copy-paste approach:** You own the code (not a dependency)
- **Accessible:** Keyboard navigation, screen reader support built-in
- **Customizable:** Styled with Tailwind (matches Harbor brand colors)

**In Harbor:**
- Card components for KPI metrics
- Dialog for file upload modal
- Dropdown for tenant switcher

---

### **TanStack Query (React Query)** - Data Fetching
**What it does:**
- Manages server state in React
- Handles API calls, caching, refetching, loading states

**Why we use it:**
- **Automatic caching:** Fetch once, reuse data across pages
- **Background updates:** Refetches stale data automatically
- **Loading/error states:** Easy to show spinners and error messages

**In Harbor - Example:**
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['dashboard-metrics'],
  queryFn: () => fetch('/api/dashboard/metrics').then(r => r.json())
})

// Query automatically:
// - Caches result for 5 minutes
// - Refetches when window regains focus
// - Retries on network failure
```

---

### **Recharts** - Charting Library
**What it does:**
- Renders interactive charts (line, bar, pie, etc.)
- Built on D3.js but much simpler API

**Why we use it:**
- **React-first:** Uses JSX components, not imperative APIs
- **Responsive:** Charts adapt to screen size
- **Composable:** Easy to customize tooltips, axes, legends

**In Harbor:**
- Sales trend line chart (7-day revenue)
- Expense breakdown bar chart
- Lead funnel visualization (future)

---

## DevOps & Infrastructure

### **Docker** - Containerization
**What it does:**
- Packages applications with their dependencies into containers
- Ensures "works on my machine" actually works everywhere

**Why we use it:**
- **Consistency:** Same PostgreSQL/Redis version across dev, staging, prod
- **Isolation:** Each service runs independently
- **Easy setup:** `docker-compose up` starts entire stack

**In Harbor:**
```yaml
# docker-compose.yml defines:
postgres:  # Database container
  - Runs PostgreSQL 16
  - Exposes port 5432
  - Stores data in volume (persists after restart)

redis:     # Queue container
  - Runs Redis 7
  - Exposes port 6379
```

**Benefits:**
- New developer clones repo → runs `docker-compose up` → has working database instantly
- No "install PostgreSQL 16, configure users, create database" steps

---

### **TypeScript** - Programming Language
**What it does:**
- JavaScript with type checking
- Catches errors before code runs

**Why we use it:**
- **Prevents bugs:** Typo in variable name? TypeScript catches it
- **Better autocomplete:** IDE knows what properties objects have
- **Refactoring safety:** Rename function → IDE updates all usages

**Example from Harbor:**
```typescript
// JavaScript (no types - bugs slip through):
function calculateRevenue(records) {
  return records.map(r => r.amount).reduce((a, b) => a + b)
  // Typo: should be r.revenue, not r.amount
  // Bug only discovered in production!
}

// TypeScript (type-safe):
function calculateRevenue(records: ProcessedRecord[]): number {
  return records.map(r => r.revenue).reduce((a, b) => a + b)
  // ↑ TypeScript errors: Property 'revenue' doesn't exist
  //   Did you mean 'amount'?
}
```

---

## How They Work Together

### Example Flow: User Uploads Sales CSV

1. **Frontend (Next.js)**
   - User clicks "Upload CSV" button
   - TanStack Query calls backend API

2. **Backend (NestJS)**
   - FilesController receives upload request
   - FilesService generates pre-signed URL from DigitalOcean Spaces
   - Prisma creates `raw_files` record with status `PENDING`
   - QueueService adds job to BullMQ/Redis

3. **Worker (BullMQ)**
   - FileProcessingWorker picks job from Redis queue
   - Downloads CSV from DigitalOcean Spaces
   - Parses CSV rows
   - Prisma saves each row to `processed_records` table (PostgreSQL)
   - Updates `raw_files` status to `PROCESSED`

4. **Frontend (Next.js)**
   - TanStack Query refetches dashboard data
   - Recharts renders updated sales chart
   - User sees new data!

---

## Key Architectural Decisions

### Why Multi-Tenant?
- **One codebase, many customers:** Each tenant has isolated data
- **Cost-efficient:** Share infrastructure instead of deploying per customer
- **Implemented via:** `tenantId` column in every table + TenantScopeGuard

### Why Separate Workers?
- **Scalability:** Backend handles API requests fast, workers handle slow tasks
- **Reliability:** Worker crash doesn't affect API
- **Flexibility:** Can scale workers independently (10 API servers, 50 workers)

### Why JWT Tokens?
- **Stateless:** No session storage needed (scales horizontally)
- **Secure:** 15-minute expiry, refresh token in httpOnly cookie
- **Contains tenant info:** Every request knows which tenant without database lookup

---

## Technology Comparison Table

| Technology | Category | Alternatives | Why We Chose It |
|------------|----------|--------------|-----------------|
| **NestJS** | Backend Framework | Express, Fastify, Hono | Enterprise structure, TypeScript-first |
| **Prisma** | ORM | TypeORM, Drizzle, Sequelize | Best TypeScript integration, amazing DX |
| **PostgreSQL** | Database | MySQL, MongoDB, SQLite | Relational data, JSON support, reliability |
| **Redis** | Cache/Queue | Memcached, RabbitMQ | Fastest in-memory store, BullMQ integration |
| **BullMQ** | Job Queue | Agenda, Bee-Queue, Celery | Modern, Redis-native, excellent observability |
| **Next.js** | Frontend Framework | Remix, SvelteKit, Nuxt | Industry standard, App Router, Vercel deployment |
| **Tailwind** | CSS Framework | Bootstrap, Chakra UI | Utility-first, no unused CSS, fast iteration |
| **Recharts** | Charts | Chart.js, Victory, D3 | React-native, simple API, good docs |
| **Docker** | Containerization | Podman, Kubernetes | Standard, docker-compose simplicity |

---

## Performance Characteristics

### Database Query Speed (typical)
- **PostgreSQL:** 1-10ms per query (indexed)
- **Redis:** 0.1-1ms per operation
- **Prisma:** Adds ~1ms overhead (minimal)

### Scalability Limits
- **Single PostgreSQL:** ~10,000 concurrent users
- **Redis:** ~100,000 operations/second
- **NestJS API:** ~1,000 req/sec per server (scale horizontally)
- **Workers:** Process ~100 CSVs/minute (depends on size)

### When to Optimize
- **Now:** Multi-tenant isolation (security critical)
- **Later:** Database indexes when queries slow down
- **Much later:** Redis caching, CDN, horizontal scaling

---

## Security Features

### Built-In
- **JWT expiry:** Access tokens expire in 15 minutes
- **httpOnly cookies:** Refresh tokens not accessible to JavaScript (XSS protection)
- **Tenant isolation:** Database-level via foreign keys + guards
- **Password hashing:** bcrypt with salt rounds (no plaintext passwords)
- **Pre-signed URLs:** Users can't access other tenants' files

### TODO (Production)
- Rate limiting (prevent brute force)
- CORS configuration (restrict frontend origins)
- SSL/TLS (HTTPS everywhere)
- Database connection pooling (prevent connection exhaustion)
- Audit logging (track who did what)

---

## Development Workflow

### Local Development
```bash
docker-compose up -d          # Start PostgreSQL + Redis
cd backend && npm run start:dev    # Start API (hot-reload)
cd workers && npm run dev          # Start workers
cd frontend && npm run dev         # Start UI
```

### Production Deployment
```bash
# Backend + Workers → DigitalOcean App Platform / Render
# Frontend → Vercel
# Database → Managed PostgreSQL (DigitalOcean, AWS RDS)
# Redis → Managed Redis (Upstash, Redis Cloud)
# Files → DigitalOcean Spaces
```

---

## Cost Breakdown (Estimated Monthly)

### Development (Free)
- PostgreSQL: Docker (local)
- Redis: Docker (local)
- Frontend: localhost

### Small Production (~100 users)
- Backend: $5 (DigitalOcean Droplet)
- Database: $15 (Managed PostgreSQL)
- Redis: $10 (Upstash)
- Storage: $5 (100GB Spaces)
- Frontend: $0 (Vercel free tier)
- **Total: ~$35/month**

### Scale Production (~10,000 users)
- Backend: $50 (3x servers)
- Database: $100 (High-memory instance)
- Redis: $30 (Upstash Pro)
- Storage: $20 (500GB)
- Frontend: $20 (Vercel Pro)
- **Total: ~$220/month**

---

## Learning Resources

### Essential
- [NestJS Docs](https://docs.nestjs.com) - Start here for backend
- [Prisma Quickstart](https://www.prisma.io/docs/getting-started) - Database ORM
- [Next.js Tutorial](https://nextjs.org/learn) - Frontend framework
- [BullMQ Guide](https://docs.bullmq.io) - Job queues

### Reference
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Redis Commands](https://redis.io/commands)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)

---

## Common Questions

**Q: Why not use MongoDB instead of PostgreSQL?**
A: Harbor has highly relational data (Users belong to Tenants, Files have Records). PostgreSQL's foreign keys prevent orphaned data and enforce integrity. MongoDB is better for document-heavy apps.

**Q: Can I replace BullMQ with cron jobs?**
A: Cron runs on a schedule. BullMQ runs on-demand (when user uploads CSV) and handles retries. For Harbor's async processing, queues are more appropriate.

**Q: Why Docker for local dev?**
A: Without Docker, each developer needs to install PostgreSQL 16, create users, configure ports. With Docker, `docker-compose up` gives everyone identical environments.

**Q: Is Prisma slow?**
A: Prisma adds ~1ms per query. For Harbor (B2B dashboard, not high-frequency trading), the developer productivity gain far outweighs the minimal overhead.

**Q: Why not use REST for workers instead of queues?**
A: If worker processes CSV via HTTP request and crashes mid-way, job is lost. With queues, jobs persist in Redis until acknowledged. Much more reliable.

---

## Next Steps

Now that you understand the tech stack, explore:
1. **Read the code:** Start with `backend/src/app.module.ts` to see how modules connect
2. **Modify a feature:** Add a new KPI card to the dashboard
3. **Deploy:** Push to GitHub, connect to Vercel (frontend) and Render (backend)

Each technology was chosen to make Harbor:
- **Reliable** (PostgreSQL, BullMQ fault tolerance)
- **Fast** (Redis caching, Next.js SSR)
- **Maintainable** (TypeScript, Prisma, NestJS architecture)
- **Scalable** (Horizontal scaling, async workers, multi-tenant)

You're building on battle-tested technologies used by companies like Airbnb, Uber, and Netflix! 🚀
