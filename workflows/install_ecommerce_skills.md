# Install Ecommerce Skills Workflow

## Objective
Install or refresh the production ecommerce AI skill system for IK Electronics and Gadgets.

## Inputs
- Master ecommerce skill prompt.
- Target skills directory: `.claude/skills/`.
- Marketplace/reference sources for maintained official skills.

## Steps
1. Inspect existing `.claude/skills/`.
2. Check whether official maintained skills exist for major platforms before duplicating them.
3. Install focused local orchestration and domain skills where IK Electronics needs project-specific guidance.
4. Keep every skill in its own folder with a valid `SKILL.md`.
5. Put longer guidance in `references/`.
6. Validate that every skill has YAML frontmatter with `name` and `description`.
7. Keep skills concise and actionable.

## Expected Output
- Individual skill folders in `.claude/skills/`.
- Optional references inside each skill folder.
- A summary of installed skills.
