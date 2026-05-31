# hey-micki

A simple coding coach for vibe coders.

## MVP

Build two local pieces first:

1. **VS Code plugin** — scans the open project and sends context.
2. **macOS app** — lets the user talk/type to Micki and get clear next steps.

The plugin gives Micki project context. The macOS app is where the user chats with Micki.

## First demo flow

1. Open a project in VS Code.
2. Run the hey-micki plugin command: **Send Context to Micki**.
3. Open the hey-micki macOS app.
4. Ask: “What should I do next?”
5. Micki replies with:
   - project summary
   - detected stack
   - missing production pieces
   - readiness score
   - next best step
   - prompt to paste into Cursor/Codex/Claude

## Read first

- `START_HERE.md` — simplest overview
- `tasks.md` — exact build order
- `AGENTS.md` — rules for Codex/Claude/Cursor
- `docs/prd.md` — MVP product requirements
- `docs/technical_decisions.md` — chosen simple stack
- `docs/api_schema.md` — local plugin/app contract
- `docs/local_setup.md` — local run guide
- `docs/manual_qa.md` — human QA checklist
- `docs/demo_script.md` — demo script

## Current focus

Focus only on the local MVP.

Do not build accounts, payments, hosted deployment, marketplace publishing, or a full production system yet.
