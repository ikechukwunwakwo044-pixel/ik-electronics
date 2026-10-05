# [Workflow Name]

## 1. Objective
Brief description of the end goal and desired outcome.

## 2. Required Inputs
- Input data or files needed
- Environment variables or credentials required (stored in `.env`)
- Target destinations (e.g., Google Sheet ID, Drive Folder)

## 3. Tools to Use
- `tools/<script_name>.py` - Purpose of this tool and command invocation format.

## 4. Execution Steps
1. Step 1: Run `python tools/<script_name>.py --arg ...`
2. Step 2: Validate intermediate outputs in `.tmp/`.
3. Step 3: Run upload / export tool to publish deliverable to cloud service.

## 5. Expected Deliverables & Outputs
- Deliverable location: [Google Sheets / Slides / Drive URL or cloud destination]
- Intermediate files (disposable): `.tmp/<temp_file>`

## 6. Edge Cases & Error Handling
- Case A: Rate limit encountered -> Backoff & retry or batch.
- Case B: Missing credentials -> Check `.env`.

## 7. Learnings & Constraints Log
- *YYYY-MM-DD*: Documented quirks, API constraints, or batching requirements.
