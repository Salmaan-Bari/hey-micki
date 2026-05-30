# Local Setup Guide

This guide explains how to run hey-micki locally once the MVP scaffold exists.

At the time this guide was created, the repo was documentation-only. Commands below are the intended setup once the backend and extension tasks have been completed.

## Prerequisites

Install:

- Node.js LTS
- npm
- VS Code
- Git

Recommended VS Code extensions:

- ESLint, once linting exists
- Prettier, once formatting exists

## Intended folder structure

```text
hey-micki/
  apps/
    api/
      package.json
      src/
        server.ts
    extension/
      package.json
      src/
        extension.ts
      media/
  docs/
  tasks.md
  START_HERE.md
  AGENTS.md
```

## Backend local run

Once `apps/api` exists:

```bash
cd apps/api
npm install
npm run dev
```

Expected result:

```text
hey-micki API listening on http://localhost:8787
```

Health check:

```bash
curl http://localhost:8787/health
```

Expected result:

```json
{ "ok": true }
```

## Extension local run

Once `apps/extension` exists:

```bash
cd apps/extension
npm install
npm run compile
```

Then:

1. Open the repo in VS Code.
2. Open the Run and Debug panel.
3. Launch the Extension Development Host.
4. In the new VS Code window, open a sample project.
5. Open the hey-micki sidebar or run the command palette command.

## Expected MVP flow

1. Start backend on port `8787`.
2. Launch extension development host.
3. Open a project folder.
4. Click **Scan Repo**.
5. See project analysis in the sidebar.
6. Copy the generated agent prompt.

## Environment configuration

The MVP should work without model configuration by using deterministic analysis.

If optional model support is added later, use an example file such as:

```text
apps/api/.env.example
```

Do not commit local environment files.

## Troubleshooting

### Backend is offline

Check that the API is running:

```bash
curl http://localhost:8787/health
```

### Extension cannot connect

Confirm the backend URL in the extension points to:

```text
http://localhost:8787/api/analyse
```

### Sidebar is blank

Check the Extension Development Host logs and the browser/webview console.

### Scan is too slow

Confirm the scanner skips generated folders and uses file-count limits.

## First real local test

Use a small sample app first, not a huge real project.

Recommended sample:

```text
demo/sample-next-app
```

The sample should intentionally miss several production pieces so hey-micki has something useful to detect.
