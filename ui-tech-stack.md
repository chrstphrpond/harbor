# Harbor UI Tech Stack

## Framework
Next.js (App Router) with TypeScript  
Used for building server rendered dashboard pages and handling routing.

## Styling
Tailwind CSS  
Utility based styling for rapid UI development and consistent spacing.

## Component Library
shadcn ui built on Radix primitives  
Provides accessible components like dialogs, tables, dropdowns, tabs, and sheets.

## Charts
Recharts  
Used for rendering sales trends, expense breakdowns, funnels, and KPI visualizations.

## Data Fetching
TanStack Query (React Query)  
Handles server state, caching, and automatic refetching for dashboard and insights data.

## Forms
React Hook Form + Zod  
Used for authentication forms, user management forms, automation rule forms, and all settings inputs.

## Icons
Lucide React  
Clean, modern and minimal icon set used across UI elements.

## State Management
React Context for global tenant state and layout preferences  
React Query for server state  
No heavy global state library needed for MVP.

## Layout Structure
- App Shell layout with sidebar navigation  
- Top header with tenant selector and user menu  
- Content area using grid based card layouts  
- Reusable components:
  - KPI cards
  - Chart components
  - Insight cards
  - Data tables
  - Upload widgets
