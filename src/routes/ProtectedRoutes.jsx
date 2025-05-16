import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to={"/page-not-found"} />;
}   

export default ProtectedRoutes;
