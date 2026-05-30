# Technical Decisions

This document records the technical choices for the first hey-micki MVP.

## Current status

At the point these docs were created, the repository had no app scaffold, package manager, test framework, deployment setup, or lint conventions.

These decisions are therefore recommended MVP defaults rather than inherited repo standards.

## MVP architecture

The weekend MVP has two parts:

1. VS Code extension
2. Local backend API

The extension scans the current workspace and sends a compact project context payload to the backend. The backend analyses the context and returns a structured shipping-readiness response.

```text
VS Code Extension Sidebar
        |
        v
Safe Context Scanner
        |
        v
POST http://localhost:8787/api/analyse
        |
        v
Backend Analysis Service
        |
        v
Structured response rendered in sidebar
```

## Recommended stack

### Language

Use TypeScript across the extension and backend.

Reason:

- natural fit for VS Code extension development
- shared types between extension and API are possible later
- straightforward for coding agents to work with

### Package manager

Use `npm` for the MVP unless the human chooses otherwise.

Reason:

- simplest default
- works everywhere
- avoids unnecessary package-manager setup decisions

### Backend

Use Node.js with Express for the MVP API.

Reason:

- fast to scaffold
- easy local demo
- sufficient for one endpoint
- simple logging and middleware

### Extension

Use the official VS Code extension API.

Required MVP pieces:

- activation event
- command palette command
- sidebar/webview provider
- workspace file scanning
- backend client

### Analysis approach

The MVP should work without a live LLM by using deterministic analysis rules first.

Optional LLM support may be added behind environment configuration later.

Required rule:

- if no model configuration exists, backend must still return a useful deterministic response

### Database

No database for the weekend MVP.

Reason:

- no persistent history required
- local stateless demo is enough
- reduces setup complexity

### Authentication

No authentication for the weekend MVP.

Reason:

- local-only demo
- no accounts
- no hosted user data

### Voice

Voice is optional and should come after the text flow works.

If added, use browser speech features inside the VS Code webview where available.

Do not build a separate voice app during the MVP.

### Deployment

No production deployment for the weekend MVP.

Target:

- backend runs locally on port `8787`
- extension runs in VS Code Extension Development Host

Post-MVP deployment can be documented later.

## API contract

Endpoint:

```text
POST /api/analyse
```

Request body should include:

- workspace name
- file tree
- key files summary
- package/dependency info
- README excerpt
- current file info
- git info where available
- detected production signals
- optional user question

Response body should include:

- project summary
- detected stack
- missing production pieces
- readiness score
- next best step
- simple explanation
- generated agent prompt

## Scanner constraints

The extension should avoid unnecessary large/generated folders.

Skip paths such as:

- `.git`
- `node_modules`
- `.next`
- `dist`
- `build`
- `coverage`
- `.venv`
- `venv`

Use file-size limits and file-count limits during scanning.

## Testing approach

Use simple tests where they add clear value:

- backend analysis service tests
- prompt builder tests
- API endpoint tests
- scanner utility tests where practical

Manual QA is required for the extension because the human needs to verify the VS Code sidebar behaviour directly.

## Decisions deferred

These are deliberately deferred until after the MVP:

- hosted backend provider
- frontend web dashboard
- database choice
- authentication provider
- payment provider
- analytics provider
- marketplace publishing flow
- CI/CD provider
- monitoring provider
- full voice architecture
- direct coding-agent integrations
