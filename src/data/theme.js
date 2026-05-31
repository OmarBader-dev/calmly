/* ============================================================
   theme.js — theme + serif preference (persisted to localStorage)
   ============================================================ */
import { useState, useEffect } from "react";

const KEY = "quietly.theme";

export const THEME_META = [
  { id: "warm", label: "Warm", bg: "oklch(0.985 0.006 85)", accent: "oklch(0.60 0.062 155)" },
  { id: "cool", label: "Cool", bg: "oklch(0.984 0.005 250)", accent: "oklch(0.58 0.085 245)" },
  { id: "paper", label: "Paper", bg: "oklch(0.975 0.012 80)", accent: "oklch(0.30 0.018 60)" },
];

function loadTheme() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { theme: "warm", serif: true, ...JSON.parse(raw) };
  } catch (e) {
    /* ignore */
  }
  return { theme: "warm", serif: true };
}

export function useTheme() {
  const [pref, setPref] = useState(loadTheme);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", pref.theme);
    html.setAttribute("data-serif", pref.serif ? "on" : "off");
    try {
      localStorage.setItem(KEY, JSON.stringify(pref));
    } catch (e) {
      /* ignore */
    }
  }, [pref]);

  return {
    theme: pref.theme,
    serif: pref.serif,
    setTheme: (theme) => setPref((p) => ({ ...p, theme })),
    setSerif: (serif) => setPref((p) => ({ ...p, serif })),
  };
}
