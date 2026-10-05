---
name: ecommerce-master
description: Orchestrate production ecommerce development across architecture, security, database, payments, testing, deployment, and specialized skills.
---

# Ecommerce Master Skill

## Use When
Use this skill for any significant ecommerce planning, implementation, review, or deployment task.

## Operating Principle
Treat IK Electronics and Gadgets as a real production ecommerce business, not a demo site. Never use fake checkout, fake auth, fake inventory, or fake backend behavior when a real implementation is required.

## Required Workflow
1. Inspect the repository before making decisions.
2. Understand the current architecture, package manager, framework versions, environment files, database setup, and test setup.
3. Read the specialized skill that matches the task before implementation.
4. Make small, logically grouped changes.
5. Protect existing working behavior unless there is a clear reason to change it.
6. Run type checking, linting, relevant tests, and build checks when available.
7. Review security, auth, authorization, RLS, secrets, migrations, payments, and production behavior.
8. Report what changed, what was verified, and any unresolved issues.

## Feature Dependency Order
1. Project architecture and environment configuration.
2. Database schema and migrations.
3. Authentication and authorization.
4. Product catalog, categories, images, and inventory.
5. Cart and checkout architecture.
6. Payment provider integration and verified webhooks.
7. Orders, inventory reservation, fulfillment, refunds, and cancellations.
8. Admin dashboard and operations.
9. SEO, accessibility, performance, observability, and deployment hardening.

## Specialized Skills
Consult relevant skills in `.claude/skills/`, especially Next.js, React TypeScript, Supabase, PostgreSQL, RLS, payments, orders, security, testing, SEO, performance, accessibility, Vercel, documentation, and code review.

## Production Readiness Checklist
- No secrets in source code or browser-exposed variables.
- Auth and authorization enforced on the server and database where appropriate.
- RLS reviewed for user and business data.
- Payments verified server-side through provider APIs and signed webhooks.
- Inventory operations handle concurrency.
- Tests cover critical purchase, auth, admin, and failure paths.
- Build, lint, and type checks pass.
- Deployment variables are configured separately for development, preview, and production.
