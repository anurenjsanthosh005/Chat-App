import { Box } from "@mui/material";
import NavBar from "../components/main/NavBar";
import ChatList from "../components/chat/ChatList";
import MainChat from "../components/chat/MainChat";
import MainChatSkeleton from "../components/chat/MainChatSkeleton";
import { useActiveUsers } from "../contexts/UsersContext";

const Dashboard = () => {
  const { selectedUser } = useActiveUsers();

  return (
    <Box>
      <NavBar />
      <Box display="flex" width="100%" height="90vh" sx={{bgcolor:'#f5e8ea'}}>
        <Box width="25%" borderRight="1px solid #ccc" overflow="auto">
          <ChatList />
        </Box>
        <Box width="75%" bgcolor="#cb8c95a6" overflow="hidden">
          {selectedUser ? <MainChat /> : <MainChatSkeleton />}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
