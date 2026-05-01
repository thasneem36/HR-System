import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Divider,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';

const Profile = ({ open, onClose }) => {
  const user = {
    firstName: 'Mohammed',
    lastName: 'Thasneem',
    email: 'abc123@gmail.com',
  };

  const [dialogOpen, setDialogOpen] = useState(null); // 'password' | 'imageView' | 'imageAction' | 'imageUpload'
  const [profilePhoto, setProfilePhoto] = useState(null);
  const imageURL = profilePhoto ? URL.createObjectURL(profilePhoto) : null;

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isVerifiedOld, setIsVerifiedOld] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(null);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsVerifiedOld(false);
    setErrors({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleAvatarClick = () => {
    setDialogOpen(profilePhoto ? 'imageAction' : 'imageUpload');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">Profile</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ bgcolor: '#fff', borderRadius: 2 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left: User Info */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Account Details</Typography>
              <Stack spacing={1} mt={2}>
                <Typography><strong>First Name:</strong> {user.firstName}</Typography>
                <Typography><strong>Last Name:</strong> {user.lastName}</Typography>
                <Typography><strong>Email:</strong> {user.email}</Typography>
              </Stack>
            </Grid>

            {/* Right: Avatar */}
            <Grid item xs={12} md={6} textAlign="center">
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  bgcolor: 'grey.300',
                  mx: 'auto',
                  fontSize: 14,
                  color: 'text.secondary',
                  cursor: 'pointer',
                }}
                src={imageURL ?? undefined}
                onClick={handleAvatarClick}
              >
                {!profilePhoto && (
                  <Stack alignItems="center" spacing={1}>
                    <PhotoCamera fontSize="large" />
                    <Typography variant="caption">Click to upload</Typography>
                  </Stack>
                )}
              </Avatar>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Security Actions */}
          <Typography variant="h6" gutterBottom>Security</Typography>
          <Button
            startIcon={<EditIcon />}
            size="small"
            variant="text"
            sx={{ color: 'green', textTransform: 'none' }}
            onClick={() => setDialogOpen('password')}
          >
            Change Password
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">Close</Button>
      </DialogActions>

      {/* Change Password Dialog */}
      <Dialog open={dialogOpen === 'password'} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {!isVerifiedOld && (
              <>
                <TextField
                  label="Enter Old Password"
                  type="password"
                  fullWidth
                  value={oldPassword}
                  error={Boolean(errors.oldPassword)}
                  helperText={errors.oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, oldPassword: '' }));
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    if (oldPassword !== 'admin123') {
                      setErrors((prev) => ({
                        ...prev,
                        oldPassword: 'Incorrect old password.',
                      }));
                    } else {
                      setIsVerifiedOld(true);
                    }
                  }}
                >
                  Verify
                </Button>
              </>
            )}

            {isVerifiedOld && (
              <>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  error={Boolean(errors.newPassword)}
                  helperText={errors.newPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewPassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      newPassword: value.length < 6 ? 'Minimum 6 characters required.' : '',
                    }));
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfirmPassword(value);
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: value !== newPassword ? 'Passwords do not match.' : '',
                    }));
                  }}
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={
              !isVerifiedOld ||
              !newPassword ||
              !confirmPassword ||
              Object.values(errors).some(Boolean)
            }
            onClick={() => {
              console.log('✅ Password changed to:', newPassword);
              handleDialogClose();
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Image Dialog */}
      <Dialog open={dialogOpen === 'imageUpload'} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload Profile Photo</DialogTitle>
        <DialogContent dividers>
          <Button variant="outlined" component="label">
            Choose Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setProfilePhoto(e.target.files[0]);
                  setDialogOpen(null);
                }
              }}
            />
          </Button>
        </DialogContent>
      </Dialog>

      {/* Change/View Photo Dialog */}
      <Dialog open={dialogOpen === 'imageAction'} onClose={handleDialogClose}>
        <DialogTitle>Profile Photo</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Button variant="outlined" onClick={() => setDialogOpen('imageView')}>
              View Full Image
            </Button>
            <Button variant="contained" component="label">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    setProfilePhoto(e.target.files[0]);
                    setDialogOpen(null);
                  }
                }}
              />
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Fullscreen View */}
      <Dialog open={dialogOpen === 'imageView'} onClose={handleDialogClose} fullScreen>
        <Box
          sx={{
            height: '100vh',
            bgcolor: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative',
            gap: 3,
            px: 2,
          }}
        >
          <IconButton
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={imageURL ?? 'https://via.placeholder.com/300x300?text=No+Image'}
            alt="Profile Full View"
            sx={{
              maxHeight: '70vh',
              maxWidth: '90vw',
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: 3,
            }}
          />
        </Box>
      </Dialog>
    </Dialog>
  );
};

export default Profile;
