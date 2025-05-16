import React from "react";
import { useActiveUsers } from "../contexts/UsersContext";

function UserList() {
  const { activeUsers, setActiveUsers } = useActiveUsers();
  const handleDelete = (user) => {
    console.log("delete button clicked", user.id);

    const updatedUserList = activeUsers.filter((u) => u.id !== user.id);
    setActiveUsers(updatedUserList);
  };
  return (
    <div>
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
                <div>{user.email}</div>
                <div>{user.role}</div>
                {/* <div>
                  <button>profile</button>
                </div> */}
                <div>
                  <button onClick={() => handleDelete(user)}>delete</button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default UserList;
