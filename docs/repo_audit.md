# Repo Audit

## Purpose

This document captures the starting state of the hey-micki repository so future agents do not guess what already exists.

## Repository

- Name: `hey-micki`
- Owner: `Salmaan-Bari`
- Default branch: `main`
- Visibility: private
- Product description: AI tool to teach you while you vibe code and help you ship with best practices

## Files present before planning docs

The repository initially contained:

- `README.md`
- `DevelopmentWorkflow.md`

## Files added as planning foundation

The documentation foundation should include:

- `START_HERE.md`
- `AGENTS.md`
- `docs/prd.md`
- `docs/technical_decisions.md`
- `docs/repo_audit.md`
- `docs/local_setup.md`
- `docs/manual_qa.md`
- `docs/demo_script.md`
- `docs/api_schema.md`
- `tasks.md`

## Current app/code status

At the start of planning:

- no VS Code extension scaffold exists
- no backend scaffold exists
- no `package.json` exists at the root
- no lockfile exists
- no frontend app exists
- no database exists
- no test setup exists
- no lint/format setup exists
- no deployment setup exists

## Implication for future tasks

Future implementation tasks should create the codebase from scratch using the documented MVP defaults.

Agents should not claim that a stack, test framework, or deployment approach already exists unless it has been added in a later commit.

## First implementation milestone

The first coding milestone should be the backend health check because it is small, testable, and gives the extension a target to call later.

Recommended first coding task:

```text
P3.1 Scaffold backend API with GET /health on port 8787.
```

After that, build:

1. `POST /api/analyse` mock endpoint
2. deterministic analysis service
3. VS Code extension scaffold
4. safe context scanner
5. sidebar UI
6. full integration flow
