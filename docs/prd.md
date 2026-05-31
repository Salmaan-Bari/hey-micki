# PRD: hey-micki MVP

## Product

hey-micki is a local coding coach for vibe coders.

It has two pieces:

1. **VS Code plugin** — scans the current project.
2. **macOS app** — lets the user talk or type to Micki.

The plugin gives the macOS app project context. The macOS app gives the user clear advice.

## User problem

Vibe coders can build quickly, but they often lose track of:

- what the project currently does
- what is missing before shipping
- what to ask the coding agent next
- whether the app is actually ready

## MVP goal

Create a local demo where:

1. the VS Code plugin scans a project
2. the plugin sends context to the macOS app
3. the macOS app stores the latest context in memory
4. the user asks a typed question
5. Micki replies with a short answer and a next-step prompt

Voice can come after typed chat works.

## MVP user flow

1. User opens a project in VS Code.
2. User runs **Send Context to Micki**.
3. Plugin scans basic project context.
4. Plugin sends this context to the macOS app over localhost.
5. User opens the macOS app.
6. User asks: **What should I do next?**
7. Micki shows a useful answer and a prompt to paste into a coding agent.

## Project context to collect

Collect only simple, useful context:

- file tree
- package files
- README
- current file
- basic stack signals
- missing production signals

## Micki should show

- project summary
- detected stack
- missing production pieces
- readiness score
- next best step
- simple explanation
- copyable prompt for Cursor, Codex, or Claude

## Non-goals

Do not build these in the MVP:

- accounts
- payments
- database
- hosted backend
- web dashboard
- marketplace publishing
- analytics
- GitHub PR reviews
- direct coding-agent integrations
- complex deployment

## Done means

The MVP is done when:

- the macOS app runs locally
- the plugin runs in VS Code
- the plugin sends project context to the app
- the app shows the latest project context
- the user can ask a typed question
- Micki gives a useful answer and copyable prompt
- manual QA passes
