---
name: ecommerce-domain
description: Guide ecommerce domain modeling for products, variants, categories, carts, orders, customers, payments, shipping, reviews, and notifications.
---

# Ecommerce Domain Skill

## Use When
Use when modeling or implementing ecommerce business features.

## Domain Concepts
Model products, variants, categories, subcategories, images, attributes, prices, sale prices, inventory, stock status, customers, carts, cart items, wishlists, addresses, orders, order items, payments, refunds, coupons, discounts, shipping, reviews, and notifications.

## Instructions
- Support future growth without putting every concept into one table.
- Keep product catalog data separate from order snapshots.
- Preserve order item prices and product names at time of purchase.
- Treat inventory, payments, refunds, and order status as auditable business events.
- Design product bundles and combo offers as first-class business concepts when needed.
