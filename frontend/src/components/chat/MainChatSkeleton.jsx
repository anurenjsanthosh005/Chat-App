import React from "react";
import { Box, Typography } from "@mui/material";

function MainChatSkeleton() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Typography variant="h4" fontWeight={600} color="#520d0d" mb={1}>
        Init Chat
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Select a chat to start a conversation
      </Typography>
    </Box>
  );
}

export default MainChatSkeleton;
