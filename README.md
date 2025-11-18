# Harbor 🚢

**Clarity for your operations.**

Harbor is a modern, multi-tenant business intelligence platform that helps small businesses unify their data, gain insights, and automate workflows.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

## ✨ Features

### MVP (Current)
- 🔐 **Multi-tenant authentication** with JWT + Refresh Tokens
- 📊 **CSV data upload** for sales, expenses, leads, and inventory
- 📈 **Interactive dashboard** with KPI cards and charts
- 🤖 **AI-powered insights** (daily and weekly summaries)
- ⚡ **Automation rules** for business alerts
- 📝 **Audit logging** for compliance
- 👥 **Role-based access control** (Admin, Manager, Staff)

### Coming Soon
- Third-party integrations (Stripe, Google Analytics)
- Real-time dashboard updates
- Advanced automation builder
- Mobile app

## 🛠 Tech Stack

### Backend
- **[NestJS](https://nestjs.com/)** - Enterprise-grade Node.js framework
- **[Prisma](https://www.prisma.io/)** - Type-safe ORM for PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[BullMQ](https://docs.bullmq.io/)** - Redis-based job queue
- **[Redis](https://redis.io/)** - In-memory data store

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Accessible component library
- **[TanStack Query](https://tanstack.com/query)** - Data fetching & caching
- **[Recharts](https://recharts.org/)** - React charting library

### Infrastructure
- **[Docker](https://www.docker.com/)** - Containerization
- **[DigitalOcean Spaces](https://www.digitalocean.com/products/spaces)** - S3-compatible object storage
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

📖 **[Read detailed tech stack explanation](./TECH-STACK-EXPLAINED.md)**

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ and npm
- **Docker Desktop** (for PostgreSQL and Redis)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/harbor.git
   cd harbor
   ```

2. **Start PostgreSQL and Redis**
   ```bash
   docker-compose up -d
   ```

3. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your database credentials
   npx prisma generate
   npx prisma migrate dev --name init
   npm run start:dev
   ```

4. **Set up the workers**
   ```bash
   cd ../workers
   npm install
   cp .env.example .env
   npm run dev
   ```

5. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api
   - Database: localhost:5432 (PostgreSQL)
   - Redis: localhost:6379

### Quick Start with Docker (Alternative)

```bash
# Start all services
docker-compose up -d

# Initialize database
docker exec -i harbor-postgres psql -U harbor -d harbor < backend/init.sql

# Access frontend
open http://localhost:3000
```

## 📁 Project Structure

```
harbor/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── tenant/         # Multi-tenant management
│   │   ├── files/          # CSV upload handling
│   │   ├── data/           # Dashboard metrics
│   │   ├── insights/       # AI insights
│   │   ├── automation/     # Business rules engine
│   │   ├── audit/          # Audit logging
│   │   ├── queue/          # BullMQ integration
│   │   └── prisma/         # Database client
│   └── prisma/
│       └── schema.prisma   # Database schema
│
├── workers/                # Background job processors
│   └── src/
│       └── processors/
│           ├── file-processing.processor.ts
│           ├── insights.processor.ts
│           ├── automation.processor.ts
│           └── email.processor.ts
│
├── frontend/               # Next.js web application
│   └── src/
│       ├── app/           # App Router pages
│       ├── components/    # React components
│       └── lib/           # Utilities
│
├── docs/                  # Documentation
│   ├── mvp.md
│   ├── prd.md
│   ├── architecture.md
│   ├── db.md
│   ├── api-spec.md
│   └── automation.md
│
└── docker-compose.yml     # Local development stack
```

## 📚 Documentation

- **[Product Requirements](./prd.md)** - What Harbor does and why
- **[Architecture Overview](./architecture.md)** - System design and data flows
- **[Database Schema](./db.md)** - Table structures and relationships
- **[API Specification](./api-spec.md)** - REST API endpoints
- **[Automation Rules](./automation.md)** - How business rules work
- **[Tech Stack Explained](./TECH-STACK-EXPLAINED.md)** - Deep dive into technologies
- **[Project Roadmap](./proj-roadmap.md)** - 6-week development plan

## 🗺 Roadmap

### ✅ Week 1-2: Foundation
- [x] Multi-tenant authentication
- [x] Database schema
- [x] Basic frontend layout
- [x] CSV upload infrastructure

### 🚧 Week 3-4: Core Features (In Progress)
- [ ] Dashboard metrics aggregation
- [ ] AI insights generation
- [ ] Automation rule evaluation
- [ ] Email notifications

### 📅 Week 5-6: Polish & Deploy
- [ ] Sentry error tracking
- [ ] GitHub Actions CI/CD
- [ ] Production deployment
- [ ] Performance optimization

### 🔮 Future Enhancements
- [ ] Stripe integration for payments
- [ ] Google Analytics connector
- [ ] Real-time WebSocket updates
- [ ] Mobile app (React Native)
- [ ] Advanced automation builder

## 🎨 Branding

Harbor uses a calm, professional color palette:

- **Deep Navy** `#0A1A2F` - Primary
- **Slate Gray** `#3E4A57` - Secondary
- **Soft Sand** `#D9D4C7` - Neutral
- **Teal Accent** `#238F8F` - Accent

**Typography:** Inter (Primary), Plus Jakarta Sans (Secondary)

See [branding.md](./branding.md) for full brand guidelines.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy --prod
```

### Backend (DigitalOcean/Render)
```bash
cd backend
docker build -t harbor-backend .
docker push your-registry/harbor-backend
```

See [deployment guide](./docs/deployment.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/), [Next.js](https://nextjs.org/), and [Prisma](https://www.prisma.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

- 📧 Email: support@harbor.app
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/harbor/issues)

---

**Built with ❤️ for small businesses**

*Harbor - Where data comes together.*
