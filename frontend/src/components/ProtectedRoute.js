import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const userEmail = localStorage.getItem("userEmail");

  if (!userEmail) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
