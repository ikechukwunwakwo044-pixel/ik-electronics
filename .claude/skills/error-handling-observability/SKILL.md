---
name: error-handling-observability
description: Guide structured error handling, customer-safe messages, logging, monitoring, alerts, tracing, and sensitive data protection.
---

# Error Handling Observability Skill

## Use When
Use for server errors, API errors, payment failures, database errors, authentication errors, logging, monitoring, alerts, and tracing.

## Instructions
- Show user-friendly errors to customers.
- Never show stack traces or secrets to customers.
- Log enough context to debug without leaking sensitive data.
- Handle payment, auth, database, and network failures explicitly.
- Add monitoring and alerts for production-critical failures where available.
- Keep error states visible in UI and recoverable where possible.
