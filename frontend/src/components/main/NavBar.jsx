import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LogoutIcon from "@mui/icons-material/Logout";

function NavBar() {
  const { name, role, userLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDashboard = location.pathname === "/dashboard";
  const isOnAdminPanel = location.pathname === "/admin-pannel";

  const handleLogout = () => {
    userLogout();
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#96182c", height: "10vh", overflow: "hidden", px: 2 }}
    >
      <Toolbar
        disableGutters
        sx={{
          maxWidth: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: App Name */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Init Chat
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            width: 350,
            justifyContent: "space-between",
          }}
        >
          {/* Left side inside right box: icon + username */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              whiteSpace: "nowrap",
            }}
          >
            <AccountCircleIcon />
            <Typography sx={{fontWeight:'600'}}>{name}</Typography>
          </Box>

          {/* Right side inside right box: buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {role === "admin" && isOnDashboard && (
              <Button
                variant="contained"
                sx={{ bgcolor: "#422328" }}
                onClick={() => navigate("/admin-pannel")}
                size="small"
              >
                Admin Panel
              </Button>
            )}
            {role === "admin" && isOnAdminPanel && (
              <Button
                variant="contained"
                sx={{ bgcolor: "#422328" }}
                onClick={() => navigate("/dashboard")}
                size="small"
              >
                chat
              </Button>
            )}
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => {
                if (window.confirm("Are you sure you want to logout?")) {
                  handleLogout();
                }
              }}
              sx={{ width: 40 }}
            >
              <LogoutIcon fontSize="small" />
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
