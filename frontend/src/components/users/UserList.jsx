import React, { useState } from "react";
import { useActiveUsers } from "../../contexts/UsersContext";
import UserDetails from "./UserDetails";

function UserList() {
  
  const { activeUsers } = useActiveUsers();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  if (!activeUsers || activeUsers.length === 0) {
    return <div>Users loading...</div>;
  }

  const handleView = (user) => {
    console.log("view button clicked", user.id);

    setSelectedUser(user);
    setModalOpen(true);
  };
  return (
    <div>
      <UserDetails
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
      />
      <h3>User List</h3>
      <div>
        {activeUsers
          .filter((user) => !(user.role === "admin"))
          .map((user) => {
            return (
              <div
                style={{
                  height: "15px",
                  padding: "5px",
                  display: "flex",
                  gap: "5px",
                  marginBottom: "5px",
                }}
                key={user.id}
              >
                {/* <div>{user.id}</div> */}
                <div>{user.name}</div>
                <div>{user.role}</div>
                {/* <div>
                  <button>profile</button>
                </div> */}
                <div>
                  <button onClick={() => handleView(user)}>view</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserList;
