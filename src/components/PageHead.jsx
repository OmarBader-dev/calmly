export default function PageHead({ kicker, title, desc, action }) {
  return (
    <header className="page-head">
      <div className="between">
        <div>
          {kicker && <div className="page-kicker">{kicker}</div>}
          <h1 className="page-title">{title}</h1>
        </div>
        {action}
      </div>
      {desc && <p className="page-desc">{desc}</p>}
    </header>
  );
}
