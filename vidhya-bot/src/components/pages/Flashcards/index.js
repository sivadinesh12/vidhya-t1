import React, { useState } from "react";
import PageLayout from "../../Layout/PageLayout";
import "../page.css";

const DECKS = [
  { icon:"🧬", title:"Cell Biology",        count:84,  subject:"Biology XI",   color:"#1e8449", bg:"#d5f5e3",
    cards:[
      { q:"What is the powerhouse of the cell?", a:"Mitochondria — produces ATP via cellular respiration." },
      { q:"Which organelle is called the 'suicidal bag'?", a:"Lysosome — contains digestive enzymes that can break down the cell." },
      { q:"What is the function of the Golgi apparatus?", a:"Modifies, packages and ships proteins to their destination inside or outside the cell." },
      { q:"Define osmosis.", a:"Movement of water molecules from a region of high water potential to low water potential through a semi-permeable membrane." },
    ]
  },
  { icon:"⚛️", title:"Thermodynamics",      count:56,  subject:"Physics XI",   color:"#1a5276", bg:"#d6eaf8",
    cards:[
      { q:"State the First Law of Thermodynamics.", a:"Energy can neither be created nor destroyed — it can only be converted from one form to another. ΔU = Q − W." },
      { q:"What is an adiabatic process?", a:"A process in which no heat is exchanged between the system and its surroundings (Q = 0)." },
      { q:"Define entropy.", a:"A measure of the degree of disorder or randomness in a system. Entropy of an isolated system always increases." },
    ]
  },
  { icon:"🧪", title:"Organic Reactions",   count:120, subject:"Chemistry XII", color:"#7d3c98", bg:"#e8daef",
    cards:[
      { q:"What is Markovnikov's rule?", a:"In addition reactions of HX to an asymmetric alkene, the H adds to the carbon with more hydrogens (more substituted carbon gets X)." },
      { q:"Define SN2 reaction.", a:"A bimolecular nucleophilic substitution — the nucleophile attacks from the back while the leaving group departs, causing inversion of configuration." },
      { q:"What is an electrophile?", a:"An electron-deficient species that accepts an electron pair from a nucleophile. Examples: H⁺, Br₂, AlCl₃." },
    ]
  },
  { icon:"🐾", title:"Human Physiology",    count:98,  subject:"Biology XII",  color:"#c9922a", bg:"#fdebd0",
    cards:[
      { q:"What is the function of haemoglobin?", a:"Transports oxygen from the lungs to body tissues and carries CO₂ back to the lungs for exhalation." },
      { q:"Where does digestion of proteins begin?", a:"In the stomach — pepsin (activated from pepsinogen by HCl) begins protein digestion." },
      { q:"What is the role of the nephron?", a:"The nephron is the functional unit of the kidney that filters blood, reabsorbs useful substances, and excretes waste as urine." },
    ]
  },
  { icon:"📐", title:"Calculus Formulas",   count:64,  subject:"Maths XII",    color:"#c0392b", bg:"#fadbd8",
    cards:[
      { q:"What is the derivative of sin(x)?", a:"cos(x)" },
      { q:"State the product rule of differentiation.", a:"If y = u·v, then dy/dx = u·(dv/dx) + v·(du/dx)" },
      { q:"What is ∫eˣ dx?", a:"eˣ + C" },
    ]
  },
  { icon:"⚗️", title:"Periodic Table Facts",count:72,  subject:"Chemistry XI", color:"#7d3c98", bg:"#e8daef",
    cards:[
      { q:"Which element has the highest electronegativity?", a:"Fluorine (F) — electronegativity 4.0 on the Pauling scale." },
      { q:"What is the most abundant element in the Earth's crust?", a:"Oxygen (O) — makes up about 46% of the Earth's crust by mass." },
      { q:"Which group elements are called noble gases?", a:"Group 18 (He, Ne, Ar, Kr, Xe, Rn) — they have completely filled outer shells and are chemically inert." },
    ]
  },
];

