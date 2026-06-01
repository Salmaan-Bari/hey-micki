# Start Here

hey-micki is a local coding coach for vibe coders.

The MVP has two parts:

1. **VS Code plugin** — reads the project the user is working on.
2. **macOS desktop app** — lets the user type or speak to Micki.

The plugin gives Micki project context. The desktop app uses that context to explain what the user is building, what decisions matter, and what to do next.

## Current working loop

This already works:

1. User opens a project in VS Code.
2. User runs **Send Context to Micki** from the plugin.
3. Plugin scans safe project context.
4. Plugin sends that context to the local desktop app.
5. Desktop app shows the latest project context.
6. User asks Micki a typed question.
7. Micki gives a useful answer and a copyable coding-agent prompt.

## Friday demo target

By Friday, the demo should feel like this:

1. User opens `demo/sample-vibe-app` in VS Code.
2. Micki receives fresh project context from the plugin.
3. User presses a keyboard shortcut or button to speak/type.
4. User asks: **What am I building and what should I do next?**
5. Micki explains the project, key missing pieces, the next decision, and a focused prompt for Cursor/Codex/Claude.

## Micki should show

- project summary
- detected stack
- missing production pieces
- readiness score
- next best step
- simple teaching explanation
- copyable prompt for Cursor/Codex/Claude

## Build order from here

Completed foundation:

1. Desktop app shell.
2. Local desktop API.
3. Typed question UI.
4. VS Code plugin shell.
5. Project scanner.
6. Context sending from plugin to app.
7. Demo project fixture.
8. Improved deterministic answers.
9. Polished demo UI.

Next priorities:

1. **V5 Active context** — make the plugin refresh/send context more smoothly.
2. **VOICE1 Push-to-talk** — add simple voice input in the desktop app.
3. **COACH1 Teaching mode** — improve Micki's natural-language coaching response.
4. **DEMO2 Runbook** — final Friday demo script and fallback steps.

## Do not build yet

Do not build these before the Friday demo:

- accounts
- payments
- database
- hosted backend
- marketplace publishing
- GitHub PR reviews
- analytics
- complex deployment
- full production security scanner
- packaged `.dmg` installer
- always-on background listening
- system-wide global assistant

## How to use Codex

Give Codex one task at a time.

Use this format:

```text
Read START_HERE.md, AGENTS.md, docs/prd.md, docs/technical_decisions.md, and tasks.md.

Work only on task [TASK ID].
Do not start the next task.
Do not add extra features.
After finishing, show files changed, how to test, expected output, and risks.
```

## Success criteria

The Friday demo is successful when:

- the plugin can scan the demo project
- the plugin can send fresh context to the desktop app
- the desktop app clearly shows the loaded context
- the user can type or speak a question
- Micki replies like a helpful coding coach
- Micki gives a clear next step and a copyable coding-agent prompt
