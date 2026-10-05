---
name: orders-inventory
description: Guide order lifecycle and inventory safety from cart to checkout, payment, fulfillment, cancellation, refunds, and concurrent purchases.
---

# Orders Inventory Skill

## Use When
Use for cart, checkout, order creation, inventory reservation, stock decrement, fulfillment, cancellation, refunds, out-of-stock handling, and duplicate order prevention.

## Instructions
- Inventory operations must be safe against concurrent purchases.
- Use transactions or database functions for critical stock changes.
- Keep cart state separate from finalized order records.
- Create order items with a snapshot of purchased product details and price.
- Prevent duplicate order creation and duplicate stock decrement.
- Define clear order statuses and payment statuses.
- Handle cancellation, refunds, and fulfillment as explicit state changes.
