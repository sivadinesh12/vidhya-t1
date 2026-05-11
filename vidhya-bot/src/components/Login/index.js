import React, { useState } from "react";
// Import GoogleLogin instead of useGoogleLogin
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; 
import vidyaLogo from "../assets/logo.png";
import "./index.css"; 

export default function Login({ onLogin }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) { setError("Please enter your credentials."); return; }
    if (!emailRegex.test(email)) { setError("Please enter a valid email format."); return; }
    if (password.length < 4) { setError("Password too short."); return; }
    setError("");
    onLogin(email.split("@")[0] || "Student"); 
    navigate("/Home"); 
  };

  // Function to send the Google token to your FastAPI backend
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Make sure this matches the port your FastAPI server is running on (8000 or 5000)
      const response = await fetch("http://127.0.0.1:8000/api/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential, // The JWT token your backend needs
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // data.user.name comes directly from your Python backend!
        onLogin(data.user.name); 
        navigate("/Home");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Google Login failed on server.");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Is your Python server running?");
    }
  };

  return (
    <div className="login-wrap">
      
      <div className="login-left">
        {/* UPDATED LOGO SECTION */}
        <div className="brand-badge">
          <img 
            src={vidyaLogo} // Uses the imported variable here
            alt="Vidhya Logo" 
            className="brand-logo-img" 
          />
        </div>

        <h1 className="login-headline">
          Master Every<br />
          <span className="highlight-text">Exam</span> with<br />
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
              onChange={(e) => setEmail(e.target.value.replace(/[^a-zA-Z0-9@._-]/g, ""))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit}>Sign In →</button>

          <div className="divider">or continue with</div>

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
          </div>
        </div>
      </div>
    </div>
  );
}