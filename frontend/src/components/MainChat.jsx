import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { useActiveUsers } from "../contexts/UsersContext";

function MainChat() {
  const { id } = useAuth();
  const currentUserId = Number(id); // Convert to number here

  const { token } = useAuth();
  const { selectedUser } = useActiveUsers();

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedUser || !token) return;

    setMessages([]);

    const wsUrl = `ws://127.0.0.1:8000/ws/chat/?receiverId=${selectedUser.id}&token=${token}`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socketRef.current.close();
    };
  }, [selectedUser, token]);

  const onSubmit = (data) => {
    if (!selectedUser) return;

    const newMessage = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: selectedUser.id,
      content: data.message,
      timestamp: new Date().toISOString(),
    };

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
    }

    reset();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
        <button>Profile</button>
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
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                maxWidth: "60%",
                alignSelf:
                  msg.senderId === currentUserId ? "flex-end" : "flex-start",
                backgroundColor:
                  msg.senderId === currentUserId ? "#DCF8C6" : "#ffffff",
                padding: "8px 12px",
                borderRadius: "12px",
              }}
            >
              <div>{msg.content}</div>
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
          ))}

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
        <button type="button">📎</button>
        <input
          type="text"
          {...register("message", { required: true })}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
          disabled={!selectedUser}
        />
        <button type="submit" disabled={!selectedUser}>
          Send
        </button>
      </form>
    </div>
  );
}

export default MainChat;
