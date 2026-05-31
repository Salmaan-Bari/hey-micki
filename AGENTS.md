# Agent Rules

These rules are for Codex, Claude, Cursor, or any coding agent working on hey-micki.

## Read first

Before coding, read:

1. `START_HERE.md`
2. `AGENTS.md`
3. `docs/prd.md`
4. `docs/technical_decisions.md`
5. `tasks.md`

## Main rule

Do one task only.

Do not move to the next task unless the human approves it.

## MVP focus

The MVP is:

- a VS Code plugin that scans project context
- a macOS app where the user talks/types to Micki
- a local connection between the plugin and app

The plugin is for context. The macOS app is for conversation.

## Do not add yet

Do not add:

- accounts
- payments
- database
- hosted backend
- analytics
- marketplace publishing
- GitHub integrations
- complex deployment

## File scanning rule

The plugin should only scan useful project files.

Skip large/generated folders such as:

- `node_modules`
- `.git`
- `.next`
- `dist`
- `build`
- `coverage`
- `.venv`
- `venv`

Use file count and file size limits.

## After each task, report

```text
Task completed: [TASK ID]

Files changed:
- ...

How to test:
- ...

Expected result:
- ...

Risks/blockers:
- ...
```
