# Agent Workflow Rules

Use this file as the operating guide for Codex, Claude, Cursor, or any other coding agent working on hey-micki.

## Read these first

Before doing any task, read:

1. `START_HERE.md`
2. `DevelopmentWorkflow.md`
3. `AGENTS.md`
4. `docs/prd.md`
5. `docs/technical_decisions.md`
6. `tasks.md`

## Main rule

Work on one task only. Do not move to the next task without human approval.

## Scope rules

Do not add extra features. Do not refactor unrelated files. Do not install new tools unless the task asks for it. Do not change the architecture without approval.

## MVP focus

Build the local text-based MVP first:

- VS Code sidebar
- repo scanner
- local backend analysis endpoint
- readiness score
- missing production pieces
- next best step
- copyable coding-agent prompt

Voice comes later and is optional.

## Local-first rule

The first demo should run locally. Do not build cloud deployment, accounts, billing, or marketplace publishing until the MVP works locally.

## Verification rule

Every task must include:

- files changed
- how to test
- expected result
- any risks or blockers

A task is complete only when the human verifies it.

## Repo scanning rule

The extension should read only safe project context. It should skip large/generated folders like `node_modules`, `.git`, `.next`, `dist`, `build`, `coverage`, `.venv`, and `venv`.

## Response format after a task

```text
Task completed: [TASK ID]

Files changed:
- ...

How to test:
- ...

Expected result:
- ...

Notes / risks:
- ...
```
