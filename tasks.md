# hey-micki MVP Tasks

Use this file as the build tracker. Read `START_HERE.md`, `DevelopmentWorkflow.md`, `AGENTS.md`, `docs/prd.md`, and `docs/technical_decisions.md` before starting any task.

## Working rules

- One task at a time.
- Human approval before moving on.
- Keep every task small enough for one commit.
- Do not add extra features.
- Text-based local MVP first. Voice is optional later.

---

## Milestone 0: Documentation Foundation

Goal: Make the repo easy for future agents to understand.

- [x] M0.1 Add `START_HERE.md`
- [x] M0.2 Add `AGENTS.md`
- [x] M0.3 Add `docs/prd.md`
- [x] M0.4 Add `docs/technical_decisions.md`
- [x] M0.5 Add `docs/repo_audit.md`
- [x] M0.6 Add `docs/api_schema.md`
- [x] M0.7 Add `docs/local_setup.md`
- [x] M0.8 Add `docs/manual_qa.md`
- [x] M0.9 Add `docs/demo_script.md`

Acceptance criteria:

- Future Codex sessions know the product goal.
- Future Codex sessions know the MVP scope.
- Future Codex sessions know what not to build yet.
- Future Codex sessions have a clear next coding milestone.

---

## Milestone 1: Backend API Skeleton

Goal: Create a local backend the extension can call.

### P3.1 Scaffold backend API

- [ ] Create `apps/api` TypeScript backend.
- Expected files:
  - `apps/api/package.json`
  - `apps/api/tsconfig.json`
  - `apps/api/src/server.ts`
- Acceptance criteria:
  - Backend starts locally.
  - Server listens on port `8787`.
  - `GET /health` returns `{ "ok": true }`.
- Do not do yet:
  - No analyse endpoint.
  - No model integration.

### P3.2 Add analyse endpoint with mock response

- [ ] Add `POST /api/analyse`.
- Expected files:
  - `apps/api/src/routes/analyse.ts`
  - `apps/api/src/types.ts`
  - `apps/api/src/server.ts`
- Acceptance criteria:
  - Valid payload returns all required response fields from `docs/api_schema.md`.
  - Invalid payload returns a clear error.
  - Response is deterministic.
- Do not do yet:
  - No scoring engine.
  - No model integration.

### P3.3 Add deterministic analysis service

- [ ] Replace mock response with rule-based analysis.
- Expected files:
  - `apps/api/src/services/analyseProject.ts`
  - `apps/api/src/services/composeResponse.ts`
  - `apps/api/src/services/buildAgentPrompt.ts`
- Acceptance criteria:
  - Detects obvious stack from request.
  - Produces missing production pieces.
  - Produces readiness score from 0 to 100.
  - Produces one next best step.
  - Produces one paste-ready coding-agent prompt.
- Do not do yet:
  - No live model calls.

### P3.4 Add backend tests

- [ ] Add tests for backend API and analysis services.
- Expected files:
  - backend test files under `apps/api/src`
- Acceptance criteria:
  - Health route test passes.
  - Analyse route test passes.
  - Analysis service tests pass.
  - Prompt builder test passes.

---

## Milestone 2: VS Code Extension Skeleton

Goal: Create an extension that launches and exposes the first UI entry points.

### P2.1 Scaffold VS Code extension

- [ ] Create `apps/extension` TypeScript extension.
- Expected files:
  - `apps/extension/package.json`
  - `apps/extension/tsconfig.json`
  - `apps/extension/src/extension.ts`
- Acceptance criteria:
  - Extension compiles.
  - Extension launches in Extension Development Host.

### P2.2 Add command palette command

- [ ] Add `Hey Micki: Scan Repo` command.
- Expected files:
  - `apps/extension/package.json`
  - `apps/extension/src/extension.ts`
- Acceptance criteria:
  - Command appears in command palette.
  - Running it shows a simple message.
- Do not do yet:
  - No backend call.

### P2.3 Add sidebar placeholder

- [ ] Add VS Code sidebar/webview.
- Expected files:
  - `apps/extension/src/ui/SidebarProvider.ts`
  - `apps/extension/media/main.js`
  - `apps/extension/media/styles.css`
- Acceptance criteria:
  - Sidebar appears.
  - Sidebar shows title and scan button.
- Do not do yet:
  - No voice.

---

## Milestone 3: Safe Context Scanner

Goal: Extract useful project context from the current workspace.

