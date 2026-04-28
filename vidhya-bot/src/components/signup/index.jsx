import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import AppleSignin from "react-apple-signin-auth";
import { useNavigate } from "react-router-dom"; 
import "./index.css"; 

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // --- STANDARD SIGNUP ---
  const handleSignup = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    // Logic to save user would go here
    setError("");
    setIsSuccess(true);
    navigate("/home"); 
  };

  // --- GOOGLE SIGNUP HANDLER ---
  const googleSignup = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google Signup Success:", tokenResponse);
      // In a real app, send this token to your backend to create the user
      setError("");
      setIsSuccess(true);
    },
    onError: () => {
      console.error("Google Signup Failed");
      setError("Google Signup failed. Please try again.");
    },
  });

  // --- APPLE SIGNUP HANDLER ---
  const handleAppleSuccess = (response) => {
    console.log("Apple Signup Success:", response);
    // In a real app, send response.authorization.id_token to your backend
    setError("");
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="login-wrap" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className="login-card" style={{textAlign: 'center'}}>
          <h2>Welcome to the family! 🎉</h2>
          <p>Your account for <strong>vidya</strong> has been created. You can now close this tab and log in.</p>
          <button className="btn-primary" style={{marginTop: '20px'}} onClick={() => window.close()}>Close Tab</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrap">
      <div className="login-left">
        <div className="brand-badge">
          <div className="brand-badge-dot" />
          <span>vidya</span>
        </div>
        <h1 className="login-headline">Start Your<br /><em>Success</em><br />Story.</h1>
        <p className="login-sub">Join thousands of students and get access to curated study materials, mock tests, and analytics.</p>
      </div>

      <div className="login-right">
        <div className="login-card fade-up">
          <h2>Create Account ✨</h2>
          <p className="subtitle">Join vidya and start learning today.</p>

          {error && <div className="error-banner" style={{ background: "#fadbd8", border: "1px solid #f1948a", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#c0392b", fontSize: 13, fontWeight: 500 }}>{error}</div>}

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                className="form-input" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                className="form-input" 
                type="email" 
                placeholder="student@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Create Password</label>
              <input 
                className="form-input" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary">Create Free Account 🚀</button>
          </form>

          <div className="divider">or continue with</div>

          {/* Social Logins Container */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            
            {/* GOOGLE BUTTON */}
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => googleSignup()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </button>

            {/* APPLE BUTTON */}
            <AppleSignin
              authOptions={{
                clientId: 'com.yourdomain.vidhya', // REPLACE THIS with your Apple Service ID
                scope: 'email name',
                redirectURI: 'https://yourdomain.com/login', // Must match Apple config
                state: 'state',
                nonce: 'nonce',
                usePopup: true
              }}
              uiType="dark"
              className="apple-auth-btn"
              onSuccess={handleAppleSuccess}
              onError={(error) => console.error(error)}
              render={(props) => (
                <button type="button" className="btn-secondary" style={{ flex: 1 }} {...props}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 170" width="18" height="18">
                    <path fill="#000000" d="M117.89 65.59c-.58-15.65 12.8-23.41 13.38-23.78-7.29-10.66-18.66-12.16-22.7-12.35-9.68-.97-18.9 5.71-23.82 5.71-4.91 0-12.56-5.58-20.65-5.43-10.51.15-20.2 6.11-25.62 15.54-10.97 19.04-2.82 47.16 7.84 62.59 5.21 7.54 11.23 15.91 19.33 15.63 7.81-.29 10.74-5.04 20.21-5.04 9.44 0 12.15 5.04 20.29 4.89 8.35-.15 13.56-7.72 18.71-15.22 5.96-8.68 8.42-17.09 8.55-17.52-.18-.08-16.32-6.26-15.52-24.02z"/>
                    <path fill="#000000" d="M114.73 24.36c4.32-5.23 7.23-12.5 6.44-19.74-6.26.25-13.88 4.18-18.32 9.38-3.95 4.62-7.46 12.08-6.52 19.16 7.02.54 14.07-3.58 18.4-8.8z"/>
                  </svg>
                  Apple
                </button>
              )}
            />
          </div>

          <div className="signup-row">
            Already have an account? <a href="/">Sign In instead</a>
          </div>
        </div>
      </div>
    </div>
  );
}