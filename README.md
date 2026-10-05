# IK Electronics - WAT Architecture

This project is structured and operated according to the **WAT Architecture** (Workflows, Agents, Tools).

---

## The WAT Architecture

### Layer 1: Workflows (The Instructions)
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

### Layer 2: Agents (The Decision-Maker)
- Intelligent coordination, orchestration, and decision-making
- Read relevant workflows, invoke tools in correct sequence, handle failures gracefully, and ask clarifying questions when needed
- Connects intent to execution without trying to do every deterministic step directly

### Layer 3: Tools (The Execution)
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys stored in `.env`
- Consistent, testable, and fast

---

## Directory Layout

```text
IK Electronics/
├── .tmp/                         # Temporary files (scraped data, intermediate exports). Disposable.
├── tools/                        # Python scripts for deterministic execution
│   └── README.md
├── workflows/                    # Markdown SOPs defining what to do and how
│   ├── README.md
│   └── _workflow_template.md
├── .env                          # API keys and environment variables (NEVER commit)
├── .env.example                  # Template for environment variables
├── .gitignore                    # Ignores .tmp, secrets, credentials, python cache
├── AGENTS.md                     # Agent system instructions & operational rules
├── GEMINI.md                     # Antigravity/Gemini agent rules
└── README.md                     # Project documentation
```

---

## How to Operate

1. **Look for existing tools first**: Check `tools/` based on what the workflow requires. Only create new scripts when nothing exists.
2. **Learn and adapt when things fail**:
   - Read full error messages and traces.
   - Fix the script and retest (if it uses paid API calls or credits, check before re-running).
   - Document learnings in the workflow (rate limits, timing quirks, edge cases).
3. **Keep workflows current**: Refine workflows as new constraints or better methods emerge. Do not create or overwrite workflows without asking unless explicitly instructed.

---

## The Self-Improvement Loop

```
[ Identify what broke ] ──> [ Fix the tool ] ──> [ Verify fix works ] ──> [ Update workflow ] ──> [ Robust system ]
```

---

## Deliverables vs. Intermediates
- **Deliverables**: Final outputs live in cloud services (Google Sheets, Slides, Drive, etc.) for direct user access.
- **Intermediates**: Temporary processing files live in `.tmp/` and can be regenerated at any time.
