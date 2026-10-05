from pathlib import Path
import textwrap


ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / ".claude" / "skills"
WORKFLOWS_DIR = ROOT / "workflows"


def clean(text: str) -> str:
    return textwrap.dedent(text).strip() + "\n"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(clean(content), encoding="utf-8")


skills = {
    "ecommerce-master": {
        "description": "Orchestrate production ecommerce development across architecture, security, database, payments, testing, deployment, and specialized skills.",
        "body": """
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
        """,
        "refs": {
            "source-notes.md": """
                # Source Notes

                Before duplicating official skills, check current maintained sources:

                - Supabase Agent Skills: `npx skills add supabase/agent-skills`
                - Vercel and Next.js skills from maintained Vercel or Next.js sources
                - Claude Code Marketplace and Skills Marketplace entries for Next.js, React, Supabase, Stripe, testing, security, and deployment

                Use official skills when they are maintained, relevant, and safe. Use local skills here to orchestrate IK Electronics-specific ecommerce behavior.
            """,
        },
    },
    "nextjs-architecture": {
        "description": "Guide production Next.js App Router architecture with safe server/client boundaries, routing, metadata, caching, and performance behavior.",
        "body": """
            # Next.js Architecture Skill

            ## Use When
            Use for routing, layouts, pages, Server Components, Client Components, Server Actions, Route Handlers, middleware/proxy behavior, metadata, caching, and rendering decisions.

            ## Instructions
            - Prefer Server Components for data fetching and sensitive operations.
            - Use Client Components only for browser-only interactivity, local state, effects, or client APIs.
            - Keep secrets, payment logic, admin checks, and database writes on the server.
            - Use App Router conventions for layouts, loading states, error boundaries, dynamic routes, and metadata.
            - Choose static generation, dynamic rendering, revalidation, and caching deliberately based on product freshness and user-specific data.
            - Use optimized images and font loading.
            - Add meaningful loading, error, and empty states.
            - Check the installed Next.js version and current docs before using version-sensitive APIs.
        """,
    },
    "react-typescript": {
        "description": "Guide strict React and TypeScript implementation with typed components, state, APIs, and maintainable boundaries.",
        "body": """
            # React TypeScript Skill

            ## Use When
            Use for React components, hooks, state management, props, typed data, and UI behavior.

            ## Instructions
            - Use strict TypeScript and avoid unnecessary `any`.
            - Type props, API responses, form values, and database-facing objects.
            - Use discriminated unions for complex UI states or domain states.
            - Keep components small and reusable when reuse is real.
            - Add loading, error, empty, and success states.
            - Avoid overengineering custom hooks or abstractions.
            - Keep server and client data shapes predictable.
            - Validate untrusted data at runtime with Zod or an equivalent validation library.
        """,
    },
    "supabase-development": {
        "description": "Guide Supabase project setup, Auth, Storage, SSR clients, migrations, Edge Functions, local development, and generated types.",
        "body": """
            # Supabase Development Skill

            ## Use When
            Use for Supabase Auth, Database, Storage, Edge Functions, SSR integration, environment variables, local development, migrations, generated TypeScript types, and CLI work.

            ## Instructions
            - Check current Supabase docs before implementing Supabase-specific code.
            - Prefer migrations over manual production database changes.
            - Generate and use database TypeScript types where possible.
            - Separate browser Supabase clients from server/admin clients.
            - Never place the service-role key in client-side code.
            - Treat any `NEXT_PUBLIC_` variable as browser-visible.
            - Use Supabase CLI help output rather than guessing commands.
            - Keep Storage policies aligned with database ownership and business rules.
        """,
    },
    "postgresql-database": {
        "description": "Guide PostgreSQL schema design, constraints, indexes, transactions, migrations, query performance, and data integrity.",
        "body": """
            # PostgreSQL Database Skill

            ## Use When
            Use for schema design, migrations, SQL queries, constraints, transactions, indexes, and database performance.

            ## Instructions
            - Model real business relationships with separate tables and clear ownership.
            - Use primary keys, foreign keys, unique constraints, check constraints, and non-null constraints intentionally.
            - Add timestamps consistently.
            - Use soft deletion only when recovery, audit, or reporting requires it.
            - Add indexes for common filters, joins, search, and ordering paths.
            - Use transactions for multi-step order, payment, and inventory operations.
            - Avoid denormalization unless there is a measured or clearly justified need.
            - Paginate large result sets.
            - Review query plans for slow or critical paths.
        """,
        "refs": {
            "schema-design.md": """
                # Schema Design Reference

                Model products, variants, prices, inventory, orders, order items, customers, addresses, payments, refunds, coupons, shipping, reviews, and notifications as separate concepts where they have different lifecycles.

                Prefer clear constraints over relying on application logic alone. Database integrity should protect business-critical data even when application code has bugs.
            """,
            "query-performance.md": """
                # Query Performance Reference

                Index columns used in joins, filters, ordering, and uniqueness checks. Avoid loading full tables for admin dashboards or product listings. Use pagination and narrow selects. Measure slow queries before optimizing heavily.
            """,
        },
    },
    "supabase-security-rls": {
        "description": "Guide Supabase Row Level Security policies for customer ownership, admin access, storage access, and privilege escalation prevention.",
        "body": """
            # Supabase Security RLS Skill

            ## Use When
            Use for any table, view, function, or storage bucket containing user, customer, order, payment, product admin, or business data.

            ## Critical Rules
            - Never assume hiding a UI button is security.
            - Enforce authorization server-side and/or at the database layer.
            - Enable RLS for tables exposed through Supabase APIs where user or business data exists.
            - Write explicit SELECT, INSERT, UPDATE, and DELETE policies.
            - Separate customer ownership policies from admin policies.
            - Never trust user-editable metadata for authorization.
            - Avoid views that bypass RLS unless explicitly safe; use `security_invoker = true` where appropriate.
            - Test policies for authenticated users, anonymous users, customers, admins, and forbidden access.
        """,
        "refs": {
            "rls-patterns.md": """
                # RLS Patterns

                Common ecommerce checks include customer-owned rows, admin-only rows, public product catalog reads, private order reads, and service-role-only maintenance operations.

                Always test both allowed and denied cases. A policy is incomplete until forbidden users are confirmed blocked.
            """,
        },
    },
    "authentication-authorization": {
        "description": "Guide authentication, authorization, roles, sessions, protected routes, account ownership, and secure auth flows.",
        "body": """
            # Authentication Authorization Skill

            ## Use When
            Use for signup, login, logout, email verification, password reset, sessions, roles, protected routes, customer accounts, admin accounts, OAuth, account deletion, and profile management.

            ## Definitions
            - Authentication means who the user is.
            - Authorization means what the user is allowed to do.

            ## Instructions
            - Use secure cookies and server-side session checks where appropriate.
            - Protect routes, server actions, route handlers, and database access.
            - Store admin authorization in trusted server-controlled data, not user-editable fields.
            - Verify account ownership before reading or modifying customer data.
            - Handle session expiration and logout cleanly.
            - Include email verification and password reset flows when required.
            - Never rely on frontend-only checks for admin or customer access.
        """,
    },
    "ecommerce-domain": {
        "description": "Guide ecommerce domain modeling for products, variants, categories, carts, orders, customers, payments, shipping, reviews, and notifications.",
        "body": """
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
        """,
    },
    "payments-checkout": {
        "description": "Guide secure payment and checkout architecture with provider verification, webhooks, idempotency, refunds, and order synchronization.",
        "body": """
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
        """,
        "refs": {
            "payment-patterns.md": """
                # Payment Patterns

                A safe checkout flow creates an order or checkout record on the server, creates the provider payment object server-side, redirects or confirms payment through the provider, then finalizes paid status only after provider verification or a signed webhook.
            """,
        },
    },
    "orders-inventory": {
        "description": "Guide order lifecycle and inventory safety from cart to checkout, payment, fulfillment, cancellation, refunds, and concurrent purchases.",
        "body": """
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
        """,
        "refs": {
            "inventory-concurrency.md": """
                # Inventory Concurrency

                Critical inventory operations should happen in the database with constraints, transactions, row locks, or atomic update conditions. Avoid read-then-write stock changes that can oversell under concurrent checkout.
            """,
        },
    },
    "admin-dashboard": {
        "description": "Guide protected ecommerce admin dashboard architecture for products, orders, inventory, customers, payments, refunds, settings, and analytics.",
        "body": """
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
        """,
    },
    "ui-ux-design": {
        "description": "Guide professional ecommerce UI and UX design for mobile-first product browsing, trust, conversion, forms, states, and brand fit.",
        "body": """
            # UI UX Design Skill

            ## Use When
            Use for customer-facing pages, admin UX, product presentation, conversion flows, navigation, forms, and interaction design.

            ## Instructions
            - Design around IK Electronics and Gadgets, not a generic AI-looking store.
            - Prioritize mobile-first responsive design with strong desktop and tablet support.
            - Use clear spacing, typography hierarchy, visual hierarchy, and product-focused layouts.
            - Include loading, skeleton, error, empty, confirmation, and success states.
            - Make forms accessible and easy to complete.
            - Make products easy to compare, inspect, and buy.
            - Use trust signals, clear pricing, availability, delivery information, and customer-friendly CTAs.
        """,
    },
    "tailwind-shadcn": {
        "description": "Guide Tailwind CSS and shadcn/ui usage for reusable components, theme tokens, responsive design, forms, dialogs, tables, buttons, and alerts.",
        "body": """
            # Tailwind shadcn Skill

            ## Use When
            Use for styling, component composition, design tokens, shadcn/ui components, responsive breakpoints, forms, dialogs, dropdowns, cards, tables, buttons, alerts, and toast systems.

            ## Instructions
            - Prefer Tailwind utilities and shadcn/ui components before custom CSS.
            - Reuse components consistently.
            - Keep theme variables organized.
            - Use responsive classes deliberately.
            - Ensure cards, tables, dialogs, forms, and buttons are accessible.
            - Do not over-customize shadcn components when composition solves the problem.
        """,
    },
    "api-development": {
        "description": "Guide secure API and server action development with validation, authorization, status codes, pagination, filtering, sorting, and error responses.",
        "body": """
            # API Development Skill

            ## Use When
            Use for route handlers, server actions, REST APIs, request validation, response validation, pagination, filtering, sorting, search, and API error handling.

            ## Instructions
            - Every endpoint must explicitly consider authentication and authorization.
            - Validate untrusted input on the server.
            - Return consistent error responses and appropriate HTTP status codes.
            - Avoid leaking stack traces or sensitive details.
            - Add pagination for list endpoints.
            - Consider rate limiting for public, auth, checkout, and abuse-prone endpoints.
            - Keep API responses typed and documented where useful.
        """,
    },
    "webhooks": {
        "description": "Guide secure webhook verification, idempotent processing, retries, duplicate events, event logging, and failure handling.",
        "body": """
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
        """,
        "refs": {
            "webhook-security.md": """
                # Webhook Security

                Verify the raw body and signature according to the provider's current docs. Do not parse or mutate the body in a way that invalidates signature verification.
            """,
        },
    },
    "security": {
        "description": "Guide ecommerce application security reviews covering XSS, CSRF, SQL injection, auth, authorization, secrets, file uploads, headers, and PII.",
        "body": """
            # Security Skill

            ## Use When
            Use before declaring any significant ecommerce feature complete, and for any auth, payment, API, upload, admin, or database work.

            ## Review Checklist
            - XSS and output encoding.
            - CSRF for state-changing actions where relevant.
            - SQL injection and unsafe query construction.
            - Authentication and session handling.
            - Authorization and privilege escalation.
            - Insecure direct object references.
            - Secret exposure and browser-visible variables.
            - API abuse and rate limiting.
            - Input validation.
            - Secure headers and cookie security.
            - Dependency vulnerabilities.
            - Webhook verification.
            - File upload security, image validation, malicious filenames, and SSRF.
            - Sensitive logging and PII protection.
        """,
        "refs": {
            "security-checklist.md": """
                # Security Checklist

                A feature is not complete until the agent has checked auth, authorization, secrets, validation, abuse paths, database permissions, RLS where applicable, and customer-visible error handling.
            """,
        },
    },
    "testing-playwright": {
        "description": "Guide testing strategy with unit, integration, database, API, and Playwright end-to-end coverage for ecommerce flows.",
        "body": """
            # Testing Playwright Skill

            ## Use When
            Use for test planning, implementation, verification, and release checks.

            ## Instructions
            - Do not consider a feature complete merely because the page renders.
            - Add unit tests where logic is isolated.
            - Add integration tests for APIs, database behavior, auth, and state transitions.
            - Use Playwright for critical ecommerce flows.
            - Test signup, login, logout, product browsing, search, cart, checkout, payment success, payment failure, order creation, order history, admin access, unauthorized access, inventory changes, and mobile navigation.
            - Include failure and edge cases, not just happy paths.
        """,
        "refs": {
            "testing-checklist.md": """
                # Testing Checklist

                Critical release checks should include typecheck, lint, unit/integration tests, Playwright smoke tests, and build. If a check cannot run, report why.
            """,
        },
    },
    "seo": {
        "description": "Guide ecommerce SEO with metadata, canonical URLs, sitemap, robots, structured data, product pages, category pages, and semantic HTML.",
        "body": """
            # SEO Skill

            ## Use When
            Use for product pages, category pages, metadata, sitemap, robots.txt, structured data, semantic HTML, and indexability.

            ## Instructions
            - Add unique titles and descriptions for important pages.
            - Use Open Graph and Twitter/X metadata where useful.
            - Use canonical URLs.
            - Maintain sitemap and robots.txt.
            - Use Product schema and Breadcrumb schema for ecommerce pages.
            - Create clean product and category URLs.
            - Use semantic HTML and crawlable content.
            - Avoid hiding all meaningful content behind client-only rendering.
        """,
        "refs": {
            "seo-checklist.md": """
                # SEO Checklist

                Review metadata, canonical URL, structured data, semantic headings, image alt text, internal links, sitemap inclusion, indexability, and product/category URL quality.
            """,
        },
    },
    "performance": {
        "description": "Guide ecommerce performance through rendering strategy, caching, image optimization, bundle size, database indexes, query optimization, and Core Web Vitals.",
        "body": """
            # Performance Skill

            ## Use When
            Use for performance-sensitive pages, product listings, images, database queries, bundle size, caching, and Vercel behavior.

            ## Instructions
            - Measure first where possible.
            - Prefer server rendering and caching where appropriate.
            - Optimize product images and avoid oversized media.
            - Lazy-load below-the-fold or non-critical assets.
            - Avoid unnecessary client JavaScript.
            - Paginate large product and admin lists.
            - Add database indexes for common query paths.
            - Watch Core Web Vitals and production performance.
        """,
    },
    "accessibility": {
        "description": "Guide accessible ecommerce UI with semantic HTML, keyboard navigation, focus management, labels, forms, dialogs, menus, contrast, and error messages.",
        "body": """
            # Accessibility Skill

            ## Use When
            Use for UI components, forms, navigation, dialogs, menus, product pages, checkout, and admin interfaces.

            ## Instructions
            - Use semantic HTML first.
            - Ensure keyboard navigation works.
            - Manage focus in dialogs, menus, and route changes where needed.
            - Label inputs and controls clearly.
            - Use ARIA only when necessary.
            - Maintain color contrast.
            - Provide accessible form errors and status messages.
            - Target WCAG-compatible implementation.
        """,
    },
    "git-github": {
        "description": "Guide safe Git and GitHub workflows, branches, commits, PRs, reviews, CI, and secret-safe repository management.",
        "body": """
            # Git GitHub Skill

            ## Use When
            Use for branches, commits, pull requests, merge conflicts, GitHub Actions, repository organization, and code review.

            ## Instructions
            - Make focused commits with clear messages.
            - Use branches and pull requests for meaningful changes when appropriate.
            - Avoid destructive history changes unless explicitly requested.
            - Never commit `.env`, secrets, API keys, private certificates, Supabase service-role keys, or payment secrets.
            - Keep `.gitignore` current.
            - Use CI checks for linting, typecheck, tests, and builds where possible.
        """,
    },
    "vercel-deployment": {
        "description": "Guide Vercel deployment, environment variables, preview and production environments, domains, caching, serverless behavior, and deployment debugging.",
        "body": """
            # Vercel Deployment Skill

            ## Use When
            Use for Vercel projects, builds, environment variables, preview deployments, production deployments, domains, redirects, rewrites, caching, and deployment debugging.

            ## Instructions
            - Distinguish development, preview, and production.
            - Configure environment variables in the correct Vercel environment.
            - Never expose production secrets in source code.
            - Check build logs carefully.
            - Understand serverless function limits and runtime behavior.
            - Configure domains, redirects, rewrites, and caching deliberately.
        """,
        "refs": {
            "vercel-deployment.md": """
                # Vercel Deployment Reference

                Before production deploys, verify environment variables, build command, framework detection, domain configuration, API route/runtime behavior, and post-deploy smoke tests.
            """,
        },
    },
    "environment-configuration": {
        "description": "Guide safe environment variable handling for local, development, preview, production, Vercel, public variables, and private secrets.",
        "body": """
            # Environment Configuration Skill

            ## Use When
            Use for `.env.local`, `.env.development`, `.env.production`, Vercel variables, Supabase keys, payment secrets, and public/private environment boundaries.

            ## Instructions
            - Keep secrets out of git.
            - Distinguish local, development, preview, and production values.
            - Treat public-variable prefixes such as `NEXT_PUBLIC_` as browser-visible.
            - Never put private keys, service-role keys, webhook secrets, or payment secrets in public variables.
            - Document required variables without exposing real values.
            - Provide `.env.example` with placeholders only.
        """,
    },
    "error-handling-observability": {
        "description": "Guide structured error handling, customer-safe messages, logging, monitoring, alerts, tracing, and sensitive data protection.",
        "body": """
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
        """,
    },
    "documentation": {
        "description": "Guide useful documentation for architecture, setup, environment variables, migrations, deployment, testing, admin procedures, troubleshooting, and integrations.",
        "body": """
            # Documentation Skill

            ## Use When
            Use when creating or updating project docs, setup instructions, architecture notes, deployment docs, migration docs, admin procedures, troubleshooting guides, and integration notes.

            ## Instructions
            - Document the actual implementation only.
            - Never document functionality that does not exist.
            - Keep setup instructions practical and testable.
            - Document environment variables using placeholder values.
            - Record database migration expectations and deployment steps.
            - Keep docs updated when implementation changes.
        """,
    },
    "code-review": {
        "description": "Guide risk-focused code review for correctness, security, performance, maintainability, TypeScript, database design, RLS, auth, payments, tests, accessibility, SEO, and errors.",
        "body": """
            # Code Review Skill

            ## Use When
            Use before considering significant ecommerce work complete, or when asked to review code.

            ## Review Priorities
            - Correctness and edge cases.
            - Security, auth, authorization, RLS, and secret handling.
            - Payment safety and webhook correctness.
            - Database design, migrations, constraints, and transactions.
            - TypeScript quality and runtime validation.
            - Performance and unnecessary client JavaScript.
            - Test coverage and missing failure paths.
            - Accessibility, SEO, mobile behavior, and error handling.

            ## Output Style
            Lead with findings ordered by severity. Identify risks instead of automatically approving everything. Include file and line references when reviewing actual code.
        """,
    },
}


