# Workflows (Layer 1: The Instructions)

This folder contains Standard Operating Procedures (SOPs) written in Markdown.

## Core Rules for Workflows:
- Written in plain language, the same way you'd brief a teammate.
- Each workflow defines:
  1. **Objective**: What are we trying to accomplish?
  2. **Required Inputs**: What data, credentials, or parameters are needed?
  3. **Tools to Use**: Deterministic scripts in `tools/` that execute each step.
  4. **Expected Outputs**: Where deliverables or outputs end up (cloud services).
  5. **Edge Cases & Error Handling**: How to recover from known failures.
  6. **Learnings & Constraints Log**: Notes on rate limits, quirks, and past fixes.

> **Important**: Do not create or overwrite workflows without asking unless explicitly instructed. Workflows represent preserved organizational knowledge and are refined through the Self-Improvement Loop.
