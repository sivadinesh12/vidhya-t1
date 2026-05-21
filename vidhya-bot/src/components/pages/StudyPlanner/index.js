import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const INITIAL_PLAN = [
  [
    { time:"9 AM",  name:"NEET Mock Test – Physics",  dur:"90 min", color:"#1a5276" },
    { time:"12 PM", name:"NCERT Biology – Genetics",   dur:"60 min", color:"#1e8449" },
    { time:"6 PM",  name:"Doubt Clearing – Mechanics", dur:"45 min", color:"#c9922a" },
  ],
  [
    { time:"10 AM", name:"Chemistry – Organic",        dur:"90 min", color:"#7d3c98" },
    { time:"3 PM",  name:"JEE Practice Paper #8",      dur:"60 min", color:"#c0392b" },
  ],
  [
    { time:"9 AM",  name:"Physics – Thermodynamics",   dur:"60 min", color:"#1a5276" },
    { time:"2 PM",  name:"Flashcard Revision – Bio",   dur:"30 min", color:"#1e8449" },
    { time:"5 PM",  name:"NCERT Chemistry – Bonding",  dur:"75 min", color:"#7d3c98" },
  ],
  [{ time:"11 AM", name:"Full Mock Test – NEET",       dur:"3 hrs",  color:"#c0392b" }],
  [
    { time:"9 AM",  name:"Maths – Calculus",           dur:"90 min", color:"#c9922a" },
    { time:"3 PM",  name:"PYQ Analysis – 2023",        dur:"60 min", color:"#1a5276" },
  ],
  [
    { time:"10 AM", name:"Revision – Weak Chapters",   dur:"2 hrs",  color:"#c0392b" },
    { time:"4 PM",  name:"Group Study Session",         dur:"90 min", color:"#1e8449" },
  ],
  [{ time:"All Day", name:"Rest & Light Reading",      dur:"—",      color:"#8a9bb0" }],
];

export default function StudyPlanner({ userName }) {
  const [activeDay, setActiveDay] = useState(0);
  // Track done status: { "dayIdx-itemIdx": bool }
  const [doneMap, setDoneMap] = useState({});

  const toggle = (dayIdx, itemIdx) => {
    const key = `${dayIdx}-${itemIdx}`;
    setDoneMap(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const dayDone = INITIAL_PLAN[activeDay].filter((_, i) => doneMap[`${activeDay}-${i}`]).length;
  const dayTotal = INITIAL_PLAN[activeDay].length;
  const pct = Math.round((dayDone / dayTotal) * 100);

  return (
    <PageLayout userName={userName}>
      <div className="page-wrap">
        <div className="page-hero" style={{ background:"linear-gradient(135deg,#2a1a0d,#c9922a)" }}>
          <div className="page-hero-badge">🎯 Study Planner</div>
          <h1>Your Schedule</h1>
          <p>A custom weekly study plan built around your goals. Stay consistent, stay ahead.</p>
          <div className="page-hero-meta">
            {[["6","Study Days"],["8.5 hrs","Daily Avg"],["92%","Adherence"]].map(([n,l]) => (
              <div key={l} className="page-hero-stat">
                <div className="page-hero-stat-num">{n}</div>
                <div className="page-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:24, overflowX:"auto", paddingBottom:4 }}>
          {DAYS.map((d, i) => (
            <button key={d} onClick={() => setActiveDay(i)} style={{
              padding:"10px 20px", borderRadius:12, border:"1.5px solid",
              borderColor: activeDay===i ? "var(--gold)" : "var(--border)",
              background: activeDay===i ? "var(--gold)" : "white",
              color: activeDay===i ? "white" : "var(--slate)",
              fontSize:14, fontWeight:700, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
              flexShrink:0,
              boxShadow: activeDay===i ? "0 4px 16px rgba(201,146,42,0.3)" : "none",
            }}>
              {d}
              {i === 0 && <span style={{ display:"block", fontSize:10, opacity:0.8 }}>Today</span>}
            </button>
          ))}
        </div>

        {/* Daily progress */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
          <div style={{ flex:1, height:8, background:"var(--cream)", borderRadius:10, overflow:"hidden" }}>
            <div style={{ width:`${pct}%`, height:"100%", background:"var(--gold)", borderRadius:10, transition:"width 0.4s" }} />
          </div>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--gold)", minWidth:60 }}>
            {dayDone}/{dayTotal} done
          </div>
        </div>

        <h2 className="page-section-title">{DAYS[activeDay]}'s <span>Plan</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
          {INITIAL_PLAN[activeDay].map((s, i) => {
            const isDone = !!doneMap[`${activeDay}-${i}`];
            return (
              <div key={i} style={{
                display:"flex", gap:16, alignItems:"center",
                padding:"18px 22px",
                background: isDone ? "#f0faf8" : "white",
                border:`1.5px solid ${isDone ? "#1e8449" : "var(--border)"}`,
                borderRadius:16,
                borderLeft:`4px solid ${isDone ? "#1e8449" : s.color}`,
                transition:"all 0.25s",
                opacity: isDone ? 0.8 : 1,
              }}>
                <div style={{ textAlign:"center", minWidth:54 }}>
                  <div style={{ fontWeight:700, fontSize:13, color: isDone ? "#1e8449" : s.color }}>{s.time}</div>
                  <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{s.dur}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:15, color:"var(--ink)",
                    textDecoration: isDone ? "line-through" : "none" }}>{s.name}</div>
                </div>
                <button
                  onClick={() => toggle(activeDay, i)}
                  style={{
                    padding:"8px 16px", borderRadius:10,
                    border: isDone ? "1.5px solid #1e8449" : "1.5px solid var(--border)",
                    background: isDone ? "#d5f5e3" : "white",
                    color: isDone ? "#1e8449" : "var(--slate)",
                    fontWeight:700, fontSize:12, cursor:"pointer",
                    fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
                    flexShrink:0,
                  }}
                >
                  {isDone ? "✓ Done" : "Mark Done"}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ background:"var(--cream)", border:"1.5px solid var(--border)", borderRadius:16, padding:"22px 26px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:32 }}>💡</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"var(--ink)", marginBottom:4 }}>Tip of the Day</div>
            <div style={{ fontSize:13, color:"var(--slate)" }}>
              Review your weakest chapter for just 20 minutes before bed — spaced repetition boosts long-term memory by up to 40%.
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
