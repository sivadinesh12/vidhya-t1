import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import "./index.css";
=======
import { useNavigate } from "react-router-dom"; 
import vidyaLogo from "../assets/logo.png";
import "./index.css"; 
>>>>>>> d7ed6c73d9ed633f290074024346213cfcc914eb

const API_URL = "http://localhost:5000/api/v1";

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  // ── Email + Password Login ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password)        { setError("Please enter your credentials."); return; }
    if (!emailRegex.test(email))    { setError("Please enter a valid email."); return; }
    if (password.length < 4)        { setError("Password too short."); return; }

    setError("");
    setLoading(true);

<<<<<<< HEAD
=======
  // Function to send the Google token to your FastAPI backend
  const handleGoogleSuccess = async (credentialResponse) => {
>>>>>>> d7ed6c73d9ed633f290074024346213cfcc914eb
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save token to localStorage
        localStorage.setItem("vidhya_token", data.data.token);
        localStorage.setItem("vidhya_user",  JSON.stringify(data.data.user));
        onLogin(data.data.user.name);
        navigate("/Home");
      } else {
        setError(data.detail || data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is your Python server running?");
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // ── Google Login ───────────────────────────────────────────────────────────
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("vidhya_token", data.data.token);
        localStorage.setItem("vidhya_user",  JSON.stringify(data.data.user));
        onLogin(data.data.user.name);
        navigate("/Home");
      } else {
        setError(data.detail || data.message || "Google login failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is your Python server running?");
    } finally {
      setLoading(false);
    }
  };

  // ── Apple Login ────────────────────────────────────────────────────────────
  // Apple Sign In requires:
  // 1. An Apple Developer account ($99/year)
  // 2. A registered Service ID in Apple Developer Console
  // 3. A domain (not localhost) for the redirect URI
  // For now it shows a message explaining this.
  const handleAppleClick = () => {
    setError("Apple Sign In requires an Apple Developer account and a registered domain. Contact your admin to set it up.");
  };

  // ── Allow Enter key to submit ──────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="login-wrap">
      {/* Left section */}
=======
  return (
    <div className="login-wrap">
      
>>>>>>> d7ed6c73d9ed633f290074024346213cfcc914eb
      <div className="login-left">
        {/* UPDATED LOGO SECTION */}
        <div className="brand-badge">
          <img 
            src={vidyaLogo} // Uses the imported variable here
            alt="Vidhya Logo" 
            className="brand-logo-img" 
          />
        </div>
<<<<<<< HEAD
        <h1 className="login-headline">
          Master Every<br /><em>Exam</em> with<br />Confidence.
=======

        <h1 className="login-headline">
          Master Every<br />
          <span className="highlight-text">Exam</span> with<br />
          Confidence.
>>>>>>> d7ed6c73d9ed633f290074024346213cfcc914eb
        </h1>
      </div>

      {/* Right section */}
      <div className="login-right">
        <div className="login-card fade-up">
          <h2>Welcome back 👋</h2>
          <p>Sign in to continue your study journey.</p>

          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div className="divider">or continue with</div>

<<<<<<< HEAD
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {/* Google Login */}
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Auth popup closed or failed.")}
                theme="outline"
                shape="rectangular"
              />
            </div>

            {/* Apple Login - requires Apple Developer account */}
            <button
              className="btn-secondary"
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                height: "40px",
                cursor: "pointer",
              }}
              onClick={handleAppleClick}
            >
              <svg width="18" height="18" viewBox="0 0 384 512">
                <path
                  fill="currentColor"
                  d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-14.7 0-51.4-22.2-83.9-22.4-43.9-.3-81.8 24.4-104.2 62.7-45 76.5-11.5 190.4 31.5 254.2 21 30.2 46.6 63.7 79.4 62.5 31.5-1.2 43.6-20.3 81.7-20.3 38 0 49 20.3 82.3 19.6 34.1-.7 56.4-30.2 77.2-60.6 24.2-35.1 33.9-69.2 34.3-70.9-1-.4-66.2-25.5-66.4-102.2zM260.5 51.7c16.1-20 26.9-47.8 24-75.7-23.9 1-52.7 16-69.9 36.4-15.5 18.2-29.1 46.4-25.3 73.3 26.5 2.1 53.6-14.1 71.2-34z"
                />
              </svg>
              Apple
            </button>
          </div>

          <div className="signup-row">
            New to Vidhya?{" "}
            <button onClick={() => navigate("/signup")}>
              Create free account
            </button>
=======
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* GOOGLE BUTTON: Uses official component for JWT retrieval to send to backend */}
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => setError("Google Auth popup closed or failed.")} 
              theme="outline"
              shape="rectangular"
            />
          </div>

          <div className="signup-row">
            New to Vidhya? <button onClick={() => navigate("/signup")} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', padding: 0 }}>Create free account</button>
>>>>>>> d7ed6c73d9ed633f290074024346213cfcc914eb
          </div>
        </div>
      </div>
    </div>
  );
}