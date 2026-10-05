---
name: environment-configuration
description: Guide safe environment variable handling for local, development, preview, production, Vercel, public variables, and private secrets.
---

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
