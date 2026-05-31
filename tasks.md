# MVP Tasks

Build the simplest possible MVP:

1. **macOS app** where the user talks/types to Micki.
2. **VS Code plugin** that sends project context to the app.

Do one task at a time. Do not build extra features.

---

## Milestone 1: Desktop app shell

Goal: create the app that the plugin will send context to.

### D1 Create desktop app shell

- [ ] Create `apps/desktop`.
- [ ] Use Electron + React + TypeScript.
- [ ] App window opens.
- [ ] Local server runs on port `3737`.
- [ ] `GET /health` returns `{ "ok": true }`.

Expected files:

- `apps/desktop/package.json`
- `apps/desktop/src/main.ts`
- `apps/desktop/src/server.ts`
- `apps/desktop/src/renderer/App.tsx`

Do not add project context yet.

### D2 Add context endpoint

- [ ] Add `POST /context` to the desktop app local server.
- [ ] Store the latest context in memory.
- [ ] Return `{ "ok": true, "message": "Context received" }`.
- [ ] Show in the app whether context has been received.

Expected files:

- `apps/desktop/src/server.ts`
- `apps/desktop/src/contextStore.ts`
- `apps/desktop/src/renderer/App.tsx`

Do not add AI/model calls yet.

### D3 Add typed question UI

- [ ] Add a text input in the desktop app.
- [ ] Add an Ask button.
- [ ] User can ask: `What should I do next?`
- [ ] App returns a simple deterministic answer using the latest context.

Expected files:

- `apps/desktop/src/renderer/App.tsx`
- `apps/desktop/src/answerMicki.ts`

Do not add voice yet.

---

## Milestone 2: VS Code plugin shell

Goal: create a plugin command that can later send context to the desktop app.

### V1 Create VS Code plugin shell

- [ ] Create `apps/extension`.
- [ ] Use TypeScript.
- [ ] Plugin launches in VS Code Extension Development Host.
- [ ] Add command: `Send Context to Micki`.
- [ ] Running the command shows a simple success message.

Expected files:

- `apps/extension/package.json`
- `apps/extension/tsconfig.json`
- `apps/extension/src/extension.ts`

Do not scan files yet.

### V2 Scan basic project context

- [ ] Detect workspace name.
- [ ] Read capped file tree.
- [ ] Read `package.json` if present.
- [ ] Read README if present.
- [ ] Read current file path/language/preview if available.
- [ ] Skip large generated folders.

Expected files:

- `apps/extension/src/context.ts`

Do not send context yet.

### V3 Send context to desktop app

- [ ] Send scanned context to `http://localhost:3737/context`.
- [ ] Show success if the app receives context.
- [ ] Show clear error if the desktop app is not running.

Expected files:

- `apps/extension/src/extension.ts`
- `apps/extension/src/context.ts`
- `apps/extension/src/client.ts`

---

## Milestone 3: Micki answer quality

Goal: make the typed answer useful enough for demo.

### A1 Add project analysis

- [ ] Detect simple stack from package files.
- [ ] Detect missing production pieces.
- [ ] Create readiness score.
- [ ] Create next best step.
- [ ] Create copyable prompt for Cursor/Codex/Claude.

Expected files:

- `apps/desktop/src/analyseProject.ts`
- `apps/desktop/src/answerMicki.ts`

Do not add live AI/model calls yet.

### A2 Render answer clearly

- [ ] Show project summary.
- [ ] Show detected stack.
- [ ] Show missing pieces.
- [ ] Show readiness score.
- [ ] Show next best step.
- [ ] Show copyable coding-agent prompt.

Expected files:

- `apps/desktop/src/renderer/App.tsx`

---

## Milestone 4: Demo and QA

### Q1 Manual QA

Use `docs/manual_qa.md`.

MVP is ready when:

- [ ] desktop app runs
- [ ] health endpoint works
- [ ] VS Code plugin runs
- [ ] plugin scans project context
- [ ] plugin sends context to desktop app
- [ ] desktop app answers a typed question
- [ ] answer includes a next step and prompt

### Q2 Demo script

Use `docs/demo_script.md`.

Demo should take 3-5 minutes.

---

## Later, not now

Do not build yet:

- voice input
- AI/model calls
- accounts
- database
- payments
- hosted backend
- marketplace publishing
- analytics
- GitHub PR reviews
