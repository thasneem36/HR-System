import React from 'react';
import { useLeaveContext } from './LeaveContext';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack
} from '@mui/material';

const Notification = () => {
  const { notifications } = useLeaveContext();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Notifications
      </Typography>

      {notifications.length === 0 ? (
        <Typography>No notifications yet.</Typography>
      ) : (
        <Paper elevation={3} sx={{ mt: 2, borderRadius: 2 }}>
          <List>
            {notifications.map((note, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={note.message}
                    secondary={note.timestamp}
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Notification;
