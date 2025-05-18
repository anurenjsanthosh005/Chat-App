// ActiveUsersContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from "../services/axiosInstance";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
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
        const users = response.data;
        setActiveUsers(users);

        const savedUserId = localStorage.getItem("selectedUserId");
        if (savedUserId) {
          const user = users.find((u) => u.id === Number(savedUserId));
          if (user) {
            setSelectedUser(user);
          }
        }
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchData();
  }, [token]);

  return (
    <UsersContext.Provider
      value={{ activeUsers, setActiveUsers, selectedUser, setSelectedUser }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useActiveUsers = () => useContext(UsersContext);
