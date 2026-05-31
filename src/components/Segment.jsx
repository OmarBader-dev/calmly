export default function Segment({ value, onChange, options }) {
  return (
    <div className="segment">
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        const active = v === value;
        return (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={active ? "active" : ""}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
