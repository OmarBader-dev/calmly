// Courses.jsx — manage courses (add / edit / delete)

import { useState } from "react";
import Icon from "../components/Icon.jsx";
import PageHead from "../components/PageHead.jsx";
import Empty from "../components/Empty.jsx";
import Modal from "../components/Modal.jsx";
import Field from "../components/Field.jsx";
import { GRADES, gradePoint, computeGPA, totalCredits } from "../data/gpa.js";

function CourseForm({ initial, onSave, onClose }) {
  const [code, setCode] = useState(initial?.code || "");
  const [name, setName] = useState(initial?.name || "");
  const [credits, setCredits] = useState(initial?.credits ?? 3);
  const [grade, setGrade] = useState(initial?.grade || "—");
  const valid = name.trim() && credits > 0;

  return (
    <Modal
      title={initial ? "Edit course" : "Add a course"}
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
              onSave({
                code: code.trim(),
                name: name.trim(),
                credits: Number(credits),
                grade,
              });
              onClose();
            }}
          >
            {initial ? "Save changes" : "Add course"}
          </button>
        </>
      }
    >
      <div className="row">
        <div style={{ flex: "0 0 120px" }}>
          <Field label="Code">
            <input
              className="input"
              placeholder="CSCI390"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Course name">
            <input
              className="input"
              placeholder="Web Programming"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div style={{ flex: 1 }}>
          <Field label="Credits">
            <input
              className="input"
              type="number"
              min="0"
              max="12"
              step="0.5"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Grade">
            <select
              className="select"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {GRADES.map((g) => (
                <option key={g.g} value={g.g}>
                  {g.g === "—" ? "— In progress" : `${g.g}  (${g.p.toFixed(1)})`}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function CourseRow({ course, taskCount, onEdit, onDelete }) {
  const p = gradePoint(course.grade);
  return (
    <div
      className="card card-pad"
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}
    >
      <span className="dot" style={{ width: 12, height: 12, background: course.color }}></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>
            {course.code || "—"}
          </span>
          <span style={{ fontFamily: "var(--heading-family)", fontSize: 17, color: "var(--ink)" }}>
            {course.name}
          </span>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 3 }}>
          {course.credits} credits
          {course.assessments?.length
            ? ` · ${course.assessments.length} assessment${
                course.assessments.length > 1 ? "s" : ""
              }`
            : ""}
          {taskCount ? ` · ${taskCount} deadline${taskCount > 1 ? "s" : ""}` : ""}
        </div>
      </div>
      <div style={{ textAlign: "right", marginRight: 6 }}>
        <div
          style={{
            fontFamily: "var(--heading-family)",
            fontSize: 24,
            fontWeight: 500,
            color: course.grade === "—" ? "var(--ink-faint)" : "var(--ink)",
          }}
        >
          {course.grade}
        </div>
        {p !== null && (
          <div style={{ fontSize: 11.5, color: "var(--ink-faint)" }}>{p.toFixed(1)} pts</div>
        )}
      </div>
      <div style={{ display: "flex", gap: 7 }}>
        <button className="icon-btn" onClick={onEdit} aria-label="Edit">
          <Icon name="edit" />
        </button>
        <button className="icon-btn danger" onClick={onDelete} aria-label="Delete">
          <Icon name="trash" />
        </button>
      </div>
    </div>
  );
}

export default function Courses({ store }) {
  const { data } = store;
   // null | { mode: "new" } | { mode: "edit", course }
  const [modal, setModal] = useState(null);
  const { gpa, credits } = computeGPA(data.courses);
  const tc = totalCredits(data.courses);

  return (
    <div className="fade-in">
      <PageHead
        kicker="Your term"
        title="Courses"
        desc="Add what you're taking this term. Grades feed straight into your GPA."
        action={
          <button className="btn btn-primary" onClick={() => setModal({ mode: "new" })}>
            <Icon name="plus" /> Add course
          </button>
        }
      />

      {data.courses.length > 0 && (
        <div
          className="card card-pad"
          style={{ display: "flex", gap: 40, marginBottom: 22, background: "var(--bg-tint)" }}
        >
          <div>
            <div style={{ fontFamily: "var(--heading-family)", fontSize: 30, fontWeight: 500 }}>
              {credits ? gpa.toFixed(2) : "—"}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>term GPA</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--heading-family)", fontSize: 30, fontWeight: 500 }}>
              {tc}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>credits enrolled</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--heading-family)", fontSize: 30, fontWeight: 500 }}>
              {data.courses.length}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>courses</div>
          </div>
        </div>
      )}

      {data.courses.length === 0 ? (
        <Empty
          icon="book"
          title="No courses yet"
          sub="Add your first course to start tracking your GPA."
          action={
            <button className="btn btn-soft" onClick={() => setModal({ mode: "new" })}>
              <Icon name="plus" /> Add a course
            </button>
          }
        />
      ) : (
        <div className="grid" style={{ gap: 12 }}>
          {data.courses.map((c) => (
            <CourseRow
              key={c.id}
              course={c}
              taskCount={data.tasks.filter((t) => t.courseId === c.id && !t.done).length}
              onEdit={() => setModal({ mode: "edit", course: c })}
              onDelete={() => store.removeCourse(c.id)}
            />
          ))}
        </div>
      )}

      {modal?.mode === "new" && (
        <CourseForm onClose={() => setModal(null)} onSave={store.addCourse} />
      )}
      {modal?.mode === "edit" && (
        <CourseForm
          initial={modal.course}
          onClose={() => setModal(null)}
          onSave={(patch) => store.updateCourse(modal.course.id, patch)}
        />
      )}
    </div>
  );
}
