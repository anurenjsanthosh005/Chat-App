import React, { useEffect, useState } from "react";
import { useActiveUsers } from "../contexts/UsersContext";
import { useAuth } from "../contexts/AuthContext";

function ChatList() {
  const { activeUsers, setSelectedUser,activeGroups  } = useActiveUsers();
  const { id, loading } = useAuth();
  const currentUserId = Number(id);
  const [activeTab, setActiveTab] = useState("chats");

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    if (!activeUsers && !activeGroups) return;

    if (activeTab === "chats") {
      setListItems(
        activeUsers
          ? activeUsers.filter(
              (user) => user.role !== "admin" && user.id !== currentUserId
            )
          : []
      );
    } else if (activeTab === "groups") {
      setListItems(activeGroups || []);
    }
  }, [activeTab, activeUsers, activeGroups, currentUserId]);

  // console.log('LOGGED IN USER IDDD :',id);
  // console.log("ACTIVE USERS", activeUsers);

  if (loading || !activeUsers) {
    return <div>Loading chat users...</div>; // Or null
  }

  const handleSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUserId", user.id);
  };

  return (
    <div>
      <div style={{ display: "flex", margin: "10px" }}>
        <button onClick={() => setActiveTab("chats")}>chat list</button>
        <button onClick={() => setActiveTab("groups")}>groups</button>
      </div>
      {listItems.map((item) => {
        return (
          <div
            style={{
              height: "15px",
              padding: "5px",
              display: "flex",
              margin: "5px",
              backgroundColor: "red",
              cursor: "pointer",
            }}
            onClick={() => handleSelect(item)}
            key={item.id}
          >
            <div>{item.name}</div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;
