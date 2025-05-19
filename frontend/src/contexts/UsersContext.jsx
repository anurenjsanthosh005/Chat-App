// ActiveUsersContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axiosInstance from "../services/axiosInstance";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [activeUsers, setActiveUsers] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeGroups, setActiveGroups] = useState(null);
  const [chatTab, setChatTab] = useState("chat");
  const { token } = useAuth();

  useEffect(() => {
    const storedChatTab = localStorage.getItem("chatTab");
    setChatTab(storedChatTab);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const usersRes = await axiosInstance.get("/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const groupsRes = await axiosInstance.get("/groups/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = usersRes.data;
        const groups = groupsRes.data;

        setActiveUsers(users);
        setActiveGroups(groups);

        const savedUserId = localStorage.getItem("selectedUserId");
        const savedType = localStorage.getItem("chatTab");

        if (savedType === "chats") {
          const user = users.find((u) => u.id === Number(savedUserId));
          if (user) setSelectedUser(user);
        } else if (savedType === "groups") {
          const group = groups.find((g) => g.id === Number(savedUserId));
          if (group) setSelectedUser(group);
        }
      } catch (err) {
        console.error("Error fetching users or groups", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <UsersContext.Provider
      value={{
        activeUsers,
        setActiveUsers,
        selectedUser,
        setSelectedUser,
        activeGroups,
        setActiveGroups,
        chatTab,
        setChatTab,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const useActiveUsers = () => useContext(UsersContext);
