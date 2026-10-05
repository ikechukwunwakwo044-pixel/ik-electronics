---
name: supabase-development
description: Guide Supabase project setup, Auth, Storage, SSR clients, migrations, Edge Functions, local development, and generated types.
---

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
