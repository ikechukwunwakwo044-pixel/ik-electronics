---
name: api-development
description: Guide secure API and server action development with validation, authorization, status codes, pagination, filtering, sorting, and error responses.
---

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
