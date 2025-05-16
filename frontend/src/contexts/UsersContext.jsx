// ActiveUsersContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from "../services/axiosInstance";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {

  const [activeUsers, setActiveUsers] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
      if (!token) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("response.data",response.data);
        
        setActiveUsers(response.data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <UsersContext.Provider value={{ activeUsers, setActiveUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useActiveUsers = () => useContext(UsersContext);
