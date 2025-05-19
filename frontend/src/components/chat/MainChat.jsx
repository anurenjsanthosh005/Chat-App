import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import { useActiveUsers } from "../../contexts/UsersContext";
import axiosInstance from "../../services/axiosInstance";

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
      console.log("RECIEVED MESSAGE :",data);

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
      alert("Image upload failed: " + (err.response?.data?.error || err.message));
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
      return msg.content.startsWith("http") ? msg.content : `${MEDIA_BASE_URL}${msg.content}`;
    }
    return "";
  };

  return (
    <div style={{ width: "100%", height: "90vh", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          height: "7%",
          backgroundColor: "red",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: "10px",
          width: "95%",
        }}
      >
        <div
          style={{
            width: "25px",
            height: "25px",
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        />
        <h3 style={{ margin: 0 }}>{selectedUser?.name || "Select a user"}</h3>
        {selectedUser?.type === "group" ? <button>members</button> : <button>profile</button>}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          flexDirection: "column",
          width: "95%",
        }}
      >
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>
              Send messages to start a conversation
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderId === currentUserId;
              const isGroupChat = selectedUser?.type === "group";

              return (
                <div
                  key={msg.id || msg.timestamp}
                  style={{
                    maxWidth: "60%",
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                    backgroundColor: isCurrentUser ? "#DCF8C6" : "#ffffff",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    marginBottom: "10px",
                    wordBreak: "break-word",
                  }}
                >
                  {isGroupChat && !isCurrentUser && (
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: "12px",
                        marginBottom: "4px",
                        color: "#333",
                      }}
                    >
                      {msg.senderName}
                    </div>
                  )}

                  {msg.isImage ? (
                    <img
                      src={getImageSrc(msg)}
                      alt="sent"
                      style={{ maxWidth: "100%", borderRadius: "6px" }}
                    />
                  ) : (
                    <div>{msg.content}</div>
                  )}

                  <div
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      marginTop: "4px",
                      textAlign: "right",
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          height: "10%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px",
          borderTop: "1px solid #ccc",
          width: "95%",
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={!selectedUser}
        />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={!selectedUser}>
          📎
        </button>
        <input
          type="text"
          {...register("message", { required: !imageFile })}
          placeholder={imageFile ? `📷 ${imageFile.name}` : "Type a message"}
          value={imageFile ? `📷 ${imageFile.name}` : watchMessage || ""}
          onChange={(e) => !imageFile && setValue("message", e.target.value)}
          readOnly={!!imageFile}
          disabled={!selectedUser}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        {imageFile && (
          <button type="button" onClick={() => setImageFile(null)} style={{ flexShrink: 0 }}>
            ❌
          </button>
        )}
        <button
          type="submit"
          disabled={!selectedUser || (!imageFile && !watchMessage)}
          style={{ flexShrink: 0 }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default MainChat;
