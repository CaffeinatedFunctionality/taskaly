'use client';

import { useAuth } from '@/lib/authContext';
import { useState } from 'react';
import { TextField, Button, Box, Typography, Stack, Link } from '@mui/material';

export default function LoginPage() {
  const { login, register, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

    return (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" align="center" sx={{ mb: 2 }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Typography>
          <Box sx={{ mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ width: '100%', mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Box>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ width: '100%', mb: 1 }}
            onClick={loginWithGoogle}
            disabled={loading}
          >
            Continue with Google
          </Button>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Typography variant="body2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Typography>
            <Link
              variant="body2"
              color="primary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Link>
          </Stack>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
}