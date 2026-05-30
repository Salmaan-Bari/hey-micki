# hey-micki Start Here

This document is the single starting point for future work on **hey-micki**.

hey-micki is a voice-first coding coach for vibe coders. The weekend MVP is intentionally smaller than the full vision: a VS Code sidebar that scans the current repository, sends compact project context to a local backend, and returns a practical shipping assessment.

## 1. Product in one sentence

hey-micki helps vibe coders understand what they are building, what is missing before shipping, and what exact next task to give to Cursor, Codex, Claude, or another coding agent.

## 2. Weekend MVP target

The first demo should prove this core loop:

1. Open a project in VS Code.
2. Open the hey-micki sidebar.
3. Click **Scan Repo**.
4. The extension collects safe project context.
5. The extension sends that context to a local backend.
6. The backend analyses the project.
7. The sidebar shows:
   - project summary
   - detected stack
   - missing production pieces
   - ship readiness score
   - next best step
   - simple explanation
   - copyable Cursor/Codex/Claude prompt

Voice is optional for the weekend. If added, it must be a lightweight Web Speech API feature inside the VS Code webview only. Do not build a separate app yet.

## 3. Current repo status

The repo currently starts as a clean documentation-first project. At the time these docs were added, the repo had:

- `README.md`
- `DevelopmentWorkflow.md`

No existing app scaffold, package manager, deployment setup, tests, or linting conventions were present yet.

## 4. Core docs

Read these in this order before coding:

1. `DevelopmentWorkflow.md` — the human-in-the-loop development process.
2. `AGENTS.md` — agent rules and hard constraints.
3. `docs/prd.md` — product requirements for the MVP.
4. `docs/technical_decisions.md` — stack decisions and non-goals.
5. `tasks.md` — implementation tasks in order.
6. `docs/local_setup.md` — how to run things locally once scaffolded.
7. `docs/manual_qa.md` — human verification checklist.
8. `docs/demo_script.md` — final demo scenario.

## 5. How to use Codex safely

Do not give Codex the full product vision and ask it to build everything.

Use this pattern:

```text
Read START_HERE.md, DevelopmentWorkflow.md, AGENTS.md, docs/prd.md, docs/technical_decisions.md, and tasks.md.

Work on exactly this task: [TASK ID AND NAME]

Touch only the expected files listed in tasks.md unless you explain why another file is required.
Do not start the next task.
Do not add extra features.
Show what changed and how to test it.
```

## 6. Build order

The practical MVP build order is:

1. Documentation and project rules.
2. Backend health check.
3. Backend `/api/analyse` mock endpoint.
4. Deterministic project analysis service.
5. VS Code extension scaffold.
6. Command palette scan command.
7. Safe context scanner.
8. Extension-to-backend request.
9. Sidebar webview.
10. Render project assessment.
11. Copyable agent prompt.
12. Manual QA.
13. Demo script.
14. Optional voice.

## 7. What not to build yet

Do not build these until the local text-based MVP works:

- standalone voice app
- user accounts
- database
- persistent project history
- payments
- analytics
- GitHub PR review integration
- Cursor/Claude/Codex API integrations
- marketplace publishing
- production CI/CD
- cloud deployment

## 8. Definition of weekend success

The weekend MVP is successful if someone can watch a demo and understand:

- hey-micki can inspect a real codebase from VS Code;
- it can explain what the project is;
- it can identify missing shipping pieces;
- it can produce a clear next action;
- it can generate a useful prompt for a coding agent.

The MVP does not need to be production-ready. It needs to be clear, useful, and demoable.
