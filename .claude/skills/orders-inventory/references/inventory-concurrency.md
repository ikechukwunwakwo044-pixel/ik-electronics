# Inventory Concurrency

Critical inventory operations should happen in the database with constraints, transactions, row locks, or atomic update conditions. Avoid read-then-write stock changes that can oversell under concurrent checkout.
