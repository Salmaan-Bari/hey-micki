# hey-micki PRD

## Product summary

hey-micki is a voice-first coding coach for vibe coders. It helps users understand their codebase, identify what is missing before shipping, and generate a clear next prompt for a coding agent.

The weekend MVP is not the full product. It is a local demo proving that a VS Code extension can scan a repo, send context to a backend, and return useful shipping guidance.

## Target user

A vibe coder or early-stage builder using VS Code with coding agents such as Cursor, Codex, Claude, or similar tools.

They can generate code quickly, but often need help answering:

- What is this project?
- What should I do next?
- Is this ready to ship?
- What production pieces am I missing?
- What prompt should I give my coding agent next?

## Weekend MVP goal

Build a VS Code extension sidebar that scans the current workspace and sends a compact context payload to a local backend.

The backend returns:

- project summary
- detected stack
- missing production pieces
- ship readiness score
- next best step
- simple explanation
- prompt to paste into Cursor/Codex/Claude

## MVP user journey

1. User opens a project in VS Code.
2. User opens the hey-micki sidebar.
3. User clicks **Scan Repo**.
4. The extension safely collects project context.
5. The extension sends context to the local backend.
6. The backend analyses the project.
7. The sidebar shows a practical readiness assessment.
8. User copies the generated prompt into a coding agent.
9. User improves the project and refreshes the readiness score.

## Context to collect

The extension should collect:

- workspace name
- current file path, language, and capped content
- capped file tree
- package/dependency files where present
- README content where present
- git branch/status summary where available
- detected framework and package manager signals
- evidence of auth, database, deployment, payments, env handling, tests, and security basics

The extension should not read local secret files.

## MVP response shape

The backend should return a JSON object with:

```json
{
  "projectSummary": "Short plain-English summary of the project.",
  "detectedStack": ["Next.js", "TypeScript"],
  "missingProductionPieces": [
    {
      "name": "Authentication",
      "status": "missing",
      "severity": "high",
      "evidence": "No auth-related dependencies or routes detected."
    }
  ],
  "readinessScore": 42,
  "nextBestStep": "Add environment variable handling and an example env file.",
  "simpleExplanation": "The app has a frontend but lacks key production basics.",
  "agentPrompt": "Paste-ready prompt for Cursor/Codex/Claude."
}
```

## MVP acceptance criteria

The MVP is complete when:

- the backend runs locally
- the extension launches in VS Code Extension Development Host
- the sidebar appears
- the sidebar can scan a workspace
- the backend receives a context payload
- the backend returns all required response fields
- the sidebar renders the analysis clearly
- the generated prompt can be copied
- a manual QA checklist has been completed
- the README explains how to run the demo

## Non-goals for weekend MVP

Do not build these during the weekend MVP:

- standalone voice app
- user accounts
- database
- persistent project history
- payments
- analytics
- cloud deployment
- marketplace publishing
- GitHub PR review integration
- direct Cursor/Codex/Claude API integration
- complex security scanning
- full production readiness claims

## Optional weekend feature

Voice may be added only after the text flow works.

If included, voice should be limited to a lightweight push-to-talk feature inside the VS Code webview using browser/Web Speech API capabilities where available. It must have a text fallback.

## Success definition

The demo should make it obvious that hey-micki can act like a senior-dev coach inside VS Code: it looks at the project, explains what matters, identifies missing shipping pieces, and gives the user a concrete next action.
