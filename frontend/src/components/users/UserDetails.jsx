import { Modal, Box, Typography, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function UserDetails({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          User Details
        </Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Name: {user.name}</Typography>
        <Typography>Role: {user.role}</Typography>
        {/* Add other details as needed */}
        <Button onClick={onClose} sx={{ mt: 2 }} variant="contained">Close</Button>
      </Box>
    </Modal>
  );
}

export default UserDetails
