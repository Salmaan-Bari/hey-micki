# Manual QA Checklist

Manual QA is required before calling the MVP complete.

The purpose of this checklist is to make the human verify the product works end-to-end, not just trust passing tests.

## Pre-flight

- [ ] Repo has been pulled locally.
- [ ] Backend dependencies are installed.
- [ ] Extension dependencies are installed.
- [ ] Backend starts without errors.
- [ ] Extension compiles without errors.
- [ ] Extension Development Host launches.

## Backend checks

- [ ] `GET /health` returns `{ "ok": true }`.
- [ ] `POST /api/analyse` accepts a valid sample payload.
- [ ] Invalid payload returns a clear error.
- [ ] Backend logs request method, route, status, and duration.
- [ ] Backend does not require a live model key for deterministic analysis.

## Extension checks

- [ ] Command palette shows a hey-micki command.
- [ ] Sidebar appears in VS Code.
- [ ] Sidebar has a visible scan button.
- [ ] Scan button shows a loading state.
- [ ] Extension handles no workspace open.
- [ ] Extension handles backend offline with a clear message.

## Context scanning checks

- [ ] Workspace name is detected.
- [ ] File tree is extracted.
- [ ] Generated folders are skipped.
- [ ] `package.json` is read when present.
- [ ] README is read when present.
- [ ] Current file info is included when an editor is open.
- [ ] Framework/package-manager signals are detected where obvious.
- [ ] Missing production signals are generated.

## Analysis rendering checks

- [ ] Project summary appears.
- [ ] Detected stack appears.
- [ ] Missing production pieces appear.
- [ ] Readiness score appears.
- [ ] Next best step appears.
- [ ] Simple explanation appears.
- [ ] Generated agent prompt appears.
- [ ] Copy prompt button works.

## Demo checks

- [ ] Sample project opens successfully.
- [ ] hey-micki scans sample project.
- [ ] It identifies missing production pieces.
- [ ] It gives a useful next best step.
- [ ] The generated prompt is specific and paste-ready.
- [ ] The full demo can be completed in 3-5 minutes.

## Optional voice checks

Only run these if voice is implemented.

- [ ] Text input still works without voice.
- [ ] Push-to-talk appears only where supported.
- [ ] Speech transcript appears correctly enough for demo.
- [ ] Spoken response can be muted or skipped.
- [ ] Voice failure does not break the text flow.

## MVP sign-off

The MVP can be considered demo-ready only when:

- [ ] all required backend checks pass
- [ ] all required extension checks pass
- [ ] all required context scanning checks pass
- [ ] all required analysis rendering checks pass
- [ ] demo script has been rehearsed
- [ ] no non-MVP features were accidentally built
