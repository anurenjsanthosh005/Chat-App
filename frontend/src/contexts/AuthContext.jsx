import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refreshToken");
    const savedRole = localStorage.getItem("role");
    const savedName = localStorage.getItem("name");
    const savedId = localStorage.getItem("id");
    if (savedToken && savedRefresh ) {
      setToken(savedToken);
      setRefresh(savedRefresh);
      setRole(savedRole);
      setName(savedName);
      setId(savedId);
    }
    setLoading(false);
  }, []);

  const userLogin = ({ token, refreshToken, role, name, id }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("id", id);

    setToken(token);
    setRefresh(refreshToken);
    setRole(role);
    setName(name);
    setId(id);
  };

  const userLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    localStorage.removeItem("selectedUser");
    localStorage.removeItem("selectedUserId");

    setToken(null);
    setRefresh(null);
    setRole(null);
    setName("");
    setId(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, refresh, role, name, id, userLogin, userLogout, loading  }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
