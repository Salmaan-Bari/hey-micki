import "./styles.css";

export function App() {
  return (
    <main className="app-shell">
      <section className="intro">
        <p className="eyebrow">hey-micki</p>
        <h1>Micki is getting ready.</h1>
        <p>
          The desktop shell is running, and the local health endpoint is available at
          <code> http://localhost:3737/health</code>.
        </p>
      </section>
    </main>
  );
}
