Nice catch. Let’s fix that gap and give you a **complete, self contained `automation.md`** with full JSON examples and clear evaluation logic.

You can literally paste this as `docs/automation.md` in Harbor.

````md
# Harbor Automation Rules

## Goal

Provide a simple, predictable way to trigger alerts based on business metrics, without building a full visual workflow builder in the MVP.

Harbor automations are:

- tenant scoped
- rule based
- evaluated on a schedule
- currently focused on email alerts

---

## Data Model

Table: `automation_rules`

Fields:

- `id` uuid
- `tenantId` uuid
- `name` string
- `ruleDefinition` json
- `enabled` boolean
- `createdAt` datetime

The `ruleDefinition` field contains the full logic for the rule in JSON format.

---

## RuleDefinition JSON Structure

At MVP level we support:

- one metric comparison pattern
- one condition type
- one action type

### Base shape

```json
{
  "metric": "sales.revenue",
  "period": {
    "currentDays": 7,
    "previousDays": 7
  },
  "condition": {
    "type": "drop_percent_greater_than",
    "threshold": 20
  },
  "action": {
    "type": "email",
    "toRole": "admin",
    "subject": "Sales dropped more than 20 percent",
    "template": "sales_drop_basic"
  }
}
````

### Field explanations

* `metric`
  String that identifies what to compute. MVP supports:

  * `sales.revenue`
  * `expenses.total`

* `period`
  Specifies how to slice time for comparison:

  * `currentDays` number of days in the current window
  * `previousDays` number of days in the previous window

  Example: current 7 days vs previous 7 days.

* `condition`

  * `type`
    MVP supports:

    * `drop_percent_greater_than`
  * `threshold`
    Numeric threshold used by the condition type.

* `action`

  * `type`
    MVP supports:

    * `email`
  * `toRole`
    Which role should receive the notification:

    * `admin`
    * `manager`
  * `subject`
    Email subject line.
  * `template`
    Internal identifier of the email template that will be used by the EmailWorker.

---

## Condition Logic Details

### Condition type: `drop_percent_greater_than`

This compares the value of a metric in a current period against a previous period.

We compute:

```text
currentValue   = metric(current_period)
previousValue  = metric(previous_period)

if previousValue <= 0:
  condition is not met (avoid divide by zero)

dropPercent = ((previousValue - currentValue) / previousValue) * 100
```

The condition is satisfied if:

```text
dropPercent > threshold
```

Example:

* previousValue 1000
* currentValue 700

```text
dropPercent = ((1000 - 700) / 1000) * 100
dropPercent = 30
```

If `threshold` is 20, then the condition is true and the rule should fire.

---

## Evaluation Flow

Automations are evaluated by `AutomationWorker` on a schedule, for example every 30 minutes or every hour.

### Pseudocode

```ts
for each tenant in tenants:
  rules = getEnabledAutomationRules(tenant.id)

  for each rule in rules:
    definition = rule.ruleDefinition

    metricKey   = definition.metric
    periodSpec  = definition.period
    condition   = definition.condition
    action      = definition.action

    currentWindow  = computeWindow(periodSpec.currentDays, "current")
    previousWindow = computeWindow(periodSpec.previousDays, "previous")

    currentValue  = computeMetric(tenant.id, metricKey, currentWindow)
    previousValue = computeMetric(tenant.id, metricKey, previousWindow)

    if condition.type == "drop_percent_greater_than":
      if previousValue <= 0:
        continue

      dropPercent = ((previousValue - currentValue) / previousValue) * 100

      if dropPercent > condition.threshold:
        enqueueEmailAction(tenant.id, action, {
          metricKey,
          currentValue,
          previousValue,
          dropPercent,
          currentWindow,
          previousWindow
        })
```

---

## Email Action Evaluation

`enqueueEmailAction` resolves the recipients and template payload.

### Action JSON

```json
{
  "type": "email",
  "toRole": "admin",
  "subject": "Sales dropped more than 20 percent",
  "template": "sales_drop_basic"
}
```

### Steps

1. Resolve recipients:

   * Fetch all users in this tenant with role `toRole`.
   * Use their email addresses as recipients.

2. Build template data:

   * metric label (for example `Sales revenue`)
   * current value
   * previous value
   * drop percent
   * window descriptions (for example `last 7 days` vs `7 days before`)

3. Enqueue job on `emailQueue` with:

   * `tenantId`
   * `recipients`
   * `subject`
   * `templateId`
   * `templateData`

4. EmailWorker picks up job and sends email via the configured provider.

---

## Example Full RuleRecord

This is an example of how a full rule might look when fetched from the database and serialized to JSON.

```json
{
  "id": "ba2a4b3b 74a1 4a87 8f1c 36e2f8bca2e7",
  "tenantId": "c7c3e476 2f85 4b73 854a 8a60781c2255",
  "name": "Alert when weekly revenue drops more than 20 percent",
  "enabled": true,
  "createdAt": "2025 01 10T12:34:56.000Z",
  "ruleDefinition": {
    "metric": "sales.revenue",
    "period": {
      "currentDays": 7,
      "previousDays": 7
    },
    "condition": {
      "type": "drop_percent_greater_than",
      "threshold": 20
    },
    "action": {
      "type": "email",
      "toRole": "admin",
      "subject": "Weekly revenue drop alert",
      "template": "sales_drop_basic"
    }
  }
}
```

---

## MVP Scope Summary

Supported in MVP:

* Metrics

  * `sales.revenue`
  * `expenses.total`

* Period

  * comparison of simple rolling windows, defined in days

* Condition types

  * `drop_percent_greater_than`

* Actions

  * `email` to role based recipients

Not yet supported:

* Multiple conditions per rule
* Multiple actions per rule
* Visual builder
* Per user email overrides
* Real time trigger evaluation
