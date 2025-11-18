# Harbor AI Integration

## Goals

- Generate human readable summaries of business performance
- Highlight significant changes in metrics
- Provide simple recommendations
- Keep costs predictable and data safe

## Responsibilities

Handled by `AiInsightsService` inside the worker layer.

## Flow

1. InsightsWorker aggregates metrics for a tenant:
   - revenue current period vs previous
   - expenses current vs previous
   - top categories or products
2. It builds a compact JSON payload.
3. AiInsightsService:
   - formats a prompt with:
     - business context
     - numeric metrics
     - desired output schema
   - calls LLM provider
   - parses response into:
     - `summary`
     - `highlights`
     - `issues`
     - `recommendations`
4. Result stored in `insights.content` as JSON.

## Provider

- Use an OpenAI compatible LLM client
- Provider details kept in environment variables:
  - `AI_PROVIDER_BASE_URL`
  - `AI_PROVIDER_API_KEY`
  - `AI_MODEL_NAME`

## Prompt Strategy

- System message:
  - role: operations and finance analyst
  - style: concise, practical, no fluff
- User content:
  - summary of recent metrics
  - table like structure in text form
- Output contract:
  - ask model to respond in JSON and validate before saving

## Cost Controls

- Limit insights generation:
  - once per day for daily
  - once per week for weekly
- Aggregate data first:
  - do not send raw row level data
  - send totals and key stats only
- Enforce token limits in request builder
- Capture token usage logs for future tuning

## Data Protection

- No PII sent in prompts
- Only numeric metrics and category names
- Tenant identifier never sent to provider
