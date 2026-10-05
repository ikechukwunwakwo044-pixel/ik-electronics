---
name: payments-checkout
description: Guide secure payment and checkout architecture with provider verification, webhooks, idempotency, refunds, and order synchronization.
---

# Payments Checkout Skill

## Use When
Use for checkout sessions, payment intents, payment confirmation, failures, refunds, payment status, provider APIs, and order/payment synchronization.

## Critical Rules
- Never trust payment information supplied directly by the browser.
- Verify payment status on the server using the payment provider.
- Never mark an order as paid only because the frontend says payment succeeded.
- Verify webhook signatures.
- Use idempotency keys for payment creation and webhook processing.
- Handle duplicate events, abandoned checkout, payment failures, refunds, and partial failures.
- Store payment provider IDs and status transitions for auditability.
