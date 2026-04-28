import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { useNavigate } from "react-router-dom"; 
import "./index.css"; 

export default function Login({ onLogin }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
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

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => { onLogin("Google User"); navigate("/"); },
    onError: () => setError("Google Login failed."),
  });

  const handleAppleSuccess = (response) => { onLogin("Apple User"); navigate("/"); };

  return (
    <div className="login-wrap">
      {/* ... (Left section remains the same) ... */}
      <div className="login-left">
        <div className="brand-badge">
          <div className="brand-badge-dot" />
          <span>Vidhya</span>
        </div>
        <h1 className="login-headline">Master Every<br /><em>Exam</em> with<br />Confidence.</h1>
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

          {/* SOCIAL LOGINS WITH REAL LOGOS */}
          <div style={{ display: 'flex', gap: '12px' }}>
            
            {/* GOOGLE BUTTON */}
            <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => googleLogin()}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Google
            </button>

            {/* APPLE BUTTON */}
            <AppleSignin
              authOptions={{ clientId: 'com.yourdomain.vidhya', scope: 'email name', redirectURI: 'https://yourdomain.com/login', usePopup: true }}
              uiType="dark"
              onSuccess={handleAppleSuccess}
              render={(props) => (
                <button className="btn-secondary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} {...props}>
                  <svg width="18" height="18" viewBox="0 0 384 512">
                    <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-14.7 0-51.4-22.2-83.9-22.4-43.9-.3-81.8 24.4-104.2 62.7-45 76.5-11.5 190.4 31.5 254.2 21 30.2 46.6 63.7 79.4 62.5 31.5-1.2 43.6-20.3 81.7-20.3 38 0 49 20.3 82.3 19.6 34.1-.7 56.4-30.2 77.2-60.6 24.2-35.1 33.9-69.2 34.3-70.9-1-.4-66.2-25.5-66.4-102.2zM260.5 51.7c16.1-20 26.9-47.8 24-75.7-23.9 1-52.7 16-69.9 36.4-15.5 18.2-29.1 46.4-25.3 73.3 26.5 2.1 53.6-14.1 71.2-34z"/>
                  </svg>
                  Apple
                </button>
              )}
            />
          </div>

          <div className="signup-row">
            New to Vidhya? <button onClick={() => navigate("/signup")}>Create free account</button>
          </div>
        </div>
      </div>
    </div>
  );
}