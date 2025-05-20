import React, { useEffect, useState } from "react";
import { useActiveUsers } from "../../contexts/UsersContext";
import { useAuth } from "../../contexts/AuthContext";
import { Box, Button, Typography } from "@mui/material";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GroupIcon from "@mui/icons-material/Group";

function ChatList() {
  const { activeUsers, setSelectedUser, activeGroups, chatTab, setChatTab } =
    useActiveUsers();
  const { id, loading } = useAuth();
  const currentUserId = Number(id);
  const [listItems, setListItems] = useState([]);

  var isMemberOfAnyGroup = activeGroups
    ? activeGroups.some((group) => group.members?.some((item)=>item.id === currentUserId))
    : false;  

  useEffect(() => {
    if (!activeUsers && !activeGroups) return;

    if (chatTab === "chats") {
      setListItems(
        activeUsers
          ? activeUsers.filter((user) => user.id !== currentUserId)
          : []
      );
      localStorage.setItem("chatTab", chatTab);
    } else if (chatTab === "groups") {
      setListItems(activeGroups || []);
      localStorage.setItem("chatTab", chatTab);
    }
  }, [chatTab, activeUsers, activeGroups, currentUserId]);

  if (loading || !activeUsers) {
    return <Typography>Loading chat users...</Typography>;
  }

  const handleSelect = (user) => {
    setSelectedUser(user);
    localStorage.setItem("selectedUserId", user.id);
  };

  return (
    <Box sx={{ p: 2, bgcolor: "transparent" }}>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          size="small"
          variant={chatTab === "chats" ? "contained" : "outlined"}
          sx={{
            mr: 1,
            bgcolor: chatTab === "chats" ? "#422328" : "transparent",
            color: chatTab === "chats" ? "white" : "#422328",
            "&:hover": {
              bgcolor: chatTab === "chats" ? "#422328" : "#d7c8cb",
            },
            borderColor: "#422328",
            padding: "4px 12px", // optional to make it even smaller
            fontSize: "0.8rem", // smaller font size
          }}
          onClick={() => setChatTab("chats")}
          startIcon={<ChatBubbleIcon fontSize="small" />}
        >
          Chat List
        </Button>
        {isMemberOfAnyGroup && (
          <Button
            size="small"
            variant={chatTab === "groups" ? "contained" : "outlined"}
            sx={{
              mr: 1,
              bgcolor: chatTab === "groups" ? "#422328" : "transparent",
              color: chatTab === "groups" ? "white" : "#422328",
              "&:hover": {
                bgcolor: chatTab === "groups" ? "#422328" : "#d7c8cb",
              },
              borderColor: "#422328",
              padding: "4px 12px", // optional to make it even smaller
              fontSize: "0.8rem", // smaller font size
            }}
            onClick={() => setChatTab("groups")}
            startIcon={<GroupIcon fontSize="small" />}
          >
            Groups
          </Button>
        )}
      </Box>

      {listItems.length === 0 ? (
        <Typography>No items to display.</Typography>
      ) : (
        listItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelect(item)}
            style={{
              padding: "5px",
              paddingLeft: "10px",
              marginBottom: "5px",
              backgroundColor: "#ee6b6b",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "95%",
            }}
          >
            <div style={{ flex: 1, color: "#520d0d" }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {item.name}
              </Typography>
            </div>
            <div
              style={{
                color: "#520d0d",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                paddingRight: "6px",
              }}
            >
              {chatTab === "groups" ? (
                <GroupIcon fontSize="small" />
              ) : (
                <ChatBubbleIcon fontSize="small" />
              )}
            </div>
          </div>
        ))
      )}
    </Box>
  );
}

export default ChatList;
