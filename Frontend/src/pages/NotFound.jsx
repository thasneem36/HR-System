import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { SentimentDissatisfied as SadIcon } from '@mui/icons-material';

const BRAND = '#941936';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box
      display="flex" flexDirection="column" alignItems="center" justifyContent="center"
      minHeight="100vh" gap={2} bgcolor="#f8f9fa" textAlign="center" px={3}
    >
      <SadIcon sx={{ fontSize: 80, color: BRAND, opacity: 0.6 }} />
      <Typography variant="h1" fontWeight={800} color={BRAND} lineHeight={1}>404</Typography>
      <Typography variant="h5" fontWeight={600}>Page Not Found</Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={360}>
        The page you're looking for doesn't exist or you don't have permission to view it.
      </Typography>
      <Button variant="contained" sx={{ bgcolor: BRAND, mt: 1 }} onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
