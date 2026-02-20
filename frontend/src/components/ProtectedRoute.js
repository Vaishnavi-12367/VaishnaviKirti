import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Simple synchronous check - much more reliable
  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");

  if (!userEmail || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
