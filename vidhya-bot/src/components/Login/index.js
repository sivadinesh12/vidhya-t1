import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./index.css";

const API_URL = "http://localhost:5000/api/v1";

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password)     { setError("Please enter your credentials."); return; }
    if (!emailRegex.test(email)) { setError("Please enter a valid email."); return; }
    if (password.length < 4)     { setError("Password too short."); return; }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("vidhya_token", data.data.token);
        localStorage.setItem("vidhya_user", JSON.stringify(data.data.user));
        onLogin(data.data.user.name);
        navigate("/Home");
      } else {
        setError(data.detail || data.message || "Login failed. Check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is your Python server running?");
    } finally {
      setLoading(false);
    }
  };

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
        localStorage.setItem("vidhya_user", JSON.stringify(data.data.user));
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

  return (
    <div className="login-wrap">
      <div className="login-left">
        <div className="brand-badge">
          <div className="brand-badge-dot" />
          <span>Vidhya</span>
        </div>
        <h1 className="login-headline">
          Master Every<br />
          <em>Exam</em> with<br />
          Confidence.
        </h1>
      </div>

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

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Auth popup closed or failed.")}
              theme="outline"
              shape="rectangular"
            />
          </div>

          <div className="signup-row">
            New to Vidhya?{" "}
            <button
              onClick={() => navigate("/signup")}
              style={{ background: "none", border: "none", color: "blue", cursor: "pointer", padding: 0 }}
            >
              Create free account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}