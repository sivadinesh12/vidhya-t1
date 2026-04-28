import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const TESTS = [
  { icon: "⚛️", title: "NEET Mock Test – Physics", sub: "90 min · Full Syllabus · 45 Questions", difficulty: "Hard", color: "#1a5276", bg: "#d6eaf8", attempts: 1240 },
  { icon: "🧪", title: "NEET Mock Test – Chemistry", sub: "60 min · Organic Focus · 35 Questions", difficulty: "Medium", color: "#7d3c98", bg: "#e8daef", attempts: 980 },
  { icon: "🧬", title: "NEET Mock Test – Biology", sub: "90 min · Full Syllabus · 90 Questions", difficulty: "Medium", color: "#1e8449", bg: "#d5f5e3", attempts: 1540 },
  { icon: "📋", title: "NEET Full Mock – Paper 1", sub: "3 hrs · 200 Questions · All Subjects", difficulty: "Hard", color: "#c0392b", bg: "#fadbd8", attempts: 2100 },
  { icon: "⚗️", title: "JEET Mock Test – Maths", sub: "60 min · Calculus + Algebra · 30 Questions", difficulty: "Hard", color: "#c9922a", bg: "#fdebd0", attempts: 760 },
  { icon: "📐", title: "JEET Mock Test – Physics", sub: "60 min · Mechanics · 30 Questions", difficulty: "Medium", color: "#1a5276", bg: "#d6eaf8", attempts: 820 },
];

const DIFF_COLOR = { Hard: { bg:"#fadbd8", c:"#c0392b" }, Medium: { bg:"#fdebd0", c:"#c9922a" }, Easy: { bg:"#d5f5e3", c:"#1e8449" } };

export default function MockTests({ userName }) {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? TESTS : TESTS.filter(t => t.difficulty === filter);

  return (
    <PageLayout userName={userName}>
      <div className="page-wrap">
        <div className="page-hero" style={{ background: "linear-gradient(135deg,#0d1b2a,#1a3a5c)" }}>
          <div className="page-hero-badge">📝 Practice Arena</div>
          <h1>Mock Tests</h1>
          <p>250+ timed tests designed to simulate real exam conditions for NEET and JEET. Track every attempt.</p>
          <div className="page-hero-meta">
            {[["250+","Tests"],["45K+","Attempts"],["98%","Accuracy"]].map(([n,l]) => (
              <div key={l} className="page-hero-stat">
                <div className="page-hero-stat-num">{n}</div>
                <div className="page-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:28 }}>
          {["All","Hard","Medium","Easy"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"7px 18px", borderRadius:20, border:"1.5px solid",
              borderColor: filter===f ? "var(--teal)" : "var(--border)",
              background: filter===f ? "var(--teal)" : "white",
              color: filter===f ? "white" : "var(--slate)",
              fontSize:13, fontWeight:600, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
            }}>{f}</button>
          ))}
        </div>

        <h2 className="page-section-title">Available <span>Tests</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
          {filtered.map((t, i) => (
            <div key={i} className="list-row">
              <div className="list-row-icon" style={{ background:t.bg }}>{t.icon}</div>
              <div style={{ flex:1 }}>
                <div className="list-row-title">{t.title}</div>
                <div className="list-row-sub">{t.sub} · {t.attempts.toLocaleString()} attempts</div>
              </div>
              <span style={{ padding:"4px 12px", borderRadius:20, fontSize:11, fontWeight:700, background:DIFF_COLOR[t.difficulty].bg, color:DIFF_COLOR[t.difficulty].c, marginRight:12 }}>{t.difficulty}</span>
              <button className="btn-primary" style={{ fontSize:12, padding:"8px 18px", background:t.color, flexShrink:0 }}>Start →</button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
