
//About.jsx — about & help, GPA reference, data controls

import { useState } from "react";
import Icon from "../components/Icon.jsx";
import PageHead from "../components/PageHead.jsx";
import Modal from "../components/Modal.jsx";
import { GRADES } from "../data/gpa.js";

function HelpItem({ icon, title, children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        padding: "16px 0",
        borderBottom: "1px solid var(--line-soft)",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "var(--r-md)",
          background: "var(--accent-soft)",
          color: "var(--accent-ink)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} style={{ width: 18, height: 18 }} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{title}</div>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 3, lineHeight: 1.55 }}>
          {children}
        </p>
      </div>
    </div>
  );
}

export default function About({ store }) {
  const [confirm, setConfirm] = useState(null);

  return (
    <div className="fade-in">
      <PageHead
        kicker="The basics"
        title="About & Help"
        desc="Quietly is a calm home for the few things that actually move your term forward — your courses, your GPA, your deadlines, and the people who can help."
      />

      <div className="grid" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 18, alignItems: "start" }}>
        <div className="card card-pad">
          <h3 style={{ fontSize: 19, marginBottom: 4 }}>How it works</h3>
          <HelpItem icon="book" title="Add your courses">
            Enter each course with its credits and grade in <strong>Courses</strong>. In-progress
            courses don't count toward GPA until you give them a grade.
          </HelpItem>
          <HelpItem icon="calc" title="Watch your GPA">
            The <strong>Calculator</strong> updates live. Break a course down by{" "}
            <strong>weighted assessments</strong> (name, weight, score) to project a letter grade,
            try what-if grades, or set a target and see the average you'd need.
          </HelpItem>
          <HelpItem icon="calendar" title="Plan deadlines">
            Tap any day in the <strong>Calendar</strong> to add an exam or assignment. Your nearest
            deadlines surface on Home and in "Up next."
          </HelpItem>
          <HelpItem icon="swap" title="Swap skills">
            Post what you can teach or want to learn on the <strong>Skill Swap</strong> board.
            Matches appear automatically when someone offers what you're after.
          </HelpItem>
        </div>

        <div className="grid" style={{ gap: 18 }}>
          <div className="card card-pad">
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
              <Icon name="graduation" style={{ width: 19, height: 19, color: "var(--accent)" }} />
              <h3 style={{ fontSize: 18 }}>4.0 grade scale</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px" }}>
              {GRADES.filter((g) => g.p !== null).map((g) => (
                <div
                  key={g.g}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13.5,
                    paddingBottom: 6,
                    borderBottom: "1px solid var(--line-soft)",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{g.g}</span>
                  <span style={{ color: "var(--ink-faint)" }}>{g.p.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 14, lineHeight: 1.5 }}>
              GPA = sum of (grade points × credits) ÷ sum of (credits), counting only graded courses.
            </p>
          </div>

          <div className="card card-pad">
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Your data</h3>
            <p
              style={{
                fontSize: 13.5,
                color: "var(--ink-soft)",
                lineHeight: 1.5,
                marginBottom: 16,
              }}
            >
              Everything stays in this browser — nothing leaves your device. No account, no sync.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirm("reset")}>
                Reset to sample
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setConfirm("clear")}>
                Clear everything
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="card card-pad"
        style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 13 }}
      >
        <div className="brand-mark" style={{ width: 38, height: 38 }}>
          <Icon name="leaf" />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
            Quietly — built by Omar Bader
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>
            CSCI390: Web Programming · Project Phase 2 · React + Vite
          </div>
        </div>
      </div>

      {confirm && (
        <Modal
          title={confirm === "reset" ? "Reset to sample data?" : "Clear everything?"}
          onClose={() => setConfirm(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  confirm === "reset" ? store.reset() : store.clearAll();
                  setConfirm(null);
                }}
              >
                {confirm === "reset" ? "Reset" : "Clear all"}
              </button>
            </>
          }
        >
          <p style={{ fontSize: 14.5, color: "var(--ink-soft)", lineHeight: 1.55 }}>
            {confirm === "reset"
              ? "This replaces your current courses, deadlines, and posts with the original sample set."
              : "This permanently removes all your courses, deadlines, and posts. This can't be undone."}
          </p>
        </Modal>
      )}
    </div>
  );
}
