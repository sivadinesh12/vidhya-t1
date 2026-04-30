import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "./App.css";

import Login from './components/Login';
import Signup from './components/signup';
import Home from "./components/Home";
import NEETSyllabus from "./components/pages/NEETSyllabus";
import JEEBooks   from "./components/pages/Jeebooks";
import MockTests   from "./components/pages/MockTests";
import Analytics   from "./components/pages/Analytics";
import Flashcards  from "./components/pages/Flashcards";
import StudyPlanner from "./components/pages/StudyPlanner";
import Progress    from "./components/pages/Progress";

const GOOGLE_CLIENT_ID =
  "803792661988-1mfd36s2pbpi5i54bb2hl9r167061cei.apps.googleusercontent.com";

export default function App() {
  const [user, setUser] = useState(null);
  const P = ({ el }) => user ? el : <Navigate to="/login" />;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/home"          element={<P el={<Home         userName={user} />} />} />
          <Route path="/neet"          element={<P el={<NEETSyllabus userName={user} />} />} />
          <Route path="/jee"           element={<P el={<JEEBooks     userName={user} />} />} />
          <Route path="/mock-tests"    element={<P el={<MockTests    userName={user} />} />} />
          <Route path="/analytics"     element={<P el={<Analytics    userName={user} />} />} />
          <Route path="/flashcards"    element={<P el={<Flashcards   userName={user} />} />} />
          <Route path="/study-planner" element={<P el={<StudyPlanner userName={user} />} />} />
          <Route path="/progress"      element={<P el={<Progress     userName={user} />} />} />
          <Route path="/login"         element={<Login onLogin={setUser} />} />
          <Route path="/signup"        element={<Signup onLogin={setUser} />} />
          <Route path="*"              element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}