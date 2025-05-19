import React, { useEffect, useState } from "react";
import { useActiveUsers } from "../contexts/UsersContext";
import { useAuth } from "../contexts/AuthContext";

function ChatList() {
  const { activeUsers, setSelectedUser, activeGroups, chatTab, setChatTab } =
    useActiveUsers();
  const { id, loading } = useAuth();
  const currentUserId = Number(id);

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    if (!activeUsers && !activeGroups) return;

    if (chatTab === "chats") {
      setListItems(
        activeUsers
          ? activeUsers.filter(
              (user) => user.role !== "admin" && user.id !== currentUserId
            )
          : []
      );
      localStorage.setItem("chatTab", chatTab);
    } else if (chatTab === "groups") {
      setListItems(activeGroups || []);
      localStorage.setItem("chatTab", chatTab);
    }
  }, [chatTab, activeUsers, activeGroups, currentUserId]);

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
        <button onClick={() => setChatTab("chats")}>chat list</button>
        <button onClick={() => setChatTab("groups")}>groups</button>
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
