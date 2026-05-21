import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNav from "./SideNav";
import "./PageLayout.css";

export default function PageLayout({ userName, onLogout, children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const onVidya   = location.pathname === "/vidya";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("vidhya_token");
      localStorage.removeItem("vidhya_user");
      navigate("/login");
    }
  };

  return (
    <div className="page-layout">
      <SideNav
        userName={userName}
        onLogout={handleLogout}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <div className={`page-content ${collapsed ? "collapsed" : ""}`}>
        {children}
      </div>

      {/* Hide FAB when already on VIDYA page */}
      {!onVidya && (
        <button
          className="vidya-fab"
          onClick={() => navigate("/vidya")}
          title="Open VIDYA AI"
        >
          <span className="vidya-fab-icon">🤖</span>
          <span className="vidya-fab-label">VIDYA AI</span>
        </button>
      )}
    </div>
  );
}
