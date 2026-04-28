import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import VIDYAPage from "../pages/VIDYA";
import "./PageLayout.css";

export default function PageLayout({ userName, children, hideVidyaFab = false }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [vidyaOpen, setVidyaOpen] = useState(false);
  const onLogout = () => navigate('/login');

  return (
    <div className="page-layout">
      <SideNav
        userName={userName}
        onLogout={onLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`page-content ${collapsed ? "collapsed" : ""}`}>
        {children}
      </div>

      {/* Floating VIDYA AI Button */}
      {!vidyaOpen && !hideVidyaFab && (
        <button
          className="vidya-fab"
          onClick={() => setVidyaOpen(true)}
          title="Open VIDYA AI"
          aria-label="Open VIDYA AI"
        >
          <span className="vidya-fab-icon">🤖</span>
          <span className="vidya-fab-label">VIDYA AI</span>
        </button>
      )}

      {/* VIDYA AI Fullscreen Overlay */}
      {vidyaOpen && (
        <>
          <div className="vidya-overlay-backdrop" onClick={() => setVidyaOpen(false)} />
          <div className="vidya-drawer">
            <button
              className="vidya-close-btn"
              onClick={() => setVidyaOpen(false)}
              title="Close VIDYA AI"
              aria-label="Close VIDYA AI"
            >
              ✕
            </button>
            <VIDYAPage userName={userName} isFloating hideVidyaFab />
          </div>
        </>
      )}
    </div>
  );
}