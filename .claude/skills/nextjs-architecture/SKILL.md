---
name: nextjs-architecture
description: Guide production Next.js App Router architecture with safe server/client boundaries, routing, metadata, caching, and performance behavior.
---

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
