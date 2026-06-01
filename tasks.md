# MVP Tasks

Build one simple vertical slice:

1. **VS Code plugin** reads project context.
2. **macOS desktop app** lets the user type or speak to Micki.
3. Micki explains the project and gives a next step.

Do one task at a time.

---

## Completed

- [x] D1 Desktop app shell
- [x] D2 Context endpoint
- [x] D3 Typed question UI
- [x] V1 VS Code plugin shell
- [x] V2 Basic project context scanner
- [x] V3 Send context to desktop app
- [x] DEMO1 Sample demo project fixture
- [x] V4 Improved context detection
- [x] A1 Better deterministic Micki answers
- [x] UI1 Demo UI polish

---

## Next tasks for Friday demo

### V5 Active context refresh

Goal: make Micki feel aware of the file/project the user is currently working on.

Build:

- [ ] Keep `Send Context to Micki` working.
- [ ] Include current active file path, language, and preview in the context.
- [ ] Add clearer success/error messages.
- [ ] Show or log when context was last sent.
- [ ] If low-risk, refresh context when the user saves a file.

Expected files:

- `apps/extension/src/context.ts`
- `apps/extension/src/extension.ts`
- `apps/extension/src/client.ts`
- `apps/desktop/src/renderer/App.tsx` only if needed

Acceptance criteria:

- `npm run compile` passes in `apps/extension`.
- Desktop app still receives context.
- Context includes active file info when available.
- No voice or model calls are added.

---

### VOICE1 Push-to-talk input

Goal: let the user speak a question to Micki in the desktop app.

Build:

- [ ] Add a microphone button.
- [ ] Use browser/Electron speech recognition if available.
- [ ] Put the transcript into the existing question input.
- [ ] Keep typing as the fallback.
- [ ] Show a clear message if speech recognition is unavailable.

Expected files:

- `apps/desktop/src/renderer/App.tsx`
- `apps/desktop/src/renderer/styles.css`

Acceptance criteria:

- `npm run build` passes in `apps/desktop`.
- Typed input still works.
- Speech input works where supported, or fails clearly where unsupported.
- No always-listening behaviour.
- No model calls are added.

---

### COACH1 Teaching answer style

Goal: make Micki sound more like a helpful coding coach.

Build:

- [ ] Improve response wording for common questions.
- [ ] Support simple intents:
  - `What am I building?`
  - `What should I do next?`
  - `Is this ready to ship?`
  - `Explain this project simply.`
- [ ] Give one decision point.
- [ ] Keep the coding-agent prompt focused on one task.
- [ ] Keep deterministic rules for now.

Expected files:

- `apps/desktop/src/answerMicki.ts`
- `apps/desktop/src/renderer/App.tsx` only if needed

Acceptance criteria:

- `npm run build` passes in `apps/desktop`.
- Different common questions produce slightly different useful answers.
- No model calls are added.

---

### DEMO2 Final demo runbook

Goal: make the Friday demo easy to run.

Build:

- [ ] Update `docs/demo_script.md`.
- [ ] Add exact commands to start the desktop app.
- [ ] Add exact steps to launch the VS Code extension.
- [ ] Use `demo/sample-vibe-app` as the demo project.
- [ ] Include the exact question to ask Micki.
- [ ] Include expected output.
- [ ] Include fallback if port `3737` is already in use.
- [ ] Include fallback if voice is unsupported.

Expected files:

- `docs/demo_script.md`
- `docs/manual_qa.md` if useful

Acceptance criteria:

- Someone can follow the runbook and demo the product in 3-5 minutes.

---

## Later, not now

Do not build before the Friday demo:

- accounts
- payments
- database
- hosted backend
- marketplace publishing
- GitHub PR reviews
- analytics
- complex deployment
- packaged installer
- full production security scanner
