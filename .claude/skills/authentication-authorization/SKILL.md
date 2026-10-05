---
name: authentication-authorization
description: Guide authentication, authorization, roles, sessions, protected routes, account ownership, and secure auth flows.
---

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
