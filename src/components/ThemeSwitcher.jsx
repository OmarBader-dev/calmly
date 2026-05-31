import { THEME_META } from "../data/theme.js";

export default function ThemeSwitcher({ theme, serif, setTheme, setSerif }) {
  return (
    <div className="theme-switch">
      <div className="theme-swatches">
        {THEME_META.map((t) => (
          <button
            key={t.id}
            className={"theme-swatch" + (theme === t.id ? " active" : "")}
            onClick={() => setTheme(t.id)}
            title={`${t.label} theme`}
            aria-label={`${t.label} theme`}
            aria-pressed={theme === t.id}
            style={{ background: t.bg }}
          >
            <span style={{ background: t.accent }} />
          </button>
        ))}
      </div>
      <button
        className={"serif-toggle" + (serif ? " active" : "")}
        onClick={() => setSerif(!serif)}
        title="Toggle serif headings"
        aria-pressed={serif}
      >
        Aa
      </button>
    </div>
  );
}
