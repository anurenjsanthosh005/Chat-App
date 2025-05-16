import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoutes({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    // Show nothing or a loading spinner while checking auth state
    return <></>;
  }

  return token ? children : <Navigate to={"/page-not-found"} />;
}

export default ProtectedRoutes;
