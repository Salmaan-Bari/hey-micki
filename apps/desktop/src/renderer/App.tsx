import { useEffect, useState } from "react";
import "./styles.css";

type ContextSummary = {
  hasContext: boolean;
  workspaceName: string | null;
  fileCount: number;
  frameworks: string[];
  packageManager: string | null;
};

type MickiAnswer = {
  projectSummary: string;
  detectedStack: string[];
  missingProductionPieces: string[];
  readinessScore: number;
  nextBestStep: string;
  simpleExplanation: string;
  agentPrompt: string;
};

type ProjectContextPayload = {
  workspaceName: string;
  fileTree: string[];
  packageJson: {
    name: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
  readme: string;
  signals: {
    frameworks: string[];
    packageManager: string;
    hasAuth: boolean;
    hasDatabase: boolean;
    hasTests: boolean;
    hasDeploymentConfig: boolean;
  };
};

const emptySummary: ContextSummary = {
  hasContext: false,
  workspaceName: null,
  fileCount: 0,
  frameworks: [],
  packageManager: null
};

const sampleContext: ProjectContextPayload = {
  workspaceName: "sample-vibe-app",
  fileTree: ["README.md", "package.json", "src/App.tsx", "src/main.tsx"],
  packageJson: {
    name: "vibe-tasks",
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0"
    },
    devDependencies: {
      "@vitejs/plugin-react": "^5.0.0",
      typescript: "^5.7.0",
      vite: "^6.0.0"
    }
  },
  readme:
    "# Vibe Tasks\n\nVibe Tasks is a tiny early-stage task manager for students and founders. Setup notes are incomplete on purpose for the Micki demo. No accounts, database, sync, tests, or deployment setup yet.",
  signals: {
    frameworks: ["React", "Vite", "TypeScript"],
    packageManager: "npm",
    hasAuth: false,
    hasDatabase: false,
    hasTests: false,
    hasDeploymentConfig: false
  }
};

async function fetchContextSummary() {
  const response = await fetch("http://localhost:3737/context");

  if (!response.ok) {
    throw new Error("Unable to load context summary.");
  }

  return (await response.json()) as ContextSummary;
}

export function App() {
  const [summary, setSummary] = useState<ContextSummary>(emptySummary);
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [question, setQuestion] = useState("What should I do next?");
  const [answer, setAnswer] = useState<MickiAnswer | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy prompt");
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [sampleStatus, setSampleStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadContextSummary() {
      try {
        const nextSummary = await fetchContextSummary();

        if (isMounted) {
          setSummary(nextSummary);
          setIsServerReachable(true);
        }
      } catch {
        if (isMounted) {
          setIsServerReachable(false);
        }
      }
    }

    void loadContextSummary();
    const intervalId = window.setInterval(loadContextSummary, 1000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  async function useSampleContext() {
    setSampleStatus("Loading sample context...");
    setAskError(null);
    setAnswer(null);

    try {
      const response = await fetch("http://localhost:3737/context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sampleContext)
      });

      if (!response.ok) {
        throw new Error("Sample context was not accepted.");
      }

      setSummary(await fetchContextSummary());
      setIsServerReachable(true);
      setSampleStatus("Sample context loaded.");
      window.setTimeout(() => setSampleStatus(null), 1800);
    } catch {
      setSampleStatus("Could not load the sample context. Check the local server.");
    }
  }

  async function askMicki(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAsking(true);
    setAskError(null);
    setCopyLabel("Copy prompt");
    setCopyMessage(null);

    try {
      const response = await fetch("http://localhost:3737/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error("Micki could not answer yet.");
      }

      setAnswer((await response.json()) as MickiAnswer);
    } catch {
      setAskError("Micki could not answer yet. Make sure the local app server is running.");
    } finally {
      setIsAsking(false);
    }
  }

  async function copyPrompt() {
    if (!answer) {
      return;
    }

    try {
      await navigator.clipboard.writeText(answer.agentPrompt);
      setCopyLabel("Copied");
      setCopyMessage("Prompt copied. Paste it into Cursor, Codex, or Claude.");
    } catch {
      setCopyLabel("Copy failed");
      setCopyMessage("Clipboard access was blocked. Select the prompt text manually.");
    }

    window.setTimeout(() => {
      setCopyLabel("Copy prompt");
      setCopyMessage(null);
    }, 1800);
  }

  const hasAnswer = Boolean(answer);
  const stateTitle = hasAnswer
    ? "Micki has a next step."
    : summary.hasContext
      ? "Context received."
      : "Waiting for VS Code context.";
  const stateCopy = hasAnswer
    ? "You can walk through the recommendation, then copy the focused prompt."
    : summary.hasContext
      ? "The project is loaded. Ask Micki what to do next."
      : "Open the sample project in VS Code and run Send Context to Micki.";

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">hey-micki demo</p>
        <h1>{stateTitle}</h1>
        <p>{stateCopy}</p>

        <div className="demo-steps" aria-label="Demo progress">
          <div className={summary.hasContext || hasAnswer ? "demo-step complete" : "demo-step active"}>
            <span>1</span>
            <strong>Waiting for VS Code</strong>
          </div>
          <div className={summary.hasContext ? "demo-step complete" : "demo-step"}>
            <span>2</span>
            <strong>Context received</strong>
          </div>
          <div className={hasAnswer ? "demo-step complete" : "demo-step"}>
            <span>3</span>
            <strong>Micki answer shown</strong>
          </div>
        </div>

        <section className="status-panel" aria-label="Context status">
          <div className="status-header">
            <div>
              <p className="section-label">Project context</p>
              <h2>{summary.hasContext ? summary.workspaceName ?? "Project loaded" : "No project loaded yet"}</h2>
            </div>
            <span className={summary.hasContext ? "status-pill ready" : "status-pill"}>
              {summary.hasContext ? "Ready" : "Waiting"}
            </span>
          </div>

          {!isServerReachable ? (
            <p className="muted">Local server status is not available yet.</p>
          ) : summary.hasContext ? (
            <dl className="context-details">
              <div>
                <dt>Files scanned</dt>
                <dd>{summary.fileCount}</dd>
              </div>
              <div>
                <dt>Frameworks</dt>
                <dd>{summary.frameworks.length > 0 ? summary.frameworks.join(", ") : "None detected"}</dd>
              </div>
              <div>
                <dt>Package manager</dt>
                <dd>{summary.packageManager ?? "Unknown"}</dd>
              </div>
            </dl>
          ) : (
            <div className="waiting-copy">
              <p>Run the VS Code command, or use the sample context if the extension is not cooperating during the demo.</p>
              <button type="button" className="secondary-button" onClick={useSampleContext}>
                Use sample context
              </button>
            </div>
          )}

          {sampleStatus ? <p className="status-message">{sampleStatus}</p> : null}
        </section>

        <section className="ask-panel" aria-label="Ask Micki">
          <form className="ask-form" onSubmit={askMicki}>
            <label htmlFor="question">Ask Micki</label>
            <div className="question-row">
              <input
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What should I do next?"
              />
              <button type="submit" disabled={isAsking || question.trim().length === 0}>
                {isAsking ? "Asking..." : "Ask"}
              </button>
            </div>
            {!summary.hasContext ? <p className="form-hint">You can ask before context arrives, but the answer gets useful once VS Code sends a project.</p> : null}
          </form>

          {askError ? <p className="error-text">{askError}</p> : null}

          {answer ? (
            <article className="answer-card" aria-label="Micki answer">
              <div className="answer-topline">
                <div>
                  <p className="section-label">Micki says</p>
                  <h2>{answer.nextBestStep}</h2>
                </div>
                <div className="score-badge" aria-label={`Readiness score ${answer.readinessScore} out of 100`}>
                  <span>{answer.readinessScore}</span>
                  <small>/100</small>
                </div>
              </div>

              <p className="answer-summary">{answer.projectSummary}</p>

              <div className="answer-grid">
                <section>
                  <h3>Detected stack</h3>
                  <div className="chip-row">
                    {answer.detectedStack.length > 0
                      ? answer.detectedStack.map((item) => <span className="chip" key={item}>{item}</span>)
                      : <span className="chip">Unknown</span>}
                  </div>
                </section>

                <section>
                  <h3>Missing before shipping</h3>
                  <ul className="gap-list">
                    {answer.missingProductionPieces.length > 0
                      ? answer.missingProductionPieces.map((item) => <li key={item}>{item}</li>)
                      : <li>No obvious gaps detected</li>}
                  </ul>
                </section>
              </div>

              <section className="explanation-panel">
                <h3>Why this is the next step</h3>
                <p>{answer.simpleExplanation}</p>
              </section>

              <div className="prompt-block">
                <div className="prompt-header">
                  <h3>Copyable coding-agent prompt</h3>
                  <button type="button" className="secondary-button" onClick={copyPrompt}>
                    {copyLabel}
                  </button>
                </div>
                {copyMessage ? <p className="copy-message" role="status">{copyMessage}</p> : null}
                <pre>{answer.agentPrompt}</pre>
              </div>
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