### P2.4 Detect workspace root

- [ ] Detect active workspace root.
- Expected file: `apps/extension/src/context/workspace.ts`
- Acceptance criteria:
  - Handles no workspace open.
  - Returns workspace name and root URI.

### P2.5 Extract capped file tree

- [ ] Extract project file tree with skip rules and limits.
- Expected file: `apps/extension/src/context/fileTree.ts`
- Acceptance criteria:
  - Returns relative paths.
  - Skips generated folders.
  - Uses max depth and max file count.

### P2.6 Read key files

- [ ] Read key project files where present.
- Expected file: `apps/extension/src/context/keyFiles.ts`
- Acceptance criteria:
  - Reads `package.json` if present.
  - Reads README if present.
  - Applies content caps.
  - Handles missing files.

### P2.7 Detect stack and production signals

- [ ] Detect framework, package manager, and production signals.
- Expected files:
  - `apps/extension/src/context/detectStack.ts`
  - `apps/extension/src/context/detectProductionSignals.ts`
- Acceptance criteria:
  - Detects common frameworks where obvious.
  - Detects package manager from lockfiles.
  - Detects auth, database, payments, deployment, tests indicators.
  - Uses `unknown` where evidence is unclear.

### P2.8 Build context payload

- [ ] Combine scanner outputs into API payload.
- Expected files:
  - `apps/extension/src/context/buildProjectContext.ts`
  - `apps/extension/src/types.ts`
- Acceptance criteria:
  - Payload matches `docs/api_schema.md`.
  - Command can log a safe summary.

---

## Milestone 4: Integration and UI

Goal: Send scanned context to backend and render the analysis.

### P2.9 Add backend client

- [ ] Send project context to backend.
- Expected file: `apps/extension/src/api/client.ts`
- Acceptance criteria:
  - Sends request to `http://localhost:8787/api/analyse`.
  - Handles backend offline.
  - Returns typed response.

### P2.10 Wire sidebar scan button

- [ ] Make sidebar scan button call scanner and backend.
- Expected files:
  - `apps/extension/src/ui/SidebarProvider.ts`
  - `apps/extension/media/main.js`
- Acceptance criteria:
  - Scan button triggers scan.
  - Loading state appears.
  - Backend response is received.
  - Offline backend error is shown clearly.

### P2.11 Render analysis cards

- [ ] Render backend response in sidebar.
- Expected files:
  - `apps/extension/media/main.js`
  - `apps/extension/media/styles.css`
- Acceptance criteria:
  - Shows project summary.
  - Shows detected stack.
  - Shows missing pieces.
  - Shows readiness score.
  - Shows next best step.
  - Shows simple explanation.

### P2.12 Add copy prompt button

- [ ] Add copy button for generated coding-agent prompt.
- Expected files:
  - `apps/extension/media/main.js`
  - `apps/extension/media/styles.css`
- Acceptance criteria:
  - Prompt is visible.
  - Copy button works.
  - User gets confirmation.

---

## Milestone 5: Demo and QA

Goal: Make the MVP easy to demo and verify.

### D1 Create sample demo project

- [ ] Add `demo/sample-next-app`.
- Acceptance criteria:
  - Has obvious stack signals.
  - Intentionally misses production pieces.
  - Scans quickly.

### D2 Run manual QA

- [ ] Complete `docs/manual_qa.md`.
- Acceptance criteria:
  - Required checklist items are verified.
  - Any failures become follow-up tasks.

### D3 Rehearse demo script

- [ ] Run through `docs/demo_script.md`.
- Acceptance criteria:
  - Demo takes 3-5 minutes.
  - Fallback path exists.

---

## Optional Milestone 6: Lightweight Voice

Only start after the text-based MVP works.

- [ ] V1 Add text question input.
- [ ] V2 Add optional push-to-talk in sidebar.
- [ ] V3 Add optional spoken response.

Do not build a standalone voice app yet.

---

## Post-MVP Roadmap

Do not build until the MVP is demoable:

- [ ] standalone voice app
- [ ] user accounts
- [ ] persistent project history
- [ ] database storage
- [ ] hosted backend
- [ ] web dashboard
- [ ] GitHub PR review mode
- [ ] deeper Cursor/Claude/Codex integrations
- [ ] VS Code Marketplace publishing
- [ ] learning paths
- [ ] analytics
- [ ] payments
- [ ] CI/CD
- [ ] monitoring
