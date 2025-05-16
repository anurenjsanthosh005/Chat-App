import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ErrorPage from "../pages/ErrorPage";
import AdminPanel from "../pages/AdminPanel";
import Dashboard from "../pages/Dashboard";

import ProtectedRoutes from "./ProtectedRoutes";
import RoleRoutes from "./RoleRoutes";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/page-not-found" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/page-not-found" element={<ErrorPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <Dashboard />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/admin-pannel"
        element={
          <RoleRoutes allowedRole="admin">
            <AdminPanel />
          </RoleRoutes>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
