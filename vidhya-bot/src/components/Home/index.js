import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import "./index.css";

const CHAPTERS = [
  { name: "Cell: The Unit of Life", subject: "NCERT Biology XI", pct: 78, color: "#1e8449", bg: "#d5f5e3", icon: "🧬" },
  { name: "Thermodynamics", subject: "NCERT Physics XI", pct: 55, color: "#1a5276", bg: "#d6eaf8", icon: "⚛️" },
  { name: "Chemical Bonding", subject: "NCERT Chemistry XI", pct: 90, color: "#7d3c98", bg: "#e8daef", icon: "🧪" },
  { name: "Organic Chemistry", subject: "NCERT Chemistry XII", pct: 42, color: "#c0392b", bg: "#fadbd8", icon: "🔬" },
];

const SCHEDULE = [
  { time: "9 AM",  name: "NEET Mock Test – Physics",  detail: "90 min · Full Syllabus", color: "#1a5276" },
  { time: "12 PM", name: "NCERT Biology – Genetics",   detail: "Chapter 5 & 6 Revision", color: "#1e8449" },
  { time: "3 PM",  name: "JEE Practice Paper #7",     detail: "Chemistry · 60 min",     color: "#c0392b" },
  { time: "6 PM",  name: "Doubt Clearing Session",     detail: "Physics Mechanics",       color: "#c9922a" },
];

const QUICK = [
  { icon: "📝", title: "Mock Tests",    sub: "250+ tests available",  path: "/mock-tests",    color: "#d6eaf8" },
  { icon: "📊", title: "Analytics",    sub: "Track your progress",   path: "/analytics",     color: "#d5f5e3" },
  { icon: "🗂️", title: "Flashcards",  sub: "Smart revision",        path: "/flashcards",    color: "#e8daef" },
  { icon: "🎯", title: "Study Planner",sub: "Custom schedule",       path: "/study-planner", color: "#fdebd0" },
];

const FEATURES = [
  {
    cls: "ncert", icon: "🎓", tag: "CBSE · State Boards", title: "Board Exams",
    desc: "Complete Class XI & XII preparation with chapter-wise notes, past papers, and model question papers.",
    subjects: ["Physics", "Chemistry", "Biology", "Mathematics", "English"],
    meta: "Class XI & XII · All Boards", action: "Start Preparing", path: "/ncert",
  },
  {
    cls: "neet", icon: "🏥", tag: "Medical Entrance", title: "NEET Syllabus",
    desc: "Structured topic-wise syllabus as per NTA guidelines with weightage analysis and question trends.",
    subjects: ["Physics", "Chemistry", "Botany", "Zoology"],
    meta: "97 chapters · 1800+ topics", action: "View Syllabus", path: "/neet",
  },
  {
    cls: "jee", icon: "⚗️", tag: "Engineering Entrance", title: "JEET Books",
    desc: "Curated reference books and study material for JEE — concept builders and formula sheets.",
    subjects: ["H.C. Verma", "R.D. Sharma", "O.P. Tandon", "Cengage"],
    meta: "60+ books · 2000+ problems", action: "Browse Material", path: "/jeet",
  }
];

export default function Home({ userName }) {
  const navigate = useNavigate();

  return (
    <PageLayout userName={userName}>
      <div className="app">
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="hero-tag">✨ 2025–26 Session Active</div>
              <h1>Hello, <span>{userName}!</span><br />Ready to Study?</h1>
              <p>Your personalised dashboard is loaded. Continue where you left off or explore new chapters today.</p>
              <div className="hero-btns">
                <button className="hero-btn solid" onClick={() => navigate('/ncert')}>Start Preparing</button>
                <button className="hero-btn outline" onClick={() => navigate('/mock-tests')}>Take a Mock Test</button>
              </div>
            </div>
            <div className="hero-stats">
              {[["247", "Chapters Done"], ["89%", "Avg. Score"], ["18", "Day Streak"]].map(([n, l]) => (
                <div key={l} className="stat-card">
                  <div className="num">{n}</div>
                  <div className="lbl">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <main className="main">
          {/* Study Resources */}
          <div className="section-header">
            <h2 className="section-title">Study <span>Resources</span></h2>
            <button className="see-all" onClick={() => navigate('/ncert')}>View All →</button>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div key={f.cls} className={`feature-card ${f.cls} fade-up delay-${i + 1}`}>
                <div className="feature-card-header">
                  <span className="feature-card-icon">{f.icon}</span>
                  <div className="feature-card-tag">{f.tag}</div>
                  <div className="feature-card-title">{f.title}</div>
                  <p className="feature-card-desc">{f.desc}</p>
                </div>
                <div className="feature-card-body">
                  <div className="feature-card-subjects">
                    {f.subjects.map(s => <span key={s} className="subject-chip">{s}</span>)}
                  </div>
                  <div className="feature-card-footer">
                    <span className="card-meta">{f.meta}</span>
                    <button className="card-action" onClick={() => navigate(f.path)}>{f.action}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access */}
          <div className="section-header">
            <h2 className="section-title">Quick <span>Access</span></h2>
          </div>
          <div className="quick-grid">
            {QUICK.map(q => (
              <div key={q.title} className="quick-card fade-up" onClick={() => navigate(q.path)}>
                <div className="quick-icon">{q.icon}</div>
                <div>
                  <div className="quick-title">{q.title}</div>
                  <div className="quick-sub">{q.sub}</div>
                </div>
                <div className="quick-arrow">›</div>
              </div>
            ))}
          </div>

          {/* Progress + Schedule */}
          <div className="section-header">
            <h2 className="section-title">Your <span>Progress</span></h2>
            <button className="see-all" onClick={() => navigate('/progress')}>Full Report →</button>
          </div>
          <div className="progress-section">
            <div className="progress-card">
              <h3>Chapter Progress</h3>
              {CHAPTERS.map(c => (
                <div key={c.name} className="chapter-item">
                  <div className="chapter-icon" style={{ background: c.bg }}>{c.icon}</div>
                  <div className="chapter-info">
                    <div className="chapter-name">{c.name}</div>
                    <div className="chapter-sub">{c.subject}</div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${c.pct}%`, background: c.color }} />
                      </div>
                      <div className="progress-pct" style={{ color: c.color }}>{c.pct}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="progress-card">
              <h3>Today's Schedule</h3>
              <div className="schedule-list">
                {SCHEDULE.map(s => (
                  <div key={s.time} className="schedule-item">
                    <div className="schedule-dot" style={{ background: s.color }} />
                    <div style={{ flex: 1 }}>
                      <div className="schedule-time">{s.time}</div>
                      <div className="schedule-name">{s.name}</div>
                      <div className="schedule-detail">{s.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}