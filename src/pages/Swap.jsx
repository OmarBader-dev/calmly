/* ============================================================
   Swap.jsx — campus skill-swap board
   ============================================================ */
import { useState } from "react";
import Icon from "../components/Icon.jsx";
import PageHead from "../components/PageHead.jsx";
import Empty from "../components/Empty.jsx";
import Modal from "../components/Modal.jsx";
import Field from "../components/Field.jsx";
import Segment from "../components/Segment.jsx";
import { COURSE_COLORS } from "../data/gpa.js";

const SWAP_CATEGORIES = [
  "Academics",
  "Languages",
  "Music",
  "Tech & Code",
  "Creative",
  "Fitness",
  "Life skills",
  "Other",
];

function PostForm({ onSave, onClose }) {
  const [kind, setKind] = useState("teach");
  const [skill, setSkill] = useState("");
  const [person, setPerson] = useState("");
  const [category, setCategory] = useState(SWAP_CATEGORIES[0]);
  const [blurb, setBlurb] = useState("");
  const [contact, setContact] = useState("");
  const valid = skill.trim() && person.trim();

  return (
    <Modal
      title="Post to the board"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!valid}
            style={{ opacity: valid ? 1 : 0.5 }}
            onClick={() => {
              onSave({
                kind,
                skill: skill.trim(),
                person: person.trim(),
                category,
                blurb: blurb.trim(),
                contact: contact.trim(),
                color: COURSE_COLORS[Math.floor(Math.random() * COURSE_COLORS.length)],
                mine: true,
              });
              onClose();
            }}
          >
            Post it
          </button>
        </>
      }
    >
      <Field label="I want to…">
        <Segment
          value={kind}
          onChange={setKind}
          options={[
            { value: "teach", label: "Teach a skill" },
            { value: "learn", label: "Learn a skill" },
          ]}
        />
      </Field>
      <div className="row">
        <div style={{ flex: 1 }}>
          <Field label="Skill">
            <input
              className="input"
              placeholder="e.g. Building Websites in React"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              autoFocus
            />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Category">
            <select
              className="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {SWAP_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>
      <div className="row">
        <div style={{ flex: 1 }}>
          <Field label="Your name">
            <input
              className="input"
              placeholder="Omar Bader"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
            />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Contact (optional)">
            <input
              className="input"
              placeholder="@handle or email"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </Field>
        </div>
      </div>
      <Field label="A line about it (optional)">
        <textarea
          className="textarea"
          placeholder="When you're free, what level, how you like to meet…"
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
        />
      </Field>
    </Modal>
  );
}

function initials(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PostCard({ post, onRemove }) {
  const teach = post.kind === "teach";
  return (
    <div
      className="card card-pad"
      style={{ display: "flex", flexDirection: "column", gap: 12, position: "relative" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: post.color,
            color: "var(--surface)",
            display: "grid",
            placeItems: "center",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials(post.person)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {post.person}
            {post.mine && (
              <span style={{ color: "var(--ink-faint)", fontWeight: 500 }}> · you</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-faint)" }}>{post.category}</div>
        </div>
        <span
          className="tag"
          style={{
            background: teach ? "var(--accent-soft)" : "var(--surface-2)",
            color: teach ? "var(--accent-ink)" : "var(--ink-soft)",
          }}
        >
          {teach ? "offers" : "wants"}
        </span>
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-faint)",
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          {teach ? "Can teach" : "Wants to learn"}
        </div>
        <div style={{ fontFamily: "var(--heading-family)", fontSize: 20, color: "var(--ink)" }}>
          {post.skill}
        </div>
      </div>
      {post.blurb && (
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>{post.blurb}</p>
      )}
      <div className="between" style={{ marginTop: 2 }}>
        {post.contact ? (
          <span className="tag" style={{ background: "var(--surface-2)" }}>
            <Icon name="user" style={{ width: 13, height: 13 }} /> {post.contact}
          </span>
        ) : (
          <span style={{ fontSize: 12.5, color: "var(--ink-faint)" }}>No contact listed</span>
        )}
        {post.mine ? (
          <button
            className="icon-btn danger"
            onClick={() => onRemove(post.id)}
            aria-label="Remove"
            style={{ width: 30, height: 30 }}
          >
            <Icon name="trash" />
          </button>
        ) : (
          <button className="btn btn-soft btn-sm">{teach ? "Reach out" : "I can help"}</button>
        )}
      </div>
    </div>
  );
}

export default function Swap({ store }) {
  const { data } = store;
  const [modal, setModal] = useState(false);
  const [kindFilter, setKindFilter] = useState("all");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");

  const filtered = data.posts.filter((p) => {
    if (kindFilter !== "all" && p.kind !== kindFilter) return false;
    if (cat !== "All" && p.category !== cat) return false;
    if (q && !`${p.skill} ${p.person} ${p.category} ${p.blurb}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  // matches: my "learn" posts that someone else "teaches"
  const myLearns = data.posts.filter((p) => p.mine && p.kind === "learn");
  const matches = myLearns.flatMap((ml) =>
    data.posts
      .filter(
        (p) =>
          !p.mine &&
          p.kind === "teach" &&
          p.skill
            .toLowerCase()
            .split(/\s+/)
            .some((w) => w.length > 2 && ml.skill.toLowerCase().includes(w))
      )
      .map((p) => ({ want: ml, offer: p }))
  );

  return (
    <div className="fade-in">
      <PageHead
        kicker="Campus exchange"
        title="Skill Swap"
        desc="Teach what you know, learn what you don't. Post a skill and find someone nearby who fits."
        action={
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Icon name="plus" /> Post a skill
          </button>
        }
      />

      {matches.length > 0 && (
        <div
          className="card card-pad"
          style={{ background: "var(--accent-soft)", border: "1px solid transparent", marginBottom: 22 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
            <Icon name="spark" style={{ width: 18, height: 18, color: "var(--accent-ink)" }} />
            <h3 style={{ fontSize: 17, color: "var(--accent-ink)" }}>Matches for you</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {matches.slice(0, 3).map((m, i) => (
              <div key={i} style={{ fontSize: 14, color: "var(--accent-ink)" }}>
                You want <strong>{m.want.skill}</strong> — <strong>{m.offer.person}</strong> teaches{" "}
                {m.offer.skill}
                {m.offer.contact && <span style={{ opacity: 0.7 }}> · {m.offer.contact}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className="card card-pad"
        style={{ marginBottom: 20, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}
      >
        <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
          <Icon
            name="search"
            style={{
              width: 16,
              height: 16,
              position: "absolute",
              left: 13,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--ink-faint)",
            }}
          />
          <input
            className="input"
            placeholder="Search skills, names…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>
        <Segment
          value={kindFilter}
          onChange={setKindFilter}
          options={[
            { value: "all", label: "All" },
            { value: "teach", label: "Offers" },
            { value: "learn", label: "Wants" },
          ]}
        />
        <select
          className="select"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          style={{ width: "auto", minWidth: 150 }}
        >
          <option>All</option>
          {SWAP_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon="swap"
          title="No posts match"
          sub={data.posts.length ? "Try clearing a filter." : "Be the first to post a skill."}
          action={
            <button className="btn btn-soft" onClick={() => setModal(true)}>
              <Icon name="plus" /> Post a skill
            </button>
          }
        />
      ) : (
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
        >
          {filtered.map((p) => (
            <PostCard key={p.id} post={p} onRemove={store.removePost} />
          ))}
        </div>
      )}

      {modal && <PostForm onClose={() => setModal(false)} onSave={store.addPost} />}
    </div>
  );
}
