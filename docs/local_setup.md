# Local Setup

The MVP has two local apps:

1. `apps/desktop` — macOS app for chatting with Micki
2. `apps/extension` — VS Code plugin for sending project context

## Prerequisites

Install:

- Node.js LTS
- npm
- VS Code
- Git

## Intended folder structure

```text
hey-micki/
  apps/
    desktop/
      package.json
      src/
    extension/
      package.json
      src/
  docs/
  tasks.md
```

## Run the desktop app

Once `apps/desktop` exists:

```bash
cd apps/desktop
npm install
npm run dev
```

Check the local server:

```bash
curl http://localhost:3737/health
```

Expected:

```json
{ "ok": true }
```

## Run the VS Code plugin

Once `apps/extension` exists:

```bash
cd apps/extension
npm install
npm run compile
```

Then:

1. Open the repo in VS Code.
2. Start the Extension Development Host.
3. Open a test project in the new VS Code window.
4. Run **Send Context to Micki**.

## MVP test flow

1. Start the desktop app.
2. Confirm `http://localhost:3737/health` works.
3. Launch the VS Code plugin.
4. Open a sample project.
5. Run **Send Context to Micki**.
6. Desktop app receives the context.
7. In the desktop app, ask: **What should I do next?**
8. Micki returns a useful answer and copyable prompt.

## Troubleshooting

### Plugin cannot connect

Make sure the desktop app is running and this works:

```bash
curl http://localhost:3737/health
```

### Context does not appear in the app

Check:

- the plugin command was run
- the desktop app local server is running
- the plugin is sending to `http://localhost:3737/context`

### App answer is weak

That is okay for the first MVP. Start with deterministic answers. Improve the answer quality later.
