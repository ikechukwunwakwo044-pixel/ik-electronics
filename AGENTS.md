# The WAT Architecture

## Layer 1: Workflows (The Instructions)
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

## Layer 2: Agents (The Decision-Maker)
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself
- **Example**: If you need to pull data from a website, don't attempt it directly. Read `workflows/scrape_website.md`, figure out the required inputs, then execute `tools/scrape_single_site.py`

## Layer 3: Tools (The Execution)
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

> **Why this matters**: When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

---

## How to Operate

1. **Look for existing tools first**  
   Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

2. **Learn and adapt when things fail**  
   When you hit an error:
   - Read the full error message and trace.
   - Fix the script and retest (if it uses paid API calls or credits, check with the user before running again).
   - Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior).
   - *Example*: You get rate-limited on an API, so you dig into the docs, discover a batch endpoint, refactor the tool to use it, verify it works, then update the workflow so this never happens again.

3. **Keep workflows current**  
   Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless explicitly told to. These are your instructions and need to be preserved and refined, not tossed after one use.

---

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow with the new approach
5. Move on with a more robust system

This loop is how the framework improves over time.

---

## File Structure

### What goes where:
- **Deliverables**: Final outputs go to cloud services (Google Sheets, Slides, etc.) where the user can access them directly.
- **Intermediates**: Temporary processing files that can be regenerated.

### Directory layout:
```text
.tmp/                         # Temporary files (scraped data, intermediate exports). Regenerated as needed.
tools/                        # Python scripts for deterministic execution
workflows/                    # Markdown SOPs defining what to do and how
.env                          # API keys and environment variables (NEVER store secrets anywhere else)
credentials.json, token.json  # Google OAuth (gitignored)
```

**Core principle**: Local files are just for processing. Anything the user needs to see or use lives in cloud services. Everything in `.tmp/` is disposable.

---

## Bottom Line
You sit between what the user wants (workflows) and what actually gets done (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

**Stay pragmatic. Stay reliable. Keep learning.**

---

# Ecommerce Skill System

This project includes a production ecommerce AI skill system in `.claude/skills/`.

Use `ecommerce-master` before major ecommerce website work. It coordinates the specialized skills for Next.js, React, TypeScript, Supabase, PostgreSQL, RLS, authentication, payments, inventory, admin dashboards, UI/UX, Tailwind, shadcn/ui, APIs, webhooks, security, testing, SEO, performance, accessibility, GitHub, Vercel, environment configuration, observability, documentation, and code review.

Important rules:
- Treat the ecommerce website as a real production software product, not a demo.
- Never fake checkout, payments, authentication, inventory, or backend behavior when real implementation is required.
- Never expose secrets, Supabase service-role keys, payment secrets, or private API keys to the browser.
- Use workflows in `workflows/` and deterministic tools in `tools/` whenever possible.
- Run relevant verification before declaring ecommerce work complete: typecheck, lint, tests, build, security review, and deployment checks where available.
