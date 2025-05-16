import React from "react";
import { useActiveUsers } from "../contexts/UsersContext";
import { useAuth } from "../contexts/AuthContext";

function ChatList() {
  const { activeUsers } = useActiveUsers();
  const { id } = useAuth();
  if (!activeUsers) {
    return <div>Loading chat users...</div>; // Or null
  }

  return (
    <div>
      {activeUsers
        .filter((user) => !(user.id === id) && !(user.role === "admin"))
        .map((user) => {
          return (
            <div
              style={{
                height: "15px",
                padding: "5px",
                display: "flex",
                margin: "5px",
                backgroundColor: "red",
              }}
              key={user.id}
            >
              <div>{user.email}</div>
            </div>
          );
        })}
    </div>
  );
}

export default ChatList;
