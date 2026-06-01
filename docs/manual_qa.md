# Manual QA Checklist

Use this checklist before calling the MVP demo-ready.

## Desktop app

- [ ] Desktop app starts locally.
- [ ] `GET http://localhost:3737/health` returns `{ "ok": true }`.
- [ ] App window opens.
- [ ] App has a text input for asking Micki a question.
- [ ] App can show the latest project context.
- [ ] App can return a simple answer without a live AI model.

## VS Code plugin

- [ ] Plugin launches in VS Code Extension Development Host.
- [ ] Command palette shows **Send Context to Micki**.
- [ ] Running the command scans the open project.
- [ ] Plugin handles no workspace open.
- [ ] Plugin shows a clear error if the desktop app is not running.

## Context scan

- [ ] Workspace name is collected.
- [ ] File tree is collected.
- [ ] `package.json` is collected when present.
- [ ] README is collected when present.
- [ ] Current file path/language/preview is collected when available.
- [ ] Basic stack signals are detected.
- [ ] Large generated folders are skipped.

## Plugin to app connection

- [ ] Desktop app is running.
- [ ] `GET http://localhost:3737/health` returns `{ "ok": true }`.
- [ ] Plugin sends context to `http://localhost:3737/context`.
- [ ] Desktop app confirms context was received.
- [ ] Desktop app shows or uses the latest context.
- [ ] Stop the desktop app, run **Send Context to Micki**, and confirm VS Code shows a clear error that the Micki desktop app is not running.

## Micki response

Ask in the desktop app:

```text
What should I do next?
```

Check that Micki shows:

- [ ] project summary
- [ ] detected stack
- [ ] missing production pieces
- [ ] readiness score
- [ ] next best step
- [ ] simple explanation
- [ ] copyable prompt for Cursor/Codex/Claude

## Done

The MVP is demo-ready when:

- [ ] desktop app works
- [ ] VS Code plugin works
- [ ] plugin sends context to app
- [ ] app answers a typed question using the latest context
- [ ] the demo can be completed in 3-5 minutes
