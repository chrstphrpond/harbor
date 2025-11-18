# Harbor API Specification

## Authentication

### POST /auth/register
Create tenant and admin user.

### POST /auth/login
Authenticate user and return token.

## Users

### GET /tenant/users
Return list of users.

### POST /tenant/users
Create new user.

## Files

### POST /files/upload
Upload a CSV.

### GET /files/history
List uploaded files.

## Dashboard

### GET /dashboard/metrics
Return metric aggregates.

## Insights

### GET /insights
Return daily and weekly insights.

## Automation

### GET /automation/rules
List rules.

### POST /automation/rules
Create rule.

## Audit Logs

### GET /audit
List tenant activity.
