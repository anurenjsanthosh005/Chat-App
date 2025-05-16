import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function NavBar() {
  const { name, role, userLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDashboard = location.pathname === "/dashboard";
  const isOnAdminPanel = location.pathname === "/admin-pannel";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "grey",
        height: "10vh",
        color: "white",
      }}
    >
      <div style={{}}>Init Chat</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <p>{name}</p>
        <button
          onClick={() => {
            userLogout();
            setTimeout(() => {
              navigate("/login");
            }, 0);
          }}
        >
          logout
        </button>
        {role === "admin" && isOnDashboard && (
          <button onClick={() => navigate("/admin-pannel")}>Admin Panel</button>
        )}
        {role === "admin" && isOnAdminPanel && (
          <button onClick={() => navigate("/dashboard")}>Chat</button>
        )}
      </div>
    </div>
  );
}

export default NavBar;
