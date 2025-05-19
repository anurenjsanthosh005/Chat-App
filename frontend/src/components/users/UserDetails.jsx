import { Modal, Box, Typography, Button, Divider, Stack } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
};

function UserDetails({ open, onClose, user }) {
  if (!user) return null;

  const isGroup = user.type === "group";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h5" mb={1} fontWeight={600}>
          {isGroup ? "Group Details" : "User Details"}
        </Typography>
        <Divider />

        <Stack spacing={2} mt={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon sx={{ color: "#971824" }} />
            <Typography>Name: {user.name}</Typography>
          </Stack>

          {isGroup ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <GroupsIcon sx={{ color: "#1e0407" }} />
              <Typography>Type: {user.type}</Typography>
            </Stack>
          ) : (
            <>
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon sx={{ color: "#971824" }} />
                <Typography>Email: {user.email}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <AdminPanelSettingsIcon sx={{ color: "#1e0407" }} />
                <Typography>Role: {user.role}</Typography>
              </Stack>
            </>
          )}
        </Stack>

        {isGroup && user.members?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600}>
              Members
            </Typography>
            <Stack spacing={1} mt={1}>
              {user.members.map((member, index) => (
                <Typography key={index} sx={{ pl: 1 }}>
                  • {member.name}
                </Typography>
              ))}
            </Stack>
          </>
        )}

        <Button
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{ mt: 3, bgcolor: "#8a3d49" }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
}

export default UserDetails;
