# Calmly — A Calm Study Planner

A minimalist, zen-focused study companion for university students. Track your
courses, watch your GPA update live, plan deadlines on a clean calendar, and
swap skills with classmates — all in one quiet place.

> **CSCI390: Web Programming — Project Phase 2**
> Author: **Omar Bader**

---

## Project Description

Calmly is a single-page React application that helps undergraduates stay on
top of a term without the visual noise of typical student dashboards. It
combines four useful tools into one calm interface:

1. **Home dashboard** — a daily greeting, your live cumulative GPA, open
   tasks, and what is coming up next.
2. **Courses** — add the courses you are taking with credits and grades; term
   GPA updates instantly.
3. **GPA Calculator** — a live GPA ring, *what-if* grade previews, a target
   planner ("what average do I need over the next N credits to land at 3.5?"),
   and a **weighted assessment** calculator for figuring out a course grade
   from individual assignments and exams.
4. **Calendar** — a month grid where you tap any day to add an exam or an
   assignment; color-coded by type with an agenda of what is up next.
5. **Skill Swap board** — a campus exchange where students post skills they
   can teach or want to learn, with automatic match suggestions.
6. **About & Help** — a 4.0 grade-scale reference and data controls.

Everything is persisted to your browser's `localStorage` — no account, no
sync, nothing leaves your device.

## Tech Stack

- **React 18** (functional components + hooks)
- **Vite** as the build tool and dev server
- **Plain CSS** with a custom design system (`oklch()` palette, three themes:
  Warm Calm, Cool Focus, Paper & Ink)
- **Google Fonts** — *Spectral* (serif headings) and *Hanken Grotesk* (body)
- **No backend** — state lives in `localStorage`

## Features

- Responsive layout — sidebar on desktop, bottom tab bar on mobile
- Three switchable themes plus a serif/sans heading toggle
- 4.0 GPA scale (A = 4.0, A- = 3.7, ...) with letter-grade selectors
- What-if grade previews that do not overwrite saved data
- Target planner that tells you the average you need to reach a goal GPA
- Weighted assessment calculator — enter assessments with weights and scores
  (e.g. *"Midterm — 25% — 93 → A"*) to see your projected course grade
- Click-any-day calendar with assignment vs. exam color coding
- Skill swap board with search, category filter, and automatic match
  suggestions between "wants to learn" and "can teach" posts
- All state persists locally between visits

## Project Structure

```
calmly/
├── public/                # static assets
├── src/
│   ├── components/        # shared UI (Sidebar, Modal, Icon, ...)
│   ├── data/              # store, GPA logic, seed data
│   ├── pages/             # Home, Courses, Calculator, Calendar, Swap, About
│   ├── styles/global.css  # design system + themes
│   ├── App.jsx            # routing shell
│   └── main.jsx           # entry point
├── index.html
├── package.json
└── vite.config.js
```

## Setup

You need **Node.js 18+** and **npm** installed.

```bash
# 1. clone the repository
git clone https://github.com/OmarBader-dev/calmly.git
cd calmly

# 2. install dependencies
npm install

# 3. start the dev server
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`) in your browser.

### Production build

```bash
npm run build       # outputs to ./dist
npm run preview     # serves the production build locally
```

## Deployment

The app is a static site after `npm run build`, so it works on any static host.

**Live site:** https://omarbader-dev.github.io/calmly/

This repository deploys to **GitHub Pages** automatically via GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)): every push to
`main` builds the project and publishes `dist/`. The Vite `base` is set to `"./"`
so assets resolve correctly under the `/calmly/` project path, and the app uses
hash-based routing so deep links work without server configuration.

To enable it on a fresh fork: open **Settings → Pages**, set **Source** to
**GitHub Actions**, then push to `main`.

## Screenshots

> _Screenshots will be added once all functionality stages are merged._

| Page       | Preview |
| ---------- | ------- |
| Home       | _coming soon_ |
| Courses    | _coming soon_ |
| Calculator | _coming soon_ |
| Calendar   | _coming soon_ |
| Skill Swap | _coming soon_ |
| About      | _coming soon_ |

## Academic Integrity

All code is original work by Omar Bader. The design direction was prototyped
with assistance from an AI design tool and then re-implemented from scratch in
React for this submission. No pre-built templates were used.

## License

For academic submission — CSCI390, Spring 2025–2026.
