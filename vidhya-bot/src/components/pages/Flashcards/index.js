import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const DECKS = [
  { icon:"🧬", title:"Cell Biology",         count:84,  subject:"Biology XI",   color:"#1e8449", bg:"#d5f5e3" },
  { icon:"⚛️", title:"Thermodynamics",       count:56,  subject:"Physics XI",   color:"#1a5276", bg:"#d6eaf8" },
  { icon:"🧪", title:"Organic Reactions",    count:120, subject:"Chemistry XII", color:"#7d3c98", bg:"#e8daef" },
  { icon:"🐾", title:"Human Physiology",     count:98,  subject:"Biology XII",  color:"#c9922a", bg:"#fdebd0" },
  { icon:"📐", title:"Calculus Formulas",    count:64,  subject:"Maths XII",    color:"#c0392b", bg:"#fadbd8" },
  { icon:"⚗️", title:"Periodic Table Facts", count:72,  subject:"Chemistry XI", color:"#7d3c98", bg:"#e8daef" },
];

const SAMPLE_CARDS = [
  { q: "What is the powerhouse of the cell?", a: "Mitochondria" },
  { q: "Define Boyle's Law", a: "At constant temperature, pressure × volume = constant (PV = k)" },
  { q: "What is the SI unit of Electric Charge?", a: "Coulomb (C)" },
];

export default function Flashcards({ userName }) {
  const [flip, setFlip] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const card = SAMPLE_CARDS[cardIdx];

  return (
    <PageLayout userName={userName}>
      <div className="page-wrap">
        <div className="page-hero" style={{ background:"linear-gradient(135deg,#2c1654,#7d3c98)" }}>
          <div className="page-hero-badge">🗂️ Smart Revision</div>
          <h1>Flashcards</h1>
          <p>Spaced-repetition flashcard decks for every chapter. Study less, remember more.</p>
          <div className="page-hero-meta">
            {[["4800+","Cards"],["52","Decks"],["94%","Retention"]].map(([n,l]) => (
              <div key={l} className="page-hero-stat">
                <div className="page-hero-stat-num">{n}</div>
                <div className="page-hero-stat-lbl">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive sample card */}
        <h2 className="page-section-title">Quick <span>Practice</span></h2>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:48 }}>
          <div
            onClick={() => setFlip(f => !f)}
            style={{
              width:"100%", maxWidth:500, minHeight:200,
              background: flip ? "var(--ink)" : "white",
              border:"2px solid var(--border)",
              borderRadius:20,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              padding:"36px 40px",
              cursor:"pointer",
              transition:"background 0.3s, color 0.3s",
              boxShadow:"0 8px 32px rgba(0,0,0,0.1)",
              textAlign:"center",
              userSelect:"none",
            }}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase", color: flip?"var(--gold-light)":"var(--muted)", marginBottom:16 }}>
              {flip ? "ANSWER" : "QUESTION — tap to reveal"}
            </div>
            <div style={{ fontSize:20, fontWeight:600, color: flip?"white":"var(--ink)", lineHeight:1.4 }}>
              {flip ? card.a : card.q}
            </div>
          </div>
          <div style={{ display:"flex", gap:12, marginTop:20 }}>
            <button className="btn-outline" onClick={() => { setCardIdx(i => (i-1+SAMPLE_CARDS.length)%SAMPLE_CARDS.length); setFlip(false); }}>← Prev</button>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              {SAMPLE_CARDS.map((_,i) => <div key={i} style={{ width:8,height:8,borderRadius:"50%",background:i===cardIdx?"var(--gold)":"var(--border)" }} />)}
            </div>
            <button className="btn-primary" onClick={() => { setCardIdx(i => (i+1)%SAMPLE_CARDS.length); setFlip(false); }}>Next →</button>
          </div>
        </div>

        <h2 className="page-section-title">All <span>Decks</span></h2>
        <div className="card-grid">
          {DECKS.map((d,i) => (
            <div key={i} className="info-card">
              <div style={{ width:48, height:48, borderRadius:12, background:d.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:14 }}>{d.icon}</div>
              <div className="info-card-title">{d.title}</div>
              <div className="info-card-desc">{d.subject} · {d.count} cards</div>
              <button className="btn-primary" style={{ fontSize:12, padding:"8px 16px", background:d.color }}>Study Deck →</button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
