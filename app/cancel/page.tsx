import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Payment Cancelled
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 4 }}>
        You can try again anytime.
      </Typography>
      <Link href="/pricing">
        <Button variant="outlined">Go Back to Pricing</Button>
      </Link>
    </Box>
  );
}