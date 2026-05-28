
// src/components/Auth/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, roles }) {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/signin" replace />;

  if (roles && !roles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
