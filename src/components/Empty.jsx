import Icon from "./Icon.jsx";

export default function Empty({ icon, title, sub, action }) {
  return (
    <div className="empty">
      <Icon name={icon || "leaf"} />
      <div className="t">{title}</div>
      {sub && <div className="s">{sub}</div>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}
