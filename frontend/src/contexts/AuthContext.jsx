import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [id, setId] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedName = localStorage.getItem("name");
    const savedId = localStorage.getItem("id");
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
      setName(savedName);
      setId(savedId);
    }
  }, []);

  const userLogin = ({ token, role, name, id }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("id", id);
    setToken(token);
    setRole(role);
    setName(name);
    setId(id);
  };

  const userLogout = () => {
    console.log('INSIDE USER LOGOUT');
    
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    setToken(null);
    setRole(null);
    setName("");
    setId(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, name,id, userLogin, userLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
