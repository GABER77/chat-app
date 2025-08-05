import { Navigate } from "react-router-dom";
import { authStore } from "../stores/authStore";

// Protect routes for authenticated users only
export const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = authStore();

  if (isCheckingAuth) {
    // Show loading spinner
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Redirect if user is already authenticated (for login/signup pages)
export const RedirectIfAuth = ({ children }) => {
  const { authUser, isCheckingAuth } = authStore();

  if (isCheckingAuth) {
    // Show loading spinner
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};
