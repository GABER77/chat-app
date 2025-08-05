import Navbar from "./components/Navbar";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

import { Routes, Route } from "react-router-dom";
import { authStore } from "./stores/authStore";
import { useEffect } from "react";
import { ProtectedRoute, RedirectIfAuth } from "./components/RouteGuards";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth } = authStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  return (
    <div>
      <Navbar />

      <Routes>
        {/* Redirect for authenticated users */}

        <Route
          path="/signup"
          element={
            <RedirectIfAuth>
              <SignUpPage />
            </RedirectIfAuth>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <LoginPage />
            </RedirectIfAuth>
          }
        />

        {/* Protected Routes */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
