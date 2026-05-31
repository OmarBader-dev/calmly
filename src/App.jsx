import { useEffect, useState } from "react";

const PAGES = ["home", "courses", "calculator", "calendar", "swap", "about"];

function Placeholder({ name }) {
  return (
    <div style={{ padding: 48 }}>
      <h1 style={{ fontFamily: "Spectral, Georgia, serif", fontSize: 36, margin: 0 }}>
        {name}
      </h1>
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState(
    () => window.location.hash.slice(1) || "home"
  );

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.slice(1) || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r) => {
    window.location.hash = r;
    setRoute(r);
    window.scrollTo({ top: 0 });
  };

  const active = PAGES.includes(route) ? route : "home";

  return (
    <div className="app">
      <nav style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #eee" }}>
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            style={{
              padding: "6px 12px",
              border: "1px solid #ddd",
              borderRadius: 999,
              background: active === p ? "#222" : "transparent",
              color: active === p ? "#fff" : "#333",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {p}
          </button>
        ))}
      </nav>
      <main>
        <Placeholder name={active.charAt(0).toUpperCase() + active.slice(1)} />
      </main>
    </div>
  );
}
