import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoutes({ children }) {
    const {token} = useAuth()
//   const token = localStorage.getItem("token");
  return token ? children : <Navigate to={"/page-not-found"} />;
}   

export default ProtectedRoutes;
