// Calendar.jsx — month grid + agenda + add deadline
import { useState, useMemo } from "react";
import Icon from "../components/Icon.jsx";
import PageHead from "../components/PageHead.jsx";
import Empty from "../components/Empty.jsx";
import Modal from "../components/Modal.jsx";
import Field from "../components/Field.jsx";
import Segment from "../components/Segment.jsx";
import { fmtDate, daysUntil, todayISO } from "../data/dates.js";

function TaskForm({ courses, initialDate, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("assignment");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [date, setDate] = useState(initialDate || todayISO());
  const valid = title.trim() && date;

  return (
    <Modal
      title="Add a deadline"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.5 }}
            onClick={() => {
              onSave({ title: title.trim(), type, courseId, date });
              onClose();
            }}
          >
            Add deadline
          </button>
        </>
      }
    >
      <Field label="What's due">
        <input
          className="input"
          placeholder="Final Exam"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </Field>
      <Field label="Type">
        <Segment
          value={type}
          onChange={setType}
          options={[
            { value: "assignment", label: "Assignment" },
            { value: "exam", label: "Exam" },
          ]}
        />
      </Field>
      <div className="row">
        <div style={{ flex: 1 }}>
          <Field label="Course">
            <select
              className="select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">General</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code || c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Date">
            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

export default function Calendar({ store }) {
  const { data } = store;
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const [modal, setModal] = useState(null);

  const courseOf = (id) => data.courses.find((c) => c.id === id);
  const tasksByDate = useMemo(() => {
    const map = {};
    for (const t of data.tasks) (map[t.date] = map[t.date] || []).push(t);
    return map;
  }, [data.tasks]);

  const first = new Date(cursor.y, cursor.m, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const monthName = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const today = todayISO();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ d, iso });
  }

  const move = (delta) =>
    setCursor((c) => {
      const nd = new Date(c.y, c.m + delta, 1);
      return { y: nd.getFullYear(), m: nd.getMonth() };
    });

  const agenda = [...data.tasks]
    .filter((t) => !t.done)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="fade-in">
      <PageHead
        kicker="Stay ahead"
        title="Calendar"
        desc="Exams and assignments, laid out so nothing sneaks up on you."
        action={
          <button className="btn btn-primary" onClick={() => setModal({ date: today })}>
            <Icon name="plus" /> Add deadline
          </button>
        }
      />

      <div
        className="grid"
        style={{ gridTemplateColumns: "1.6fr 1fr", gap: 18, alignItems: "start" }}
      >
        <div className="card card-pad">
          <div className="between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 20 }}>{monthName}</h3>
            <div style={{ display: "flex", gap: 7 }}>
              <button className="icon-btn" onClick={() => move(-1)} aria-label="Previous">
                <Icon name="chevronRight" style={{ transform: "rotate(180deg)" }} />
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const d = new Date();
                  setCursor({ y: d.getFullYear(), m: d.getMonth() });
                }}
              >
                Today
              </button>
              <button className="icon-btn" onClick={() => move(1)} aria-label="Next">
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--ink-faint)",
                  padding: "4px 0 8px",
                }}
              >
                {d}
              </div>
            ))}
            {cells.map((cell, i) => {
              if (!cell) return <div key={i}></div>;
              const items = tasksByDate[cell.iso] || [];
              const isToday = cell.iso === today;
              return (
                <button
                  key={i}
                  onClick={() => setModal({ date: cell.iso })}
                  style={{
                    aspectRatio: "1",
                    minHeight: 56,
                    padding: 6,
                    borderRadius: "var(--r-md)",
                    border: isToday ? "1.5px solid var(--accent)" : "1px solid var(--line-soft)",
                    background: isToday ? "var(--accent-soft)" : "var(--surface)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    textAlign: "left",
                    overflow: "hidden",
                    transition: "background .15s",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: isToday ? "var(--accent-ink)" : "var(--ink-soft)",
                    }}
                  >
                    {cell.d}
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {items.slice(0, 2).map((t) => {
                      const c = courseOf(t.courseId);
                      return (
                        <span
                          key={t.id}
                          title={t.title}
                          style={{
                            fontSize: 9.5,
                            fontWeight: 600,
                            padding: "1px 4px",
                            borderRadius: 4,
                            background: t.type === "exam" ? "var(--warn-soft)" : "var(--accent-soft)",
                            color: t.type === "exam" ? "var(--warn)" : "var(--accent-ink)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textDecoration: t.done ? "line-through" : "none",
                            opacity: t.done ? 0.5 : 1,
                          }}
                        >
                          {c ? c.code.split(" ")[0] : ""} {t.title}
                        </span>
                      );
                    })}
                    {items.length > 2 && (
                      <span style={{ fontSize: 9, color: "var(--ink-faint)" }}>
                        +{items.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginTop: 14,
              fontSize: 12,
              color: "var(--ink-faint)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="dot" style={{ background: "var(--accent)" }}></span> Assignment
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="dot" style={{ background: "var(--warn)" }}></span> Exam
            </span>
          </div>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Up next</h3>
          {agenda.length === 0 ? (
            <Empty icon="check" title="All clear" sub="No open deadlines." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {agenda.slice(0, 8).map((t) => {
                const c = courseOf(t.courseId);
                const dd = daysUntil(t.date);
                return (
                  <div
                    key={t.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 0",
                      borderBottom: "1px solid var(--line-soft)",
                    }}
                  >
                    <button
                      onClick={() => store.toggleTask(t.id)}
                      aria-label="Done"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: "1.5px solid var(--line)",
                        background: "var(--surface)",
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {t.title}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--ink-faint)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          className="dot"
                          style={{ width: 6, height: 6, background: c ? c.color : "var(--line)" }}
                        ></span>
                        {fmtDate(t.date, { weekday: "short", month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <span
                      className="tag"
                      style={{
                        background: dd <= 3 ? "var(--warn-soft)" : "var(--surface-2)",
                        color: dd <= 3 ? "var(--warn)" : "var(--ink-faint)",
                        fontSize: 11.5,
                      }}
                    >
                      {dd < 0 ? "overdue" : dd === 0 ? "today" : `${dd}d`}
                    </span>
                    <button
                      className="icon-btn danger"
                      onClick={() => store.removeTask(t.id)}
                      aria-label="Remove"
                      style={{ width: 28, height: 28 }}
                    >
                      <Icon name="trash" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <TaskForm
          courses={data.courses}
          initialDate={modal.date}
          onClose={() => setModal(null)}
          onSave={store.addTask}
        />
      )}
    </div>
  );
}
