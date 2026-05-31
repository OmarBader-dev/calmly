// Home.jsx — dashboard
import Icon from "../components/Icon.jsx";
import PageHead from "../components/PageHead.jsx";
import Empty from "../components/Empty.jsx";
import { computeGPA, totalCredits } from "../data/gpa.js";
import { fmtDate, daysUntil } from "../data/dates.js";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function StatBig({ value, label, sub }) {
  return (
    <div className="card card-pad" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          fontFamily: "var(--heading-family)",
          fontSize: 44,
          fontWeight: 500,
          lineHeight: 1,
          color: "var(--ink)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{label}</div>
      {sub && <div style={{ fontSize: 13, color: "var(--ink-faint)" }}>{sub}</div>}
    </div>
  );
}

function UpcomingRow({ task, course, onToggle }) {
  const d = daysUntil(task.date);
  const soon = d <= 3 && d >= 0;
  const label =
    d < 0 ? "overdue" : d === 0 ? "today" : d === 1 ? "tomorrow" : `in ${d} days`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 4px",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label="Mark done"
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          border: "1.5px solid var(--line)",
          background: task.done ? "var(--accent)" : "var(--surface)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          color: "var(--surface)",
          transition: "all .15s",
        }}
      >
        {task.done && <Icon name="check" style={{ width: 13, height: 13 }} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 600,
            color: "var(--ink)",
            textDecoration: task.done ? "line-through" : "none",
            opacity: task.done ? 0.5 : 1,
          }}
        >
          {task.title}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "var(--ink-faint)",
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 2,
          }}
        >
          <span
            className="dot"
            style={{ width: 7, height: 7, background: course ? course.color : "var(--line)" }}
          ></span>
          {course ? course.code : "General"} · {task.type}
        </div>
      </div>
      <span
        className="tag"
        style={{
          background: soon ? "var(--warn-soft)" : "var(--surface-2)",
          color: soon ? "var(--warn)" : "var(--ink-faint)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Home({ store, setRoute }) {
  const { data } = store;
  const { gpa, credits } = computeGPA(data.courses);
  const tc = totalCredits(data.courses);
  const upcoming = data.tasks
    .filter((t) => !t.done)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  const open = data.tasks.filter((t) => !t.done).length;
  const inProgress = data.courses.filter((c) => c.grade === "—").length;

  return (
    <div className="fade-in">
      <PageHead
        kicker={new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        title={`${greeting()}, ${data.name}.`}
        desc="Here's where things stand. Breathe — you've got a handle on this."
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 22 }}
      >
        <StatBig
          value={credits ? gpa.toFixed(2) : "—"}
          label="Cumulative GPA"
          sub={`${credits} graded credits`}
        />
        <StatBig
          value={tc}
          label="Credits enrolled"
          sub={`${data.courses.length} active course${data.courses.length === 1 ? "" : "s"}`}
        />
        <StatBig
          value={open}
          label="Open tasks"
          sub={
            inProgress
              ? `${inProgress} course${inProgress > 1 ? "s" : ""} in progress`
              : "all caught up"
          }
        />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", alignItems: "start" }}>
        <div className="card card-pad">
          <div className="between" style={{ marginBottom: 6 }}>
            <h3 style={{ fontSize: 19 }}>What's coming up</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => setRoute("calendar")}>
              Calendar <Icon name="arrowRight" />
            </button>
          </div>
          {upcoming.length === 0 ? (
            <Empty
              icon="check"
              title="Nothing on the horizon"
              sub="Add a deadline and it'll show up here."
            />
          ) : (
            <div>
              {upcoming.map((t) => (
                <UpcomingRow
                  key={t.id}
                  task={t}
                  course={data.courses.find((c) => c.id === t.courseId)}
                  onToggle={store.toggleTask}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid" style={{ gap: 18 }}>
          <div
            className="card card-pad"
            style={{ background: "var(--accent-soft)", border: "1px solid transparent" }}
          >
            <Icon name="spark" style={{ width: 22, height: 22, color: "var(--accent-ink)" }} />
            <h3 style={{ fontSize: 18, marginTop: 12, color: "var(--accent-ink)" }}>
              One thing at a time
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--accent-ink)",
                opacity: 0.85,
                marginTop: 6,
              }}
            >
              {open > 0
                ? `Your nearest deadline is ${
                    upcoming[0] ? fmtDate(upcoming[0].date, { weekday: "long" }) : "soon"
                  }. Start there.`
                : "No pressing deadlines. A good moment to get ahead."}
            </p>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 18, marginBottom: 14 }}>Your courses</h3>
            {data.courses.length === 0 ? (
              <Empty icon="book" title="No courses yet" />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {data.courses.slice(0, 4).map((c) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <span className="dot" style={{ background: c.color }}></span>
                    <span
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "var(--ink)",
                        flexShrink: 0,
                      }}
                    >
                      {c.code}
                    </span>
                    <span
                      style={{
                        fontSize: 13.5,
                        color: "var(--ink-faint)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {c.name}
                    </span>
                    <span className="tag" style={{ background: "var(--surface-2)" }}>
                      {c.grade}
                    </span>
                  </div>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ marginTop: 4, alignSelf: "flex-start" }}
                  onClick={() => setRoute("courses")}
                >
                  Manage courses <Icon name="arrowRight" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
