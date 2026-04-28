import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SideNav.css";

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { icon: "🏠", label: "Home",          path: "/home" },
    ]
  },
  {
    label: "Study",
    items: [
      { icon: "🏥", label: "NEET Syllabus",  path: "/neet" },
      { icon: "⚗️",  label: "JEE Books",    path: "/jee" },
    ]
  },
  {
    label: "Practice",
    items: [
      { icon: "📝", label: "Mock Tests",     path: "/mock-tests" },
      { icon: "🗂️", label: "Flashcards",    path: "/flashcards" },
      { icon: "🎯", label: "Study Planner",  path: "/study-planner" },
    ]
  },
  {
    label: "Insights",
    items: [
      { icon: "📊", label: "Analytics",      path: "/analytics" },
      { icon: "📈", label: "Progress",       path: "/progress" },
    ]
  }
];

export default function SideNav({ userName, onLogout, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`sidenav ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidenav-logo">
        <div className="sidenav-logo-icon">📚</div>
        {!collapsed && <span className="sidenav-logo-text">VIDYA</span>}
      </div>

      {/* Collapse toggle */}
      <button className="sidenav-toggle" onClick={() => setCollapsed(c => !c)}>
        {collapsed ? "›" : "‹"}
      </button>

      {/* Nav items */}
      <nav className="sidenav-nav">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="sidenav-section">
            {!collapsed && <div className="sidenav-section-label">{section.label}</div>}
            {section.items.map(item => (
              <button
                key={item.path}
                className={`sidenav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : ""}
              >
                <span className="sidenav-item-icon">{item.icon}</span>
                {!collapsed && <span className="sidenav-item-label">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidenav-footer">
        <div className="sidenav-user">
          <div className="sidenav-avatar">{userName?.[0]?.toUpperCase() || "S"}</div>
          {!collapsed && (
            <div className="sidenav-user-info">
              <div className="sidenav-user-name">{userName}</div>
              <div className="sidenav-user-role">Student</div>
            </div>
          )}
        </div>
        <button className="sidenav-logout" onClick={onLogout} title="Sign Out">
          {collapsed ? "⏻" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}