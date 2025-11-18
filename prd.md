# Harbor PRD

## Vision

Harbor is a command center for small business operations that turns scattered CSV data into clear metrics, insights, and simple alerts.

## Target Users

- Small business owners
- Operations and finance managers
- Agencies that manage multiple clients
- Nonprofit and church administrators

## Problem

Teams rely on spreadsheets and manual reporting. They lack:

- a central place to upload data
- automatic transformation into metrics
- quick interpretation of trends
- simple rule based alerts

## Solution

A web app where users:

- log in to a tenant workspace
- upload CSVs for sales and expenses
- view a live dashboard
- read AI generated summaries
- configure simple automation rules

## Core MVP Features

### 1. Authentication and Tenants

- Email and password registration for first admin
- Tenant created on first signup
- Invite additional users per tenant
- JWT based authentication
  - short lived access token
  - refresh token cookie
- Roles:
  - admin: full control
  - manager: view metrics, manage automations
  - staff: upload data only

### 2. Data Ingest

- CSV upload endpoint behind auth
- Upload types for MVP:
  - sales
  - expenses
- Backend:
  - saves metadata in `raw_files`
  - issues upload to Spaces
  - enqueues processing job

### 3. Data Processing

- FileProcessingWorker:
  - downloads CSV
  - validates headers and required fields
  - maps to normalized schema
  - writes rows into `processed_records`
  - updates `raw_files.status`

### 4. Dashboard

- Daily and monthly sales trend chart
- Expense categories pie or bar chart
- KPI cards such as:
  - total revenue this month
  - total expenses this month
  - net difference
- Top products or categories list

### 5. AI Insights

- InsightsWorker runs on schedule:
  - daily job
  - weekly job
- For each tenant:
  - aggregates metrics for recent period
  - calls AiInsightsService
  - saves JSON content with:
    - summary text
    - bullet highlights
    - list of issues
    - list of recommendations

### 6. Automation Rules

- Rule stored as JSON in `automation_rules.ruleDefinition`
- MVP supports:
  - one condition type:
    - metric comparison over period
  - one action type:
    - send email
- Example rule:
  - metric: `sales.revenue`
  - period: last 7 days vs previous 7 days
  - operator: drop_percent_greater_than
  - threshold: 20
  - action: send email to admin

- AutomationWorker:
  - runs on schedule
  - evaluates rules for each tenant
  - enqueues email jobs if conditions pass

### 7. Monitoring

- Sentry:
  - frontend errors
  - backend API errors
  - worker errors
- Basic logs:
  - job success or failure
  - automation triggers

## Non Functional Requirements

- Multi tenant isolation enforced in code and queries
- All write operations are tenant scoped
- Dashboard view loads within 2 seconds under normal use
- AI cost controlled by:
  - daily limit of runs per tenant
  - metrics aggregation to reduce token size

