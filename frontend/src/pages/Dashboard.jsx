import NavBar from "../components/NavBar";
import ChatList from "../components/ChatList";
import MainChat from "../components/MainChat";
import { useActiveUsers } from "../contexts/UsersContext";
import MainChatSkeleton from "../components/MainChatSkeleton";

const Dashboard = () => {
  const { selectedUser } = useActiveUsers();
  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", width: "100%", height: "90vh" }}>
        <div style={{ width: "25%" }}>
          <ChatList />
        </div>
        <div style={{ backgroundColor: "green", width: "75%" }}>
          {!selectedUser ? <MainChatSkeleton /> : <MainChat />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
