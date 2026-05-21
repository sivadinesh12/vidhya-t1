import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const SUBJECT_STATS = [
  { subject:"Physics",   score:72, tests:18, icon:"⚛️", color:"#1a5276", bg:"#d6eaf8" },
  { subject:"Chemistry", score:84, tests:14, icon:"🧪", color:"#7d3c98", bg:"#e8daef" },
  { subject:"Biology",   score:91, tests:22, icon:"🧬", color:"#1e8449", bg:"#d5f5e3" },
  { subject:"Maths",     score:65, tests:10, icon:"📐", color:"#c9922a", bg:"#fdebd0" },
];

const WEEKLY = [
  { day:"Mon", score:72 },
  { day:"Tue", score:85 },
  { day:"Wed", score:78 },
  { day:"Thu", score:91 },
  { day:"Fri", score:68 },
  { day:"Sat", score:88 },
  { day:"Sun", score:82 },
];

const RECENT = [
  { name:"NEET Full Mock #12",  date:"Apr 18", score:580, total:720, pct:80 },
  { name:"Physics – Mechanics", date:"Apr 16", score:68,  total:90,  pct:75 },
  { name:"Chemistry – Organic", date:"Apr 14", score:76,  total:90,  pct:84 },
  { name:"Biology – Genetics",  date:"Apr 12", score:85,  total:90,  pct:94 },
];

const INSIGHTS = [
  { icon:"🔥", title:"Best Streak",    value:"18 days", sub:"Keep it going!" },
  { icon:"⏱️", title:"Avg. Test Time", value:"74 min",  sub:"vs 90 min limit" },
  { icon:"🎯", title:"Accuracy",       value:"83%",     sub:"Top 12% of users" },
  { icon:"📈", title:"Improvement",    value:"+11%",    sub:"vs last month" },
];

const maxScore = Math.max(...WEEKLY.map(w => w.score));

export default function Analytics({ userName }) {
  const [hovered, setHovered] = useState(null);

  return (
    <PageLayout userName={userName}>
      <div className="page-wrap">
        <div className="page-hero" style={{ background:"linear-gradient(135deg,#0d2a1e,#1a7f74)" }}>
          <div className="page-hero-badge">📊 Your Insights</div>
          <h1>Analytics</h1>
          <p>Deep-dive into your performance. Understand your strengths, track weak areas, and study smarter.</p>
          <div className="page-hero-meta">
            {[["64","Tests Done"],["83%","Avg Score"],["18","Day Streak"]].map(([n,l]) => (
              <div key={l} className="page-hero-stat">
                <div className="page-hero-stat-num">{n}</div>
                <div className="page-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <h2 className="page-section-title">Key <span>Insights</span></h2>
        <div className="card-grid" style={{ marginBottom:40 }}>
          {INSIGHTS.map((ins,i) => (
            <div key={i} className="info-card" style={{ textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:10 }}>{ins.icon}</div>
              <div style={{ fontSize:28, fontFamily:"'Playfair Display',serif", fontWeight:800, color:"var(--ink)", marginBottom:4 }}>{ins.value}</div>
              <div style={{ fontWeight:600, fontSize:14, color:"var(--slate)", marginBottom:4 }}>{ins.title}</div>
              <div style={{ fontSize:12, color:"var(--muted)" }}>{ins.sub}</div>
            </div>
          ))}
        </div>

        {/* Weekly Score Chart */}
        <h2 className="page-section-title">Weekly <span>Performance</span></h2>
        <div style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:20, padding:"28px 32px", marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:160, marginBottom:16 }}>
            {WEEKLY.map((w, i) => {
              const barH = Math.round((w.score / maxScore) * 130);
              const isHov = hovered === i;
              return (
                <div key={w.day} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer" }}
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                  {isHov && (
                    <div style={{ fontSize:12, fontWeight:800, color:"var(--ink)", background:"var(--cream)",
                      border:"1px solid var(--border)", borderRadius:8, padding:"3px 8px", whiteSpace:"nowrap" }}>
                      {w.score}%
                    </div>
                  )}
                  <div style={{
                    width:"100%", height:barH,
                    background: isHov ? "var(--gold)" : "linear-gradient(180deg,var(--teal-light),var(--teal))",
                    borderRadius:"8px 8px 4px 4px",
                    transition:"all 0.25s ease",
                    boxShadow: isHov ? "0 4px 16px rgba(201,146,42,0.4)" : "none",
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:12 }}>
            {WEEKLY.map(w => (
              <div key={w.day} style={{ flex:1, textAlign:"center", fontSize:12, fontWeight:600, color:"var(--muted)" }}>
                {w.day}
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <h2 className="page-section-title">Subject <span>Performance</span></h2>
        <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:40 }}>
          {SUBJECT_STATS.map(s => (
            <div key={s.subject} style={{ background:"white", border:"1.5px solid var(--border)", borderRadius:16, padding:"20px 24px", display:"flex", alignItems:"center", gap:18 }}>
              <div style={{ width:46,height:46,borderRadius:12,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{s.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ fontWeight:700, fontSize:15, color:"var(--ink)" }}>{s.subject}</span>
                  <span style={{ fontWeight:700, fontSize:15, color:s.color }}>{s.score}%</span>
                </div>
                <div style={{ height:8, background:"var(--cream)", borderRadius:10, overflow:"hidden" }}>
                  <div style={{ width:`${s.score}%`, height:"100%", background:s.color, borderRadius:10, transition:"width 0.6s ease" }} />
                </div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:6 }}>{s.tests} tests attempted</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Tests */}
        <h2 className="page-section-title">Recent <span>Tests</span></h2>
        {RECENT.map((r,i) => (
          <div key={i} className="list-row">
            <div className="list-row-icon" style={{ background:"var(--cream)", fontSize:16 }}>📋</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="list-row-title">{r.name}</div>
              <div className="list-row-sub">{r.date} · Score: {r.score}/{r.total}</div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontWeight:800, fontSize:18, fontFamily:"'Playfair Display',serif", color: r.pct>=80?"#1e8449":r.pct>=60?"#c9922a":"#c0392b" }}>{r.pct}%</div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>{r.pct>=80?"Excellent":r.pct>=60?"Good":"Needs Work"}</div>
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
