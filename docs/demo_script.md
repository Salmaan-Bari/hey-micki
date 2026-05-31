# Demo Script

Goal: show that the VS Code plugin gives context to the macOS app, and the user can ask Micki what to do next.

## Setup

Before the demo:

- desktop app is running
- VS Code plugin is running in Extension Development Host
- sample project is open in VS Code

## Demo flow

### 1. Explain the idea

Say:

```text
hey-micki is a coding coach for vibe coders. The plugin reads project context from VS Code. The macOS app is where I talk to Micki.
```

### 2. Show the desktop app

Open the macOS app.

Show that it is waiting for project context.

### 3. Show the VS Code project

Open a small sample project in VS Code.

Say:

```text
This is the project I want Micki to understand.
```

### 4. Send context

Run the VS Code command:

```text
Send Context to Micki
```

Expected result:

- plugin scans the project
- plugin sends context to the desktop app
- desktop app confirms context was received

### 5. Ask Micki

In the desktop app, ask:

```text
What should I do next?
```

Expected result:

Micki shows:

- project summary
- detected stack
- missing production pieces
- readiness score
- next best step
- copyable prompt

### 6. Close the demo

Say:

```text
The simple loop works: VS Code gives Micki context, and the macOS app gives me a useful next step and a prompt I can paste into my coding agent.
```

## Fallback

If the plugin fails, manually send a sample request to the desktop app endpoint.

If the desktop app UI fails, show the local API response in the terminal.

If voice is not ready, say:

```text
Voice comes after typed chat. The MVP proves the context and coaching loop first.
```
