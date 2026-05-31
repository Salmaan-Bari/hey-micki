# Local API Schema

This is the simple local contract between the VS Code plugin and the macOS app.

The macOS app runs a small local server.

Default local URL:

```text
http://localhost:3737
```

## 1. Health check

```text
GET /health
```

Response:

```json
{ "ok": true }
```

Use this to check the macOS app is running before the plugin sends context.

## 2. Send project context

```text
POST /context
```

The VS Code plugin calls this when the user runs **Send Context to Micki**.

Request:

```json
{
  "workspaceName": "sample-app",
  "fileTree": ["package.json", "README.md", "src/app/page.tsx"],
  "packageJson": {
    "name": "sample-app",
    "dependencies": {
      "next": "latest",
      "react": "latest"
    }
  },
  "readme": "Short README preview",
  "currentFile": {
    "path": "src/app/page.tsx",
    "languageId": "typescriptreact",
    "contentPreview": "Short current file preview"
  },
  "signals": {
    "frameworks": ["Next.js", "React"],
    "packageManager": "npm",
    "hasAuth": false,
    "hasDatabase": false,
    "hasTests": false,
    "hasDeploymentConfig": false
  }
}
```

Response:

```json
{
  "ok": true,
  "message": "Context received"
}
```

## 3. Ask Micki

```text
POST /ask
```

The macOS app calls this internally when the user asks a typed question.

Request:

```json
{
  "question": "What should I do next?"
}
```

Response:

```json
{
  "projectSummary": "Short summary of the latest project context.",
  "detectedStack": ["Next.js", "TypeScript"],
  "missingProductionPieces": ["auth", "database", "tests"],
  "readinessScore": 35,
  "nextBestStep": "Add a basic README setup section.",
  "simpleExplanation": "The project has a good start but is missing shipping basics.",
  "agentPrompt": "Paste-ready prompt for Cursor, Codex, or Claude."
}
```

## MVP rules

- Store only the latest context in memory.
- Return simple deterministic answers first.
- Add model support later.
- Keep responses short.
