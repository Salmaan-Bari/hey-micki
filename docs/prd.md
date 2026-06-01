# PRD: hey-micki MVP

## Product

hey-micki is a local coding coach for vibe coders.

It has two pieces:

1. **VS Code plugin** — scans the current project.
2. **macOS desktop app** — lets the user type or speak to Micki.

The plugin gives the desktop app project context. The desktop app gives the user clear guidance.

## User problem

Vibe coders can build quickly, but they often lose track of:

- what the project currently does
- what is missing before shipping
- what decision to make next
- what to ask the coding agent next

## Current working MVP

The current MVP already proves this loop:

1. The VS Code plugin scans a project.
2. The plugin sends context to the desktop app.
3. The desktop app stores the latest context in memory.
4. The user asks a typed question.
5. Micki replies with a useful answer and a copyable prompt.

## Friday demo goal

The Friday demo should feel like this:

1. Open `demo/sample-vibe-app` in VS Code.
2. Send or refresh context from the plugin.
3. Ask Micki by typing or using push-to-talk.
4. Micki explains what is being built.
5. Micki identifies the key missing pieces.
6. Micki recommends one practical next step.
7. Micki gives one focused prompt for Cursor/Codex/Claude.

## Project context to collect

Collect only useful local context:

- file tree
- package files
- README
- current active file
- basic stack signals
- missing production signals

## Micki should show

- project summary
- detected stack
- missing production pieces
- readiness score
- next best step
- simple teaching explanation
- copyable prompt for Cursor, Codex, or Claude

## Non-goals before Friday

Do not build these before the Friday demo:

- accounts
- payments
- database
- hosted backend
- web dashboard
- marketplace publishing
- analytics
- GitHub PR reviews
- direct coding-agent integrations
- packaged installer
- complex deployment
- always-on listening

## Done means

The Friday demo is done when:

- the desktop app runs locally
- the plugin runs in VS Code
- the plugin sends fresh project context to the app
- the app shows the latest project context clearly
- the user can type or speak a question
- Micki gives a useful coaching answer
- Micki gives a clear next step and copyable prompt
- manual QA passes
