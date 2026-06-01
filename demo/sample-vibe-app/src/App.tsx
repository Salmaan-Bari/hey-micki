type Task = {
  id: number;
  title: string;
  owner: string;
  priority: "Low" | "Medium" | "High";
  done: boolean;
};

const tasks: Task[] = [
  {
    id: 1,
    title: "Outline launch checklist",
    owner: "Maya",
    priority: "High",
    done: false
  },
  {
    id: 2,
    title: "Review class notes before standup",
    owner: "Leo",
    priority: "Medium",
    done: true
  },
  {
    id: 3,
    title: "Draft landing page copy",
    owner: "Nina",
    priority: "High",
    done: false
  }
];

function App() {
  const openTasks = tasks.filter((task) => !task.done).length;

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>Vibe Tasks</p>
        <h1 style={styles.title}>A calmer task list for busy student founders.</h1>
        <p style={styles.subtitle}>
          Track the next few things that matter without setting up a whole project management system.
        </p>
      </section>

      <section style={styles.summary}>
        <div>
          <span style={styles.metric}>{tasks.length}</span>
          <span style={styles.label}> total tasks</span>
        </div>
        <div>
          <span style={styles.metric}>{openTasks}</span>
          <span style={styles.label}> open today</span>
        </div>
      </section>

      <section aria-label="Task list" style={styles.card}>
        {tasks.map((task) => (
          <article key={task.id} style={styles.taskRow}>
            <div>
              <h2 style={styles.taskTitle}>{task.title}</h2>
              <p style={styles.taskMeta}>Owner: {task.owner}</p>
            </div>
            <div style={styles.taskStatus}>
              <span style={styles.priority}>{task.priority}</span>
              <span>{task.done ? "Done" : "Open"}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "840px",
    margin: "0 auto",
    padding: "48px 24px",
    color: "#18212f",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  },
  hero: {
    marginBottom: "32px"
  },
  eyebrow: {
    margin: "0 0 8px",
    color: "#4f46e5",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em"
  },
  title: {
    margin: 0,
    fontSize: "42px",
    lineHeight: 1.1
  },
  subtitle: {
    maxWidth: "620px",
    color: "#586174",
    fontSize: "18px",
    lineHeight: 1.6
  },
  summary: {
    display: "flex",
    gap: "24px",
    marginBottom: "24px"
  },
  metric: {
    fontSize: "32px",
    fontWeight: 800
  },
  label: {
    color: "#586174"
  },
  card: {
    border: "1px solid #d9deea",
    borderRadius: "8px",
    overflow: "hidden",
    background: "#ffffff"
  },
  taskRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    padding: "18px 20px",
    borderBottom: "1px solid #edf0f6"
  },
  taskTitle: {
    margin: "0 0 6px",
    fontSize: "18px"
  },
  taskMeta: {
    margin: 0,
    color: "#6b7280"
  },
  taskStatus: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-end",
    gap: "6px",
    color: "#475569",
    fontWeight: 600
  },
  priority: {
    color: "#be123c"
  }
};

export default App;
