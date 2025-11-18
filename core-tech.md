Backend
- Runtime: Node 20
- Framework: NestJS
- Language: TypeScript
- ORM: Prisma
- DB: PostgreSQL
- Queue: Redis + BullMQ
- File storage: DigitalOcean Spaces (S3 compatible)
- Auth: JWT access token + refresh token, multi tenant aware

Frontend
- Framework: Next.js (App Router) with TypeScript
- Styling: Tailwind CSS
- Components: shadcn ui
- Charts: Recharts
- Data fetching: TanStack Query
- Forms: React Hook Form + Zod

AI
- Provider: pluggable, default OpenAI compatible LLM
- Pattern: backend worker calls LLM, never from client
