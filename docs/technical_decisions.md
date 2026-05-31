# Technical Decisions

Keep the MVP simple.

## MVP architecture

```text
VS Code plugin
  scans project context
        |
        v
macOS app local server
  stores latest context in memory
        |
        v
macOS app chat UI
  user talks/types to Micki
```

## Pieces to build

### 1. macOS app

The macOS app is the main user interface.

It should:

- run locally
- expose a small localhost API
- receive project context from the plugin
- store the latest context in memory
- let the user type a question
- show Micki's response
- later support voice

### 2. VS Code plugin

The plugin is only for project context.

It should:

- run inside VS Code
- scan the current workspace
- collect safe, limited project context
- send that context to the macOS app
- show simple success or error messages

The plugin does not need a full sidebar for the MVP.

### 3. Local connection

Use localhost for the MVP.

Recommended local app endpoint:

```text
POST http://localhost:3737/context
```

The app can also expose:

```text
GET http://localhost:3737/health
POST http://localhost:3737/ask
```

## Recommended stack

Use TypeScript where practical.

Recommended simple setup:

- `apps/desktop` — Electron + React + TypeScript macOS app
- `apps/extension` — VS Code extension + TypeScript
- local HTTP API between plugin and desktop app

Electron is recommended for speed because it can provide:

- macOS desktop app shell
- React UI
- local Node server in the app process
- simple voice support later through web APIs

## Data storage

No database for the MVP.

Store only the latest project context in memory.

## AI/model layer

For the first version, return deterministic responses from simple rules.

Add model support later only after the local plugin/app loop works.

## Voice

Voice is not first.

Build typed chat first. Add push-to-talk later inside the desktop app.

## Do not build yet

Do not build:

- hosted backend
- database
- accounts
- payments
- analytics
- marketplace publishing
- GitHub integrations
- complex deployment

## First build target

Build the macOS app shell first because it needs to receive context from the plugin.

First task:

```text
D1: Create desktop app shell with GET /health on localhost:3737.
```
