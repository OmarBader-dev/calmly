
//Calculator.jsx — live GPA + what-if + target planner + weighted assessment calculator
import { useState } from "react";
import Icon from "../components/Icon.jsx";
import PageHead from "../components/PageHead.jsx";
import Empty from "../components/Empty.jsx";
import Field from "../components/Field.jsx";
import {
  GRADES,
  computeGPA,
  courseProjection,
  letterFromPercent,
} from "../data/gpa.js";

function GradePicker({ value, onChange }) {
  return (
    <select
      className="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: 110, padding: "7px 30px 7px 12px", fontSize: 14, fontWeight: 600 }}
    >
      {GRADES.map((g) => (
        <option key={g.g} value={g.g}>
          {g.g === "—" ? "—" : `${g.g} · ${g.p.toFixed(1)}`}
        </option>
      ))}
    </select>
  );
}

function GpaRing({ value, max = 4 }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--line)" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset .6s var(--ease)" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontFamily: "var(--heading-family)", fontSize: 34, fontWeight: 500, lineHeight: 1 }}>
            {value.toFixed(2)}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 3 }}>/ 4.00</div>
        </div>
      </div>
    </div>
  );
}

// weighted assessment calculator
function AssessmentCalculator({ store }) {
  const { data } = store;
  const [selId, setSelId] = useState(data.courses[0]?.id || "");
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [score, setScore] = useState("");

  if (data.courses.length === 0) {
    return (
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 18 }}>Weighted grade by assessment</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 4 }}>
            Break a course grade down into its assignments and exams.
          </p>
        </div>
        <div style={{ padding: 24 }}>
          <Empty icon="calc" title="No courses yet" sub="Add a course to break its grade down." />
        </div>
      </div>
    );
  }

  // resolve the selected course against deletion
  const course = data.courses.find((c) => c.id === selId) || data.courses[0];
  const assessments = course.assessments || [];
  const proj = courseProjection(assessments);

  const wNum = Number(weight);
  const sNum = Number(score);
  const validNew =
    name.trim() && weight !== "" && score !== "" && wNum > 0 && sNum >= 0;

  const add = () => {
    if (!validNew) return;
    store.addAssessment(course.id, {
      name: name.trim(),
      weight: wNum,
      score: sNum,
    });
    setName("");
    setWeight("");
    setScore("");
  };

  return (
    <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
      <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="between" style={{ flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 18 }}>Weighted grade by assessment</h3>
            <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 4 }}>
              Add each assignment or exam with its weight and score — the projected
              grade updates as you go.
            </p>
          </div>
          {data.courses.length > 1 && (
            <select
              className="select"
              value={course.id}
              onChange={(e) => setSelId(e.target.value)}
              style={{ width: "auto", minWidth: 170 }}
            >
              {data.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code || c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* projection summary */}
      <div
        className="card-pad"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          borderBottom: "1px solid var(--line-soft)",
          background: "var(--bg-tint)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "var(--heading-family)", fontSize: 40, fontWeight: 500, lineHeight: 1 }}>
            {proj.percent != null ? `${proj.percent.toFixed(1)}%` : "—"}
          </span>
          <span
            className="tag accent"
            style={{ fontSize: 15, padding: "5px 14px" }}
          >
            {proj.letter}
          </span>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          Projected grade for <strong>{course.code || course.name}</strong>
          <br />
          {proj.totalWeight > 0
            ? `based on ${proj.totalWeight}% of weight${
                proj.complete ? " — fully weighted" : " entered so far"
              }`
            : "add an assessment to see a projection"}
        </div>
        {proj.percent != null && course.grade !== proj.letter && (
          <button
            className="btn btn-soft btn-sm"
            style={{ marginLeft: "auto" }}
            onClick={() => store.updateCourse(course.id, { grade: proj.letter })}
          >
            Set course grade to {proj.letter}
          </button>
        )}
      </div>

      {/* existing assessments */}
      {assessments.length > 0 && (
        <div>
          {assessments.map((a) => {
            const letter = letterFromPercent(Number(a.score));
            return (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 24px",
                  borderBottom: "1px solid var(--line-soft)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{a.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>
                    weight {a.weight}%
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{a.score}%</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{letter}</div>
                </div>
                <button
                  className="icon-btn danger"
                  onClick={() => store.removeAssessment(course.id, a.id)}
                  aria-label="Remove assessment"
                  style={{ width: 30, height: 30 }}
                >
                  <Icon name="trash" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* add new assessment */}
      <div
        className="card-pad"
        style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}
      >
        <div style={{ flex: "2 1 180px" }}>
          <Field label="Assessment name">
            <input
              className="input"
              placeholder="e.g. Midterm Exam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </Field>
        </div>
        <div style={{ flex: "1 1 90px" }}>
          <Field label="Weight %">
            <input
              className="input"
              type="number"
              min="0"
              max="100"
              placeholder="25"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </Field>
        </div>
        <div style={{ flex: "1 1 90px" }}>
          <Field label="Score %">
            <input
              className="input"
              type="number"
              min="0"
              max="100"
              placeholder="93"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
            />
          </Field>
        </div>
        <button
          className="btn btn-primary"
          onClick={add}
          disabled={!validNew}
          style={{ opacity: validNew ? 1 : 0.5 }}
        >
          <Icon name="plus" /> Add
        </button>
      </div>
    </div>
  );
}

export default function Calculator({ store }) {
  const { data } = store;

  // what-if overlay: { [courseId]: grade }
  const [whatif, setWhatif] = useState({});
  const merged = data.courses.map((c) => ({ ...c, grade: whatif[c.id] ?? c.grade }));
  const live = computeGPA(merged);
  const saved = computeGPA(data.courses);
  const dirty = Object.keys(whatif).some((id) => {
    const c = data.courses.find((x) => x.id === id);
    return c && whatif[id] !== c.grade;
  });

  // target planner
  const [target, setTarget] = useState(3.5);
  const [futureCredits, setFutureCredits] = useState(15);
  const cur = saved;
  const neededPts = target * (cur.credits + Number(futureCredits)) - cur.gpa * cur.credits;
  const neededAvg = futureCredits > 0 ? neededPts / Number(futureCredits) : 0;
  const reachable = neededAvg <= 4.0001 && neededAvg >= -0.0001;

  return (
    <div className="fade-in">
      <PageHead
        kicker="The numbers"
        title="GPA Calculator"
        desc="See your GPA update live, break a course down by assessment, play with what-if grades, and plan toward a target — nothing is saved unless you choose."
      />

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <GpaRing value={live.gpa} />
          <div>
            <div
              style={{
                fontSize: 13,
                color: "var(--ink-faint)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {dirty ? "What-if GPA" : "Cumulative GPA"}
            </div>
            <div style={{ fontSize: 14.5, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.6 }}>
              {live.credits} graded credits
              <br />
              {dirty && (
                <span style={{ color: "var(--accent-ink)" }}>
                  {live.gpa >= saved.gpa ? "↑" : "↓"} {Math.abs(live.gpa - saved.gpa).toFixed(2)}{" "}
                  vs. saved ({saved.gpa.toFixed(2)})
                </span>
              )}
            </div>
            {dirty && (
              <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
                <button
                  className="btn btn-soft btn-sm"
                  onClick={() => {
                    Object.entries(whatif).forEach(([id, g]) =>
                      store.updateCourse(id, { grade: g })
                    );
                    setWhatif({});
                  }}
                >
                  Save to courses
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setWhatif({})}>
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card card-pad" style={{ background: "var(--bg-tint)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
            <Icon name="target" style={{ width: 19, height: 19, color: "var(--accent)" }} />
            <h3 style={{ fontSize: 18 }}>Target planner</h3>
          </div>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 16 }}>
            Where do you want to land, and over how many more credits?
          </p>
          <div className="row" style={{ marginBottom: 14 }}>
            <Field label="Target">
              <input
                className="input"
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </Field>
            <Field label="Credits ahead">
              <input
                className="input"
                type="number"
                min="1"
                max="60"
                value={futureCredits}
                onChange={(e) => setFutureCredits(e.target.value)}
              />
            </Field>
          </div>
          <div
            style={{
              padding: "14px 16px",
              borderRadius: "var(--r-md)",
              background: reachable ? "var(--accent-soft)" : "var(--warn-soft)",
            }}
          >
            {cur.credits === 0 ? (
              <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                Add graded courses first to plan a target.
              </span>
            ) : reachable ? (
              <span style={{ fontSize: 14.5, color: "var(--accent-ink)" }}>
                Average{" "}
                <strong style={{ fontFamily: "var(--heading-family)", fontSize: 19 }}>
                  {neededAvg.toFixed(2)}
                </strong>{" "}
                across the next {futureCredits} credits to reach {Number(target).toFixed(2)}.
              </span>
            ) : (
              <span style={{ fontSize: 14, color: "var(--warn)" }}>
                {neededAvg > 4
                  ? `Out of reach over ${futureCredits} credits — even straight A's land you at ${(
                      (cur.gpa * cur.credits + 4 * futureCredits) /
                      (cur.credits + Number(futureCredits))
                    ).toFixed(2)}. Try more credits or a softer target.`
                  : "You're already past this target — aim higher."}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* the custom weighted-assessment feature */}
      <AssessmentCalculator store={store} />

      {/* what-if grade list */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="card-pad" style={{ borderBottom: "1px solid var(--line)" }}>
          <h3 style={{ fontSize: 18 }}>Adjust grades</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-faint)", marginTop: 4 }}>
            Change a grade to preview the impact. Edits stay here until you save them.
          </p>
        </div>
        {merged.length === 0 ? (
          <div style={{ padding: 24 }}>
            <Empty icon="calc" title="No courses to calculate" sub="Add courses to see your GPA." />
          </div>
        ) : (
          <div>
            {merged.map((c) => {
              const changed =
                whatif[c.id] != null &&
                whatif[c.id] !== data.courses.find((x) => x.id === c.id).grade;
              return (
                <div
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 24px",
                    borderBottom: "1px solid var(--line-soft)",
                    background: changed ? "var(--surface-2)" : "transparent",
                  }}
                >
                  <span className="dot" style={{ background: c.color }}></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{c.code} </span>
                    <span style={{ fontSize: 14, color: "var(--ink-soft)" }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "var(--ink-faint)", width: 70, textAlign: "right" }}>
                    {c.credits} cr
                  </span>
                  <GradePicker
                    value={c.grade}
                    onChange={(g) => setWhatif((w) => ({ ...w, [c.id]: g }))}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
