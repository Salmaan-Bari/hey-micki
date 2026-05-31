# Start Here

hey-micki is a local coding coach.

The MVP has two parts:

1. **VS Code plugin** — reads project context.
2. **macOS app** — lets the user talk/type to Micki.

The plugin sends context to the macOS app. The app uses that context to answer questions like:

- What is this project?
- What should I do next?
- Is this ready to ship?
- What am I missing?
- What prompt should I paste into Cursor/Codex/Claude?

## Simple MVP loop

1. User opens a project in VS Code.
2. User runs **Send Context to Micki** from the plugin.
3. Plugin scans safe project context.
4. Plugin sends that context to the local macOS app.
5. User talks/types in the macOS app.
6. Micki replies with a short, useful answer and an action card.

## MVP output

Micki should show:

- project summary
- detected stack
- missing production pieces
- readiness score
- next best step
- simple explanation
- copyable prompt for Cursor/Codex/Claude

## Build order

Build in this order:

1. macOS app shell with a local health endpoint.
2. VS Code plugin shell with one command.
3. Plugin scans basic project context.
4. Plugin sends context to the macOS app.
5. macOS app stores the latest context in memory.
6. User asks a typed question in the macOS app.
7. macOS app returns a useful answer/action card.
8. Add optional voice after typed chat works.

## Do not build yet

Do not build these for the MVP:

- accounts
- payments
- database
- hosted backend
- marketplace publishing
- GitHub PR reviews
- analytics
- complex deployment
- full production security scanner

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

The MVP is successful when:

- the plugin can scan a VS Code project
- the plugin can send context to the local macOS app
- the macOS app can show the latest project context
- the user can ask what to do next
- Micki gives a clear next step and a copyable coding-agent prompt
