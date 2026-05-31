// store.js — (state + localStorage)

import { useState, useEffect, useMemo } from "react";
import { uid } from "./dates.js";
import { COURSE_COLORS } from "./gpa.js";

// mostly empty, with the course's real example
export function seed() {
  const c1 = uid();
  return {
    name: "Omar",
    courses: [
      {
        id: c1,
        code: "CSCI390",
        name: "Web Programming",
        credits: 3,
        grade: "—",
        color: COURSE_COLORS[0],
        assessments: [
          { id: uid(), name: "Assessment 1", weight: 25, score: 93 },
        ],
      },
    ],
    tasks: [
      {
        id: uid(),
        courseId: c1,
        title: "Final Exam",
        type: "exam",
        date: "2026-06-04",
        done: false,
      },
    ],
    posts: [
      {
        id: uid(),
        kind: "teach",
        person: "Omar Bader",
        skill: "Building Websites in React",
        category: "Tech & Code",
        blurb:
          "Taking CSCI390 Web Programming and happy to help — components, hooks, styling, and getting your React site deployed.",
        contact: "12330258@students.liu.edu.lb",
        color: COURSE_COLORS[2],
        mine: true,
      },
    ],
  };
}

const KEY = "calmly.v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
   //to ignore corrupt storage
  }
  return seed();
}

// store hook
export function useStore() {
  const [data, setData] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      //storage maybe full ignore
    }
  }, [data]);

  const api = useMemo(
    () => ({
      data,
      setName: (name) => setData((d) => ({ ...d, name })),

      // courses
      addCourse: (c) =>
        setData((d) => ({
          ...d,
          courses: [
            ...d.courses,
            {
              ...c,
              id: uid(),
              assessments: c.assessments || [],
              color: COURSE_COLORS[d.courses.length % COURSE_COLORS.length],
            },
          ],
        })),
      updateCourse: (id, patch) =>
        setData((d) => ({
          ...d,
          courses: d.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      removeCourse: (id) =>
        setData((d) => ({
          ...d,
          courses: d.courses.filter((c) => c.id !== id),
          tasks: d.tasks.filter((t) => t.courseId !== id),
        })),

      // assessments (live on a course)
      addAssessment: (courseId, a) =>
        setData((d) => ({
          ...d,
          courses: d.courses.map((c) =>
            c.id === courseId
              ? { ...c, assessments: [...(c.assessments || []), { ...a, id: uid() }] }
              : c
          ),
        })),
      updateAssessment: (courseId, aid, patch) =>
        setData((d) => ({
          ...d,
          courses: d.courses.map((c) =>
            c.id === courseId
              ? {
                  ...c,
                  assessments: (c.assessments || []).map((a) =>
                    a.id === aid ? { ...a, ...patch } : a
                  ),
                }
              : c
          ),
        })),
      removeAssessment: (courseId, aid) =>
        setData((d) => ({
          ...d,
          courses: d.courses.map((c) =>
            c.id === courseId
              ? { ...c, assessments: (c.assessments || []).filter((a) => a.id !== aid) }
              : c
          ),
        })),

      // tasks
      addTask: (t) =>
        setData((d) => ({
          ...d,
          tasks: [...d.tasks, { ...t, id: uid(), done: false }],
        })),
      updateTask: (id, patch) =>
        setData((d) => ({
          ...d,
          tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      toggleTask: (id) =>
        setData((d) => ({
          ...d,
          tasks: d.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      removeTask: (id) =>
        setData((d) => ({
          ...d,
          tasks: d.tasks.filter((t) => t.id !== id),
        })),

      // posts
      addPost: (p) =>
        setData((d) => ({ ...d, posts: [{ ...p, id: uid() }, ...d.posts] })),
      removePost: (id) =>
        setData((d) => ({ ...d, posts: d.posts.filter((p) => p.id !== id) })),

      // data controls
      reset: () => setData(seed()),
      clearAll: () => setData({ name: "Omar", courses: [], tasks: [], posts: [] }),
    }),
    [data]
  );

  return api;
}
