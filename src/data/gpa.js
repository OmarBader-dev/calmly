// GPA logic 4.0 scale (A = 4.0, A- = 3.7, ...). "—" means not graded.
export const GRADES = [
  { g: "A", p: 4.0 },
  { g: "A-", p: 3.7 },
  { g: "B+", p: 3.3 },
  { g: "B", p: 3.0 },
  { g: "B-", p: 2.7 },
  { g: "C+", p: 2.3 },
  { g: "C", p: 2.0 },
  { g: "C-", p: 1.7 },
  { g: "D+", p: 1.3 },
  { g: "D", p: 1.0 },
  { g: "F", p: 0.0 },
  { g: "—", p: null },
];

const GRADE_POINT = Object.fromEntries(GRADES.map((x) => [x.g, x.p]));

export function gradePoint(g) {
  const p = GRADE_POINT[g];
  return p === undefined ? null : p;
}

// GPA over courses that carry a real letter grade.
// GPA = sum of (grade points × credits) ÷ sum of (credits).
export function computeGPA(courses) {
  let pts = 0;
  let cr = 0;
  for (const c of courses) {
    const p = gradePoint(c.grade);
    if (p === null || !c.credits) continue;
    pts += p * Number(c.credits);
    cr += Number(c.credits);
  }
  return { gpa: cr ? pts / cr : 0, credits: cr };
}

// Total credits across all courses, graded or not.
export function totalCredits(courses) {
  return courses.reduce((s, c) => s + (Number(c.credits) || 0), 0);
}

// weighted assessments (per course)
// an assessment is { id, name, weight (percent), score (percent) }.
// Map a 0–100 percentage to a 4.0-scale letter grade.
const LETTER_CUTOFFS = [
  { min: 93, g: "A" },
  { min: 90, g: "A-" },
  { min: 87, g: "B+" },
  { min: 83, g: "B" },
  { min: 80, g: "B-" },
  { min: 77, g: "C+" },
  { min: 73, g: "C" },
  { min: 70, g: "C-" },
  { min: 67, g: "D+" },
  { min: 63, g: "D" },
  { min: 0, g: "F" },
];

export function letterFromPercent(pct) {
  if (pct == null || Number.isNaN(pct)) return "—";
  const hit = LETTER_CUTOFFS.find((c) => pct >= c.min);
  return hit ? hit.g : "F";
}

// Returns { percent, totalWeight, complete } for a course assessments.
export function courseProjection(assessments = []) {
  let weighted = 0;
  let totalWeight = 0;
  for (const a of assessments) {
    const w = Number(a.weight) || 0;
    const s = Number(a.score);
    if (!w || Number.isNaN(s)) continue;
    weighted += w * s;
    totalWeight += w;
  }
  const percent = totalWeight ? weighted / totalWeight : null;
  return {
    percent,
    totalWeight,
    complete: Math.abs(totalWeight - 100) < 0.01,
    letter: letterFromPercent(percent),
  };
}

// Small palette used to color-code courses and posts.
export const COURSE_COLORS = [
  "oklch(0.60 0.062 155)",
  "oklch(0.60 0.075 250)",
  "oklch(0.62 0.085 45)",
  "oklch(0.58 0.075 310)",
  "oklch(0.60 0.075 200)",
  "oklch(0.62 0.080 95)",
];
