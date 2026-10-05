---
name: security
description: Guide ecommerce application security reviews covering XSS, CSRF, SQL injection, auth, authorization, secrets, file uploads, headers, and PII.
---

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
