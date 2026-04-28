import React from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const CHAPTERS = [
  { name:"Cell: The Unit of Life",  subject:"Biology XI",   pct:78, color:"#1e8449", bg:"#d5f5e3", icon:"🧬" },
  { name:"Thermodynamics",          subject:"Physics XI",   pct:55, color:"#1a5276", bg:"#d6eaf8", icon:"⚛️" },
  { name:"Chemical Bonding",        subject:"Chemistry XI", pct:90, color:"#7d3c98", bg:"#e8daef", icon:"🧪" },
  { name:"Organic Chemistry",       subject:"Chemistry XII",pct:42, color:"#c0392b", bg:"#fadbd8", icon:"🔬" },
  { name:"Human Physiology",        subject:"Biology XII",  pct:68, color:"#1e8449", bg:"#d5f5e3", icon:"🫀" },
  { name:"Electrostatics",          subject:"Physics XII",  pct:33, color:"#1a5276", bg:"#d6eaf8", icon:"⚡" },
  { name:"Calculus",                subject:"Maths XII",    pct:81, color:"#c9922a", bg:"#fdebd0", icon:"📐" },
  { name:"Genetics & Evolution",    subject:"Biology XII",  pct:95, color:"#1e8449", bg:"#d5f5e3", icon:"🧬" },
];

const MILESTONES = [
  { icon:"🏆", title:"First Mock Cleared",   date:"Feb 12",  done:true  },
  { icon:"🔥", title:"7-Day Streak",          date:"Mar 2",   done:true  },
  { icon:"⭐", title:"90%+ in Biology",       date:"Mar 18",  done:true  },
  { icon:"🎯", title:"Complete NEET Syllabus",date:"May 31",  done:false },
  { icon:"🏅", title:"100 Mock Tests",        date:"Jun 15",  done:false },
];

export default function Progress({ userName }) {
  const avgPct = Math.round(CHAPTERS.reduce((s, c) => s + c.pct, 0) / CHAPTERS.length);
  const done = CHAPTERS.filter(c => c.pct >= 80).length;

  return (
    <PageLayout userName={userName}>
      <div className="page-wrap">
        <div className="page-hero" style={{ background:"linear-gradient(135deg,#1a2a0d,#2e7d32)" }}>
          <div className="page-hero-badge">📈 Your Journey</div>
          <h1>Progress Report</h1>
          <p>A complete picture of your learning journey — chapters mastered, milestones reached, and what's next.</p>
          <div className="page-hero-meta">
            {[[`${avgPct}%`,"Avg Completion"],[`${done}/${CHAPTERS.length}`,"Chapters Mastered"],["18","Day Streak"]].map(([n,l]) => (
              <div key={l} className="page-hero-stat">
                <div className="page-hero-stat-num">{n}</div>
                <div className="page-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall ring */}
        <div style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:20, padding:"32px", marginBottom:36, display:"flex", alignItems:"center", gap:40 }}>
          <div style={{ position:"relative", width:120, height:120, flexShrink:0 }}>
            <svg viewBox="0 0 120 120" width="120" height="120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--cream)" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--teal)" strokeWidth="12"
                strokeDasharray={`${2*Math.PI*50 * avgPct/100} ${2*Math.PI*50 * (1-avgPct/100)}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:800, color:"var(--ink)" }}>{avgPct}%</div>
              <div style={{ fontSize:10, color:"var(--muted)", fontWeight:500 }}>Overall</div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:"var(--ink)", marginBottom:8 }}>Overall Progress</div>
            <div style={{ fontSize:14, color:"var(--slate)", lineHeight:1.7 }}>
              You've mastered <b>{done}</b> chapters and are on track to complete your NEET syllabus by <b>May 31</b>. Keep the streak alive! 🔥
            </div>
          </div>
        </div>

        {/* Chapter list */}
        <h2 className="page-section-title">Chapter <span>Breakdown</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
          {[...CHAPTERS].sort((a,b) => b.pct - a.pct).map(c => (
            <div key={c.name} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", background:"white", border:"1.5px solid var(--border)", borderRadius:14 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{c.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:14, color:"var(--ink)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>{c.subject}</div>
                <div style={{ height:6, background:"var(--cream)", borderRadius:10, overflow:"hidden" }}>
                  <div style={{ width:`${c.pct}%`, height:"100%", background:c.color, borderRadius:10, transition:"width 0.6s ease" }} />
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:16, color:c.color, minWidth:40, textAlign:"right" }}>{c.pct}%</div>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <h2 className="page-section-title">Milestones <span>& Goals</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:16, padding:"18px 22px", background: m.done ? "var(--cream)" : "white", border:"1.5px solid var(--border)", borderRadius:14, opacity: m.done ? 1 : 0.75 }}>
              <div style={{ fontSize:26 }}>{m.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:14, color:"var(--ink)", textDecoration: m.done ? "line-through" : "none" }}>{m.title}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{m.done ? `Achieved on ${m.date}` : `Target: ${m.date}`}</div>
              </div>
              <div style={{ padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:700, background: m.done ? "#d5f5e3" : "#fdebd0", color: m.done ? "#1e8449" : "#c9922a" }}>
                {m.done ? "✓ Done" : "Upcoming"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
