import { useEffect, useState } from "react";
import "./styles.css";

type ContextSummary = {
  hasContext: boolean;
  workspaceName: string | null;
  fileCount: number;
  frameworks: string[];
  packageManager: string | null;
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
      </section>
    </main>
  );
}
