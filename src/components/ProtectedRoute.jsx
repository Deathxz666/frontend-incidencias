import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const token = localStorage.getItem("token");

  if (!isAuthenticated || !token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
