import React, { use } from "react";
import { useActiveUsers } from "../contexts/UsersContext";
import { useAuth } from "../contexts/AuthContext";

function ChatList() {
  const { activeUsers, setSelectedUser } = useActiveUsers();
  const { id ,loading } = useAuth();
  const currentUserId = Number(id)

  // console.log('LOGGED IN USER IDDD :',id);
  // console.log("ACTIVE USERS", activeUsers);

  
  if (loading  || !activeUsers) {
    return <div>Loading chat users...</div>; // Or null
  }

  const handleSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUserId", user.id);
  };

  return (
    <div>
      {activeUsers
        .filter((user) =>  user.role !== "admin" && user.id !== currentUserId )
        .map((user) => {
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
              onClick={() => handleSelect(user)}
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
