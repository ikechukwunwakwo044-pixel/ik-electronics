# Schema Design Reference

Model products, variants, prices, inventory, orders, order items, customers, addresses, payments, refunds, coupons, shipping, reviews, and notifications as separate concepts where they have different lifecycles.

Prefer clear constraints over relying on application logic alone. Database integrity should protect business-critical data even when application code has bugs.
