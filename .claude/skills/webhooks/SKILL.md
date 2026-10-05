---
name: webhooks
description: Guide secure webhook verification, idempotent processing, retries, duplicate events, event logging, and failure handling.
---

# Webhooks Skill

## Use When
Use for payment provider webhooks and external-service event handlers.

## Instructions
- Verify webhook signatures before trusting payloads.
- Store processed event IDs to prevent duplicate processing.
- Make handlers idempotent.
- Handle retries and out-of-order events.
- Log events and processing results.
- Use transactions for state changes triggered by webhooks.
- Never blindly trust incoming webhook requests.
