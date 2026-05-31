import Icon from "./Icon.jsx";
import { NAV } from "./nav.js";

export default function TabBar({ route, setRoute }) {
  return (
    <nav className="tabbar">
      {NAV.map((n) => (
        <button
          key={n.id}
          className={"tab" + (route === n.id ? " active" : "")}
          onClick={() => setRoute(n.id)}
        >
          <Icon name={n.icon} />
          {n.label}
        </button>
      ))}
    </nav>
  );
}
