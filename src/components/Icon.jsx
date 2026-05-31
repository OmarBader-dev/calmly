const PATHS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5",
  book: "M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM19 18v3H6",
  calc: "M5 3h14v18H5zM8 7h8M8 11h2M8 15h2M14 11h2v6h-2z",
  calendar: "M4 6h16v15H4zM4 10h16M8 3v4M16 3v4",
  swap: "M7 7h11l-3-3M17 17H6l3 3",
  help: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 2-2.5 2-2.5 4M12 17h.01",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l5 5 9-11",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14",
  edit: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 7v5l3 2",
  flag: "M5 21V4M5 4h11l-2 4 2 4H5",
  x: "M6 6l12 12M18 6 6 18",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  leaf: "M5 19c0-8 6-13 14-13 0 8-5 14-14 13M5 19c3-4 6-6 9-7",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20c1-4 4-5 7-5s6 1 7 5",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14M20 20l-4-4",
  filter: "M3 5h18l-7 8v6l-4-2v-4z",
  graduation: "M12 4 2 9l10 5 10-5zM6 11v5c0 1 3 3 6 3s6-2 6-3v-5",
  chevronRight: "M9 6l6 6-6 6",
  sun: "M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10",
  moon: "M20 15a8 8 0 1 1-9.5-11A6 6 0 0 0 20 15z",
};

export default function Icon({ name, style, className }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      {d
        .split("M")
        .filter(Boolean)
        .map((seg, i) => (
          <path key={i} d={"M" + seg} />
        ))}
    </svg>
  );
}
