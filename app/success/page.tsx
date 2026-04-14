'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after a short delay
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 4 }}>
        Your subscription is now active. Redirecting to your dashboard...
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgress size={30} />
        <Typography variant="body2" sx={{ ml: 2 }}>Redirecting...</Typography>
      </Box>
    </Box>
  );
}