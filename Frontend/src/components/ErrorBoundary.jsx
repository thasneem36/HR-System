import { Component } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex" flexDirection="column" alignItems="center" justifyContent="center"
          minHeight="60vh" gap={2} px={3} textAlign="center"
        >
          <ErrorIcon sx={{ fontSize: 64, color: '#941936', opacity: 0.7 }} />
          <Typography variant="h5" fontWeight={700}>Something went wrong</Typography>
          <Typography variant="body2" color="text.secondary" maxWidth={400}>
            An unexpected error occurred. Please refresh the page or contact support if the problem persists.
          </Typography>
          {import.meta.env.DEV && (
            <Box component="pre" sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, fontSize: 12, textAlign: 'left', maxWidth: 600, overflow: 'auto' }}>
              {this.state.error?.toString()}
            </Box>
          )}
          <Button variant="contained" sx={{ bgcolor: '#941936' }} onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
