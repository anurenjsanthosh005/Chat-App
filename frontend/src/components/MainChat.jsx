import React from "react";
import { useAuth } from "../contexts/AuthContext";

function MainChat() {
    const {name} = useAuth()
  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <div
        style={{
          width: "100%",
          height: "7%",
          backgroundColor: "red",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{ width: "25px", height: "25px", backgroundColor: "white" }}
        ></div>
        <h3>{name}</h3>
        <button>profile</button>
      </div>
      <div style={{ width: "100%", height: "83%", backgroundColor: "yellow" }}>
        chat body
      </div>
      <div style={{ width: "100%", height: "10%", backgroundColor: "grey" }}>
        <form action="">
            <button>attach</button>
            <input type="text" />
            <button>send</button>
        </form>
      </div>
    </div>
  );
}

export default MainChat;
