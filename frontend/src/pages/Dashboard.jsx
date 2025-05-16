import React from "react";
import NavBar from "../components/NavBar";
import UserList from "../components/UserList";
import ChatList from "../components/ChatList";
import MainChat from "../components/MainChat";

const Dashboard = () => {
  return (
    <div>
      <NavBar/>
      <div style={{display:'flex', width:'100%', height:'90vh'}}>
        <div style={{width:'25%'}}>
        <ChatList />
        </div>
        <div style={{backgroundColor:'green',width:'75%'}}>
          <MainChat />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
