import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

// Protect routes for authenticated users only
const ProtectedRoute = ({ children }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

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
  const { authUser, isCheckingAuth } = useAuthStore();

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
