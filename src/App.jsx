import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from  '../firebase/firebase';

import QuizPage from '../src/component/QuizPage';
import LandingPage from '../src/component/Landingpage';
import SignInPage from '../src/component/SignInPage';
import Profile from '../src/component/profile';
import Settings from '../src/component/settings';
import HomePage from '../src/component/HomePage';
import Notes_Page from '../src/component/Notes';
import Chapter from '../src/component/chapter';
import ThemesPage from '../src/component/ThemesPage';
import { useThemeStore } from '../src/store/useThemeStore';
import TestPage from '../src/component/testPage';
import Test from '../src/component/test';
import Analysis from '../src/component/Analysis';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

const App = () => {
  const { theme } = useThemeStore();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/themes" element={<ThemesPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Test"
          element={
            <ProtectedRoute user={user}>
              <TestPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes"
          element={
            <ProtectedRoute user={user}>
              <Notes_Page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:examType"
          element={
            <ProtectedRoute user={user}>
              <Chapter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:subject"
          element={
            <ProtectedRoute user={user}>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/testlink/:stream"
          element={
            <ProtectedRoute user={user}>
              <Test />
            </ProtectedRoute>
          }
        />
         <Route
          path="/analysis"
          element={
            <ProtectedRoute user={user}>
              <Analysis/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chap/:subject"
          element={
            <ProtectedRoute user={user}>
              <Chapter />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
