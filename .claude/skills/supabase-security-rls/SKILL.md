---
name: supabase-security-rls
description: Guide Supabase Row Level Security policies for customer ownership, admin access, storage access, and privilege escalation prevention.
---

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
