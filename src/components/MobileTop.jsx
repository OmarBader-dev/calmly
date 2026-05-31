import Icon from "./Icon.jsx";

export default function MobileTop({ gpa }) {
  return (
    <div className="mobile-top">
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div className="brand-mark" style={{ width: 30, height: 30 }}>
          <Icon name="leaf" />
        </div>
        <span className="brand-name" style={{ fontSize: 17 }}>
          Calmly
        </span>
      </div>
      <div className="gpa-chip" style={{ padding: 0 }}>
        <span className="v" style={{ fontSize: 20 }}>
          {gpa.credits ? gpa.gpa.toFixed(2) : "—"}
        </span>
      </div>
    </div>
  );
}
