import Brand from "./Brand.jsx";
import Icon from "./Icon.jsx";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import { NAV } from "./nav.js";

export default function Sidebar({ route, setRoute, gpa, theme, serif, setTheme, setSerif }) {
  return (
    <aside className="sidebar">
      <Brand />
      <nav className="nav">
        {NAV.slice(0, 5).map((n) => (
          <button
            key={n.id}
            className={"nav-item" + (route === n.id ? " active" : "")}
            onClick={() => setRoute(n.id)}
          >
            <Icon name={n.icon} /> {n.label}
          </button>
        ))}
        <div className="nav-label">More</div>
        <button
          className={"nav-item" + (route === "about" ? " active" : "")}
          onClick={() => setRoute("about")}
        >
          <Icon name="help" /> About &amp; Help
        </button>
      </nav>
      <div className="sidebar-foot">
        <div style={{ marginBottom: 14 }}>
          <div className="appearance-label">Appearance</div>
          <ThemeSwitcher
            theme={theme}
            serif={serif}
            setTheme={setTheme}
            setSerif={setSerif}
          />
        </div>
        <div className="gpa-chip">
          <span className="v">{gpa.credits ? gpa.gpa.toFixed(2) : "—"}</span>
          <span className="l">
            cumulative GPA
            <br />
            {gpa.credits} graded credits
          </span>
        </div>
      </div>
    </aside>
  );
}
