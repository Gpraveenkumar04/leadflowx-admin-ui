import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../src/services/api';

type User = { id?: string; email?: string; name?: string } | null;

const AuthContext = createContext<{ user: User }>({ user: null });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    let mounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) return;
    // Only attempt to load user when an auth token exists
    authAPI
      .getCurrentUser()
      .then((u) => {
        if (mounted) setUser(u || null);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Optional helper: set token and refresh user (useful for wiring login flows)
  // Not exported directly; can be added later if authentication UI is implemented.

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
