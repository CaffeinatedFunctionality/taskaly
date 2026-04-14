'use client';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Try to get the current user
        const currentUser = await FirebaseAuthentication.getCurrentUser();
        setUser(currentUser);
      } catch (e) {
        // If there's an error, it might mean no user is logged in
        setUser(null);
      } finally {
        setLoading(false);
      }

      // Set up listener for auth state changes
      const authStateListener = FirebaseAuthentication.addListener(
        'authStateChange',
        (authStateData) => {
          setUser(authStateData.user);
        }
      );

      // Return cleanup function
      return () => {
        FirebaseAuthentication.removeAllListeners();
      };
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await FirebaseAuthentication.signInWithEmailAndPassword({
        email: email,
        password: password
      });
    } catch (e) {
      console.error('Login failed', e);
      throw e;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await FirebaseAuthentication.signInWithGoogle();
    } catch (e) {
      console.error('Google login failed', e);
      throw e;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await FirebaseAuthentication.createUserWithEmailAndPassword({
        email: email,
        password: password
      });
    } catch (e) {
      console.error('Registration failed', e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await FirebaseAuthentication.signOut();
    } catch (e) {
      console.error('Logout failed', e);
      throw e;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};