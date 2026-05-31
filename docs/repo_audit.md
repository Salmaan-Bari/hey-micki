# Repo Audit

## Current direction

The MVP is now:

1. **macOS app** for talking/typing to Micki.
2. **VS Code plugin** for sending project context to the app.

The plugin is the context source. The desktop app is the user interface.

## Starting repo state

The repo originally contained:

- `README.md`
- `DevelopmentWorkflow.md`

Planning docs were then added.

## Current planned folders

```text
apps/desktop
apps/extension
docs
tasks.md
```

## App/code status

At the time of this audit, the repo may still be mostly documentation-first.

Future agents should check the repo before coding and not assume these folders exist yet.

## First implementation task

Build the desktop app shell first.

Reason: the VS Code plugin needs somewhere to send context.

First task:

```text
D1: Create desktop app shell with local health endpoint.
```

After that:

1. add context endpoint to desktop app
2. add typed chat UI to desktop app
3. scaffold VS Code plugin
4. make plugin scan context
5. make plugin send context to desktop app
6. add deterministic Micki response
7. run manual QA
