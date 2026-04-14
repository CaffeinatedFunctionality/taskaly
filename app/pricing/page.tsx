import { Box, Button, Card, CardContent, CardMedia, Typography, Stack } from '@mui/material';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      <Stack spacing={3} direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: 'stretch' }}>
        {/* Free Plan */}
        <Card sx={{ height: '100%', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Free
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Great for getting started
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Unlimited projects & tasks
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Basic workflow builder (max 2 active workflows)
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Light/Dark theme
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="outlined">Get Started Free</Button>
            </Box>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card sx={{ height: '100%', boxShadow: 3, bgcolor: '#f0f8ff' }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              Pro
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              For individuals who want more power
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Unlimited projects & tasks
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Unlimited workflows
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Advanced triggers & actions (time-based, webhook)
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              File attachments & comments
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Multiple views (Board, List, Calendar)
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Priority support
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button variant="contained" color="primary">
                Subscribe for $8/month
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}