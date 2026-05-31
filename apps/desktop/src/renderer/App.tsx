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

const emptySummary: ContextSummary = {
  hasContext: false,
  workspaceName: null,
  fileCount: 0,
  frameworks: [],
  packageManager: null
};

export function App() {
  const [summary, setSummary] = useState<ContextSummary>(emptySummary);
  const [isServerReachable, setIsServerReachable] = useState(false);
  const [question, setQuestion] = useState("What should I do next?");
  const [answer, setAnswer] = useState<MickiAnswer | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy prompt");

  useEffect(() => {
    let isMounted = true;

    async function loadContextSummary() {
      try {
        const response = await fetch("http://localhost:3737/context");
        const nextSummary = (await response.json()) as ContextSummary;

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

  async function askMicki(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsAsking(true);
    setAskError(null);
    setCopyLabel("Copy prompt");

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

    await navigator.clipboard.writeText(answer.agentPrompt);
    setCopyLabel("Copied");
    window.setTimeout(() => setCopyLabel("Copy prompt"), 1500);
  }

  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">hey-micki</p>
        <h1>{summary.hasContext ? "Context received." : "Waiting for project context."}</h1>
        <p>
          The desktop app is running locally. The future VS Code plugin will send project
          context to <code>http://localhost:3737/context</code>.
        </p>

        <section className="status-panel" aria-label="Context status">
          <div className="status-row">
            <span className={summary.hasContext ? "status-dot ready" : "status-dot"} />
            <span>{summary.hasContext ? "Project context is loaded" : "No context received yet"}</span>
          </div>

          {!isServerReachable ? (
            <p className="muted">Local server status is not available yet.</p>
          ) : summary.hasContext ? (
            <dl className="context-details">
              <div>
                <dt>Workspace</dt>
                <dd>{summary.workspaceName ?? "Unknown"}</dd>
              </div>
              <div>
                <dt>Files</dt>
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
            <p className="muted">Send context to Micki to see project details here.</p>
          )}
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
          </form>

          {askError ? <p className="error-text">{askError}</p> : null}

          {answer ? (
            <article className="answer-card" aria-label="Micki answer">
              <h2>Micki says</h2>

              <dl className="answer-details">
                <div>
                  <dt>Project summary</dt>
                  <dd>{answer.projectSummary}</dd>
                </div>
                <div>
                  <dt>Detected stack</dt>
                  <dd>{answer.detectedStack.length > 0 ? answer.detectedStack.join(", ") : "Unknown"}</dd>
                </div>
                <div>
                  <dt>Missing production pieces</dt>
                  <dd>
                    {answer.missingProductionPieces.length > 0
                      ? answer.missingProductionPieces.join(", ")
                      : "None detected"}
                  </dd>
                </div>
                <div>
                  <dt>Readiness score</dt>
                  <dd>{answer.readinessScore}/100</dd>
                </div>
                <div>
                  <dt>Next best step</dt>
                  <dd>{answer.nextBestStep}</dd>
                </div>
                <div>
                  <dt>Simple explanation</dt>
                  <dd>{answer.simpleExplanation}</dd>
                </div>
              </dl>

              <div className="prompt-block">
                <div className="prompt-header">
                  <h3>Copyable coding-agent prompt</h3>
                  <button type="button" className="secondary-button" onClick={copyPrompt}>
                    {copyLabel}
                  </button>
                </div>
                <pre>{answer.agentPrompt}</pre>
              </div>
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
