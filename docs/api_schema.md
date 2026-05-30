# API Schema

This document defines the MVP request and response contract between the VS Code extension and the local backend.

## Endpoint

```text
POST /api/analyse
```

Local URL:

```text
http://localhost:8787/api/analyse
```

## Request shape

```json
{
  "workspaceName": "sample-next-app",
  "workspaceRootName": "sample-next-app",
  "userQuestion": "is this ready to ship?",
  "fileTree": [
    "package.json",
    "README.md",
    "src/app/page.tsx"
  ],
  "packageJson": {
    "name": "sample-next-app",
    "scripts": {
      "dev": "next dev",
      "build": "next build"
    },
    "dependencies": {
      "next": "latest",
      "react": "latest"
    },
    "devDependencies": {
      "typescript": "latest"
    }
  },
  "readme": "Short capped README content.",
  "currentFile": {
    "path": "src/app/page.tsx",
    "languageId": "typescriptreact",
    "contentPreview": "Capped current file content."
  },
  "gitInfo": {
    "branch": "main",
    "hasUncommittedChanges": true
  },
  "detectedSignals": {
    "frameworks": ["Next.js", "React"],
    "packageManager": "npm",
    "hasAuth": false,
    "hasDatabase": false,
    "hasPayments": false,
    "hasDeploymentConfig": false,
    "hasEnvExample": false,
    "hasTests": false,
    "hasSecurityHeaders": false
  }
}
```

## Required request fields for MVP

- `workspaceName`
- `fileTree`
- `detectedSignals`

All other fields may be missing or null if unavailable.

## Response shape

```json
{
  "projectSummary": "This looks like a small Next.js app with a basic frontend scaffold.",
  "detectedStack": ["Next.js", "React", "TypeScript"],
  "missingProductionPieces": [
    {
      "name": "Authentication",
      "status": "missing",
      "severity": "high",
      "evidence": "No auth-related dependencies or routes were detected."
    },
    {
      "name": "Deployment",
      "status": "missing",
      "severity": "medium",
      "evidence": "No deployment config was detected."
    }
  ],
  "readinessScore": 35,
  "nextBestStep": "Add basic environment configuration and a clear README setup section.",
  "simpleExplanation": "You have the start of an app, but it is missing several basics needed before a real launch.",
  "agentPrompt": "You are working on this project. Add an .env.example and update the README with local setup instructions. Do not add unrelated features."
}
```

## Response field rules

### `projectSummary`

Short plain-English summary. Maximum 2 sentences.

### `detectedStack`

Array of detected technologies. Use evidence from package files and file tree.

### `missingProductionPieces`

Array of checklist items. Each item should include:

- `name`
- `status`: `present`, `missing`, or `unknown`
- `severity`: `low`, `medium`, or `high`
- `evidence`

### `readinessScore`

Integer from 0 to 100.

Suggested MVP scoring:

- start from 100
- subtract for missing high-severity pieces
- subtract less for medium/low-severity pieces
- clamp between 0 and 100

### `nextBestStep`

One concrete next task only.

### `simpleExplanation`

Short explanation that a beginner can understand.

### `agentPrompt`

Paste-ready prompt for Cursor/Codex/Claude.

Must include:

- one task only
- expected files if known
- acceptance criteria
- do-not-do-yet note

## Error response shape

```json
{
  "error": {
    "message": "Invalid request payload.",
    "code": "INVALID_PAYLOAD"
  }
}
```

## MVP note

The backend should be able to return useful deterministic responses without a live LLM. LLM support can improve wording later, but should not be required for the demo.