function DeckStudy({ deck, onBack }) {
  const [idx,    setIdx]    = useState(0);
  const [flip,   setFlip]   = useState(false);
  const [known,  setKnown]  = useState([]);
  const [review, setReview] = useState([]);

  const card  = deck.cards[idx];
  const total = deck.cards.length;
  const done  = known.length + review.length;

  const mark = (status) => {
    if (status === "known") setKnown(k => [...k, idx]);
    else setReview(r => [...r, idx]);
    setFlip(false);
    setTimeout(() => setIdx(i => i + 1), 200);
  };

  if (idx >= total) {
    return (
      <div style={{ maxWidth:480, margin:"80px auto", padding:32, background:"white", borderRadius:24, boxShadow:"0 12px 40px rgba(0,0,0,0.1)", textAlign:"center" }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:10 }}>Deck Complete!</h2>
        <p style={{ color:"var(--muted)", marginBottom:24 }}>
          ✅ {known.length} known &nbsp;·&nbsp; 🔄 {review.length} need review
        </p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="btn-primary" onClick={() => { setIdx(0); setKnown([]); setReview([]); }}>
            Restart Deck
          </button>
          <button className="btn-outline" onClick={onBack}>← All Decks</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:600, margin:"40px auto", padding:"0 24px" }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <button className="btn-outline" style={{ fontSize:13, padding:"7px 14px" }} onClick={onBack}>← Back</button>
        <div style={{ fontSize:13, color:"var(--muted)", fontWeight:600 }}>
          {idx + 1} / {total} &nbsp;·&nbsp; ✅ {known.length} &nbsp;🔄 {review.length}
        </div>
      </div>

      {/* Progress */}
      <div style={{ height:6, background:"var(--cream)", borderRadius:10, overflow:"hidden", marginBottom:28 }}>
        <div style={{ width:`${(done/total)*100}%`, height:"100%", background:deck.color, borderRadius:10, transition:"width 0.4s" }} />
      </div>

      {/* Card */}
      <div onClick={() => setFlip(f => !f)} style={{
        minHeight:220, background: flip ? "var(--ink)" : "white",
        border:`2px solid ${flip ? deck.color : "var(--border)"}`,
        borderRadius:20, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"36px 40px", cursor:"pointer",
        transition:"all 0.3s", boxShadow:"0 8px 32px rgba(0,0,0,0.09)",
        textAlign:"center", userSelect:"none", marginBottom:24,
      }}>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:"1px", textTransform:"uppercase",
          color: flip ? deck.color : "var(--muted)", marginBottom:16 }}>
          {flip ? "ANSWER — tap to go back" : "QUESTION — tap to reveal"}
        </div>
        <div style={{ fontSize:18, fontWeight:600, color: flip ? "white" : "var(--ink)", lineHeight:1.55 }}>
          {flip ? card.a : card.q}
        </div>
      </div>

      {/* Action buttons */}
      {flip && (
        <div style={{ display:"flex", gap:14 }}>
          <button onClick={() => mark("review")} style={{
            flex:1, padding:"14px", borderRadius:12, border:"2px solid #c0392b",
            background:"#fadbd8", color:"#c0392b", fontWeight:700, fontSize:14,
            cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          }}>🔄 Need Review</button>
          <button onClick={() => mark("known")} style={{
            flex:1, padding:"14px", borderRadius:12, border:"2px solid #1e8449",
            background:"#d5f5e3", color:"#1e8449", fontWeight:700, fontSize:14,
            cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          }}>✅ Got It!</button>
        </div>
      )}
      {!flip && (
        <div style={{ textAlign:"center", color:"var(--muted)", fontSize:13 }}>
          Tap the card to reveal the answer
        </div>
      )}
    </div>
  );
}

export default function Flashcards({ userName }) {
  const [activeDeck, setActiveDeck] = useState(null);

  if (activeDeck) {
    return (
      <PageLayout userName={userName}>
        <div className="page-wrap">
          <DeckStudy deck={activeDeck} onBack={() => setActiveDeck(null)} />
        </div>
      </PageLayout>
    );
  }

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

        <h2 className="page-section-title">All <span>Decks</span></h2>
        <div className="card-grid">
          {DECKS.map((d, i) => (
            <div key={i} className="info-card" onClick={() => setActiveDeck(d)}>
              <div style={{ width:48,height:48,borderRadius:12,background:d.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14 }}>{d.icon}</div>
              <div className="info-card-title">{d.title}</div>
              <div className="info-card-desc">{d.subject} · {d.count} cards</div>
              <button className="btn-primary" style={{ fontSize:12, padding:"8px 16px", background:d.color }}
                onClick={e => { e.stopPropagation(); setActiveDeck(d); }}>
                Study Deck →
              </button>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
