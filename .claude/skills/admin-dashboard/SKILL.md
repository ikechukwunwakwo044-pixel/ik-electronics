---
name: admin-dashboard
description: Guide protected ecommerce admin dashboard architecture for products, orders, inventory, customers, payments, refunds, settings, and analytics.
---

# Admin Dashboard Skill

## Use When
Use for admin dashboard pages, admin APIs, product management, order management, inventory, customers, payments, refunds, coupons, shipping, reviews, settings, and analytics.

## Instructions
- Require admin authorization for every admin page, server action, and API endpoint.
- A customer must never access admin operations by manually calling an endpoint.
- Provide useful admin loading, empty, error, and confirmation states.
- Use tables, filters, search, pagination, and status badges for operational views.
- Log or audit high-risk admin actions where appropriate.
- Keep destructive actions confirmed and reversible where possible.
