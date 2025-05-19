import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useActiveUsers } from "../../contexts/UsersContext";
import axiosInstance from "../../services/axiosInstance";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  IconButton,
  Button,
  Paper,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import UserDetails from "../users/UserDetails";

function MainChat() {
  const { id } = useAuth();
  const currentUserId = Number(id);
  const { token } = useAuth();
  const { selectedUser } = useActiveUsers();

  const [messages, setMessages] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const watchMessage = watch("message");
  const MEDIA_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser || !token) return;

    setMessages([]);

    const wsUrl =
      selectedUser.type === "group"
        ? `ws://127.0.0.1:8000/ws/group-chat/?groupId=${selectedUser.id}&token=${token}`
        : `ws://127.0.0.1:8000/ws/chat/?receiverId=${selectedUser.id}&token=${token}`;

    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("RECIEVED MESSAGE :", data);

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, [selectedUser, token]);

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      if (selectedUser.type === "group") {
        formData.append("group_id", selectedUser.id);
      } else {
        formData.append("receiver_id", selectedUser.id);
      }

      const res = await axiosInstance.post("/upload-image/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data.content;
    } catch (err) {
      alert(
        "Image upload failed: " + (err.response?.data?.error || err.message)
      );
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setValue("message", "");
    e.target.value = "";
  };

  const onSubmit = async (data) => {
    if (!selectedUser) return;

    let content = data.message;
    let isImage = false;

    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return;
      content = imageUrl;
      isImage = true;
    }

    const newMessage =
      selectedUser.type === "group"
        ? {
            senderId: currentUserId,
            groupId: selectedUser.id,
            content,
            isImage,
            timestamp: new Date().toISOString(),
          }
        : {
            senderId: currentUserId,
            receiverId: selectedUser.id,
            content,
            isImage,
            timestamp: new Date().toISOString(),
          };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
    }

    reset();
    setImageFile(null);
  };

  const getImageSrc = (msg) => {
    if (msg.isImage) {
      return msg.content.startsWith("http")
        ? msg.content
        : `${MEDIA_BASE_URL}${msg.content}`;
    }
    return "";
  };
  const handleView = (user) => {
    setModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "yellow",
      }}
    >
      <UserDetails
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
      />
      <Box
        sx={{
          component: "header",
          display: "flex",
          alignItems: "center",
          px: "3%",
          width: "94%",
          height: "8vh",
          gap: "2",
          backgroundColor: "#dc3545",
        }}
      >
        {selectedUser?.type === "group" ? (
          <GroupIcon sx={{ color: "white" }} />
        ) : (
          <PersonIcon sx={{ color: "white" }} />
        )}
        <Typography
          variant="h6"
          noWrap
          sx={{ flexGrow: 1, color: "#f0e7e8", pl: 2, fontWeight: "600" }}
        >
          {selectedUser?.name || "Select a user"}
        </Typography>
        {selectedUser?.type === "group" ? (
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleView(selectedUser);
            }}
            sx={{
              backgroundColor: "#74212d",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#5a131e",
              },
            }}
          >
            Members
          </Button>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleView(selectedUser);
            }}
            sx={{
              backgroundColor: "#74212d",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#5a131e",
              },
            }}
          >
            Profile
          </Button>
        )}
      </Box>
      <Box
        flex={1}
        overflow="auto"
        p={2}
        bgcolor="#f0f0f0"
        display="flex"
        flexDirection="column"
        width="96.6%"
      >
        <Box mt="auto" display="flex" flexDirection="column" gap={2}>
          {messages.length === 0 ? (
            <Typography align="center" color="#888" mt={2}>
              Send messages to start a conversation
            </Typography>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              const isGroupChat = selectedUser?.type === "group";

              return (
                <Box
                  key={msg.id || msg.timestamp}
                  maxWidth="60%"
                  bgcolor={isCurrentUser ? "#fcb5c1e4" : "#ffffff"}
                  p={1.5}
                  borderRadius={2}
                  // width='100px'
                  mb={1}
                  sx={{
                    wordBreak: "break-word",
                    ml: isCurrentUser ? "auto" : 0,
                    mr: isCurrentUser ? 0 : "auto",
                    width:'850px'
                  }}
                >
                  {isGroupChat && !isCurrentUser && (
                    <Typography
                      fontSize={12}
                      fontWeight="bold"
                      color="#333"
                      mb={0.5}
                    >
                      {msg.senderName}
                    </Typography>
                  )}

                  {msg.isImage ? (
                    <Box
                      component="img"
                      src={getImageSrc(msg)}
                      alt="sent"
                      sx={{
                        maxWidth: "100%",
                        borderRadius: 1,
                      }}
                    />
                  ) : (
                    <Typography>{msg.content}</Typography>
                  )}

                  <Typography
                    fontSize={10}
                    color="#555"
                    mt={0.5}
                    textAlign="right"
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          width: "100%",
          borderTop: "1px solid #ccc",
          backgroundColor: "#96182c",
          position: "relative",
          bottom: 0,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={!selectedUser}
          />

          <IconButton
            onClick={() => fileInputRef.current?.click()}
            disabled={!selectedUser}
            sx={{ color: "black" }}
          >
            <AttachFileIcon />
          </IconButton>

          <TextField
            fullWidth
            size="small"
            placeholder={imageFile ? `📷 ${imageFile.name}` : "Type a message"}
            disabled={!selectedUser}
            {...register("message", { required: !imageFile })}
            value={imageFile ? `📷 ${imageFile.name}` : watchMessage || ""}
            onChange={(e) => !imageFile && setValue("message", e.target.value)}
            InputProps={{
              readOnly: !!imageFile,
              sx: {
                color: "white",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
              },
            }}
            sx={{
              input: {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "black",
                },
                "&:hover fieldset": {
                  borderColor: "black",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "black",
                },
              },
            }}
          />

          {imageFile && (
            <IconButton
              sx={{ color: "black" }}
              onClick={() => setImageFile(null)}
            >
              <CloseIcon />
            </IconButton>
          )}

          <IconButton
            type="submit"
            disabled={!selectedUser || (!imageFile && !watchMessage)}
            sx={{ color: "black" }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default MainChat;