workflow = """
    # Install Ecommerce Skills Workflow

    ## Objective
    Install or refresh the production ecommerce AI skill system for IK Electronics and Gadgets.

    ## Inputs
    - Master ecommerce skill prompt.
    - Target skills directory: `.claude/skills/`.
    - Marketplace/reference sources for maintained official skills.

    ## Steps
    1. Inspect existing `.claude/skills/`.
    2. Check whether official maintained skills exist for major platforms before duplicating them.
    3. Install focused local orchestration and domain skills where IK Electronics needs project-specific guidance.
    4. Keep every skill in its own folder with a valid `SKILL.md`.
    5. Put longer guidance in `references/`.
    6. Validate that every skill has YAML frontmatter with `name` and `description`.
    7. Keep skills concise and actionable.

    ## Expected Output
    - Individual skill folders in `.claude/skills/`.
    - Optional references inside each skill folder.
    - A summary of installed skills.
"""


def skill_markdown(name: str, description: str, body: str) -> str:
    return f"""---
name: {name}
description: {description}
---

{clean(body)}"""


def main() -> None:
    for name, spec in skills.items():
        skill_dir = SKILLS_DIR / name
        write(skill_dir / "SKILL.md", skill_markdown(name, spec["description"], spec["body"]))
        for ref_name, ref_body in spec.get("refs", {}).items():
            write(skill_dir / "references" / ref_name, ref_body)

    gitkeep = SKILLS_DIR / ".gitkeep"
    if gitkeep.exists():
        gitkeep.unlink()

    write(WORKFLOWS_DIR / "install_ecommerce_skills.md", workflow)

    print(f"Installed {len(skills)} ecommerce skills into {SKILLS_DIR}")


if __name__ == "__main__":
    main()
