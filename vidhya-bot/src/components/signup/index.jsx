import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom"; 
import vidyaLogo from "../assets/logo.png"; // Imported the logo
import "./index.css"; 

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState(""); 
  const [educationLevel, setEducationLevel] = useState(""); 
  
  // New states for conditional dropdowns
  const [schoolClass, setSchoolClass] = useState("");
  const [schoolBoard, setSchoolBoard] = useState(""); // State for CBSE / TN State
  const [collegeDepartment, setCollegeDepartment] = useState("");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Handle main education level change to reset sub-selections
  const handleEducationChange = (e) => {
    setEducationLevel(e.target.value);
    setSchoolClass("");
    setSchoolBoard("");
    setCollegeDepartment("");
  };

  // --- STANDARD SIGNUP ---
  const handleSignup = (e) => {
    e.preventDefault();
    
    // Basic field validation
    if (!name || !email || !mobile || !password || !educationLevel) {
      setError("Please fill in all basic fields.");
      return;
    }

    // Conditional field validation
    if (educationLevel === "school") {
      if (!schoolClass) {
        setError("Please select your class.");
        return;
      }
      if (!schoolBoard) {
        setError("Please select your syllabus board.");
        return;
      }
    }
    
    if (educationLevel === "college" && !collegeDepartment) {
      setError("Please select your department category.");
      return;
    }

    // Basic 10-digit mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    // Logic to save user would go here.
    const signupData = { 
      name, 
      email, 
      mobile, 
      password, 
      educationLevel,
      // Only include sub-data if relevant
      ...(educationLevel === "school" && { schoolClass, schoolBoard }),
      ...(educationLevel === "college" && { collegeDepartment })
    };

    console.log("Signup Data:", signupData);
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
        {/* UPDATED LOGO SECTION */}
        <div className="brand-badge">
          <img 
            src={vidyaLogo} 
            alt="Vidhya Logo" 
            className="brand-logo-img" 
          />
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
              <label className="form-label">Mobile Number</label>
              <input 
                className="form-input" 
                type="tel" 
                placeholder="Enter 10-digit mobile number" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} 
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label className="form-label">What are you studying for?</label>
              <select 
                className="form-input" 
                value={educationLevel}
                onChange={handleEducationChange}
                style={{ cursor: "pointer", appearance: "auto" }} 
              >
                <option value="" disabled>Select an option</option>
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="neet">NEET</option>
                <option value="jee">JEE</option>
              </select>
            </div>

            {/* CONDITIONAL DROPDOWNS: SCHOOL */}
            {educationLevel === "school" && (
              <>
                <div className="form-group fade-up">
                  <label className="form-label">Select Syllabus</label>
                  <select 
                    className="form-input" 
                    value={schoolBoard}
                    onChange={(e) => setSchoolBoard(e.target.value)}
                    style={{ cursor: "pointer", appearance: "auto" }} 
                  >
                    <option value="" disabled>Choose your syllabus</option>
                    <option value="cbse">CBSE</option>
                    <option value="tn_state">TN State Syllabus</option>
                  </select>
                </div>

                <div className="form-group fade-up">
                  <label className="form-label">Select Class</label>
                  <select 
                    className="form-input" 
                    value={schoolClass}
                    onChange={(e) => setSchoolClass(e.target.value)}
                    style={{ cursor: "pointer", appearance: "auto" }} 
                  >
                    <option value="" disabled>Choose your class</option>
                    <option value="6th">6th Standard</option>
                    <option value="7th">7th Standard</option>
                    <option value="8th">8th Standard</option>
                    <option value="9th">9th Standard</option>
                    <option value="10th">10th Standard</option>
                    <option value="11th">11th Standard</option>
                    <option value="12th">12th Standard</option>
                  </select>
                </div>
              </>
            )}

            {/* CONDITIONAL DROPDOWN: COLLEGE */}
            {educationLevel === "college" && (
              <div className="form-group fade-up">
                <label className="form-label">Select Department Category</label>
                <select 
                  className="form-input" 
                  value={collegeDepartment}
                  onChange={(e) => setCollegeDepartment(e.target.value)}
                  style={{ cursor: "pointer", appearance: "auto" }} 
                >
                  <option value="" disabled>Choose your department</option>
                  <option value="engineering">Engineering / Technology</option>
                  <option value="arts_science">Arts & Science</option>
                  <option value="commerce">Commerce / Management</option>
                  <option value="medical">Medical / Health Sciences</option>
                  <option value="law">Law</option>
                </select>
              </div>
            )}

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
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            
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

          </div>

          <div className="signup-row">
            Already have an account? <a href="/">Sign In instead</a>
          </div>
        </div>
      </div>
    </div>
  );
}