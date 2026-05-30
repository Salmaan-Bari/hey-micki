# MVP Demo Script

This script is for a 3-5 minute weekend MVP demo.

## Demo goal

Show that hey-micki can inspect a VS Code project, explain what it is, identify missing shipping pieces, and generate a useful next prompt for a coding agent.

## Setup before demo

- Backend is running locally on port `8787`.
- VS Code Extension Development Host is open.
- A sample project is open.
- The sample project is intentionally incomplete.
- The hey-micki sidebar is visible.

## Sample project idea

Use a tiny Next.js-style app that has:

- `package.json`
- `README.md`
- one page/component file
- no auth
- no database
- no deployment config
- no tests
- no environment example

This gives hey-micki useful things to detect.

## Demo flow

### 1. Set the scene

Say:

```text
This is hey-micki. It is a senior-dev style coding coach for vibe coders. The idea is simple: while you build quickly with AI coding tools, hey-micki helps you understand what you have, what is missing, and what to ask your coding agent to do next.
```

### 2. Show the project

Open the sample project in VS Code.

Say:

```text
Here is a small app. It looks like it has the start of a real product, but it is not obvious whether it is actually ready to ship.
```

### 3. Open hey-micki

Open the sidebar.

Say:

```text
Instead of manually checking the whole repo, I can ask hey-micki to scan it.
```

### 4. Scan repo

Click **Scan Repo**.

Expected result:

- loading state appears
- backend logs request
- sidebar updates with analysis

### 5. Explain result

Point to:

- project summary
- detected stack
- readiness score
- missing pieces
- next best step

Say:

```text
It has detected the stack, summarised the project, and scored how ready it is to ship. More importantly, it tells me the exact production pieces that are missing.
```

### 6. Show next best step

Say:

```text
The key part is that it does not give me a huge vague roadmap. It gives me the next best step.
```

### 7. Show generated prompt

Click copy prompt.

Say:

```text
Then it turns that next step into a scoped prompt I can paste into Cursor, Codex, or Claude. This keeps the coding agent focused on one task instead of going off and changing half the app.
```

### 8. Close with value proposition

Say:

```text
The MVP is local and simple, but the core loop is here: inspect the project, explain what matters, identify what is missing, and generate the next build prompt. That is the foundation for a voice-first coding coach.
```

## Success criteria

The demo works if the viewer understands:

- hey-micki lives inside VS Code
- it reads useful project context
- it helps users ship with better engineering discipline
- it gives specific next actions
- it pairs naturally with coding agents

## Fallback plan

If the sidebar fails:

1. Show backend `/api/analyse` with a sample payload.
2. Show the JSON response.
3. Explain that the extension UI is the next layer.

If the backend fails:

1. Show the extension scanner output.
2. Show the intended API schema.
3. Explain the integration step.

If voice is not ready:

Say:

```text
Voice is deliberately deferred until the text-based loop works. The weekend MVP proves the coaching engine first.
```
