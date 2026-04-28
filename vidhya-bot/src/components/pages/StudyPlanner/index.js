import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const TODAY_IDX = 0;

const WEEK_PLAN = [
  [
    { time:"9 AM",  name:"NEET Mock Test – Physics",  dur:"90 min", color:"#1a5276" },
    { time:"12 PM", name:"NCERT Biology – Genetics",   dur:"60 min", color:"#1e8449" },
    { time:"6 PM",  name:"Doubt Clearing – Mechanics", dur:"45 min", color:"#c9922a" },
  ],
  [
    { time:"10 AM", name:"Chemistry – Organic",        dur:"90 min", color:"#7d3c98" },
    { time:"3 PM",  name:"JEET Practice Paper #8",     dur:"60 min", color:"#c0392b" },
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
  const [activeDay, setActiveDay] = useState(TODAY_IDX);

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

        {/* Day Tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:32, overflowX:"auto", paddingBottom:4 }}>
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
              {i===TODAY_IDX && <span style={{ display:"block", fontSize:10, fontWeight:500, opacity:0.8 }}>Today</span>}
            </button>
          ))}
        </div>

        <h2 className="page-section-title">{DAYS[activeDay]}'s <span>Plan</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
          {WEEK_PLAN[activeDay].map((s, i) => (
            <div key={i} style={{
              display:"flex", gap:16, alignItems:"flex-start",
              padding:"20px 24px",
              background:"white",
              border:"1.5px solid var(--border)",
              borderRadius:16,
              borderLeft:`4px solid ${s.color}`,
            }}>
              <div style={{ textAlign:"center", minWidth:54 }}>
                <div style={{ fontWeight:700, fontSize:13, color:s.color }}>{s.time}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{s.dur}</div>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:15, color:"var(--ink)" }}>{s.name}</div>
              </div>
              <button className="btn-outline" style={{ fontSize:12, padding:"6px 14px", flexShrink:0 }}>Done ✓</button>
            </div>
          ))}
        </div>

        <div style={{ background:"var(--cream)", border:"1.5px solid var(--border)", borderRadius:16, padding:"24px 28px", display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ fontSize:32 }}>💡</div>
          <div>
            <div style={{ fontWeight:700, fontSize:15, color:"var(--ink)", marginBottom:4 }}>Tip of the Day</div>
            <div style={{ fontSize:13, color:"var(--slate)" }}>Review your weakest chapter for just 20 minutes before bed — spaced repetition boosts long-term memory by up to 40%.</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
