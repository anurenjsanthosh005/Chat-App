import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RoleRoutes({ children, allowedRole }) {
  const { token, role, loading } = useAuth();
  // const token = localStorage.getItem('token')

  if (loading) {
    // Show nothing or a loading spinner while checking auth state
    return <></>;
  }

  if (!token || role !== allowedRole) {
    return <Navigate to="/page-not-found" />;
  }

  return children;
}

export default RoleRoutes;
