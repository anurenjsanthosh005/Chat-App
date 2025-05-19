import React, { useState } from "react";
import { useActiveUsers } from "../../contexts/UsersContext";
import UserDetails from "./UserDetails";
import { Box, Button, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";


function UserList() {
  const { activeUsers, activeGroups } = useActiveUsers();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [view, setView] = useState("users"); // "users" or "groups"

  if (!activeUsers || activeUsers.length === 0) {
    return <div>Users loading...</div>;
  }

  const handleView = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#f5e8ea", height: "84.5vh" }}>
      <UserDetails
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
      />

      <Box style={{ marginBottom: "10px" }}>
        <Button
                    startIcon={<PersonIcon />}

          variant={view === "users" ? "contained" : "outlined"}
          sx={{
            mr: 1,
            bgcolor: view === "users" ? "#422328" : "transparent",
            color: view === "users" ? "white" : "#422328",
            "&:hover": {
              bgcolor: view === "users" ? "#422328" : "#d7c8cb",
            },
            borderColor: view === "users" ? "#422328" : "#422328",
          }}
          onClick={() => setView("users")}
          size="small"
        >
          Users
        </Button>
        <Button
            startIcon={<PeopleAltIcon />}

          variant={view === "groups" ? "contained" : "outlined"}
          sx={{
            mr: 1,
            bgcolor: view === "groups" ? "#422328" : "transparent",
            color: view === "groups" ? "white" : "#422328",
            "&:hover": {
              bgcolor: view === "groups" ? "#422328" : "#d7c8cb",
            },
            borderColor: view === "groups" ? "#422328" : "#422328",
          }}
          onClick={() => setView("groups")}
          size="small"
        >
          Groups
        </Button>
      </Box>

      {view === "users" && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "400px",
              marginLeft: 0,
            }}
          >
            {activeUsers
              .filter((user) => user.role !== "admin")
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleView(user)}
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#ee6b6b",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="#f0eaea">
                      Role : <span style={{ color: "black" }}>{user.role}</span>
                    </Typography>
                  </div>

                  <div style={{ flex: 1 }}></div>

                  <div>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(user);
                      }}
                      sx={{
                        backgroundColor: "#b34b5b",
                        color: "white",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#8a3d49",
                        },
                      }}
                      startIcon={<VisibilityIcon />}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {view === "groups" && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              maxWidth: "400px",
              marginLeft: 0,
            }}
          >
            {activeGroups
              .filter((user) => user.role !== "admin")
              .map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleView(user)}
                  style={{
                    padding: "12px",
                    marginBottom: "12px",
                    backgroundColor: "#ee6b6b",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="#f0eaea">
                      Type : <span style={{ color: "black" }}>{user.type}</span>
                    </Typography>
                  </div>

                  <div style={{ flex: 1 }}></div>

                  <div>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(user);
                      }}
                      sx={{
                        backgroundColor: "#b34b5b",
                        color: "white",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#8a3d49",
                        },
                      }}
                      startIcon={<VisibilityIcon />}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Box>
  );
}

export default UserList;
