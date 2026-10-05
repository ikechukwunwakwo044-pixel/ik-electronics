# Tools (Layer 3: The Execution)

This directory contains standalone Python scripts responsible for executing discrete tasks deterministically.

## Principles:
1. **Deterministic & Testable**: Scripts should produce predictable outcomes given specific inputs.
2. **Secrets via `.env`**: Load API keys, tokens, and sensitive parameters strictly from environment variables or `.env`. Never hardcode secrets.
3. **Check Existing First**: Always inspect this directory before creating a new tool. Avoid duplicating scripts.
4. **Intermediate Files**: Temporary files should be saved in `../.tmp/` and treated as disposable.
5. **Clean Error Reporting**: Provide informative error messages and stack traces to facilitate fast diagnosis in the Self-Improvement Loop.
