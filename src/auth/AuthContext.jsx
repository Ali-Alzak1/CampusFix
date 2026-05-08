import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usersApi } from '../api/usersApi.js';

const SESSION_KEY = 'campusfix.session';
const AuthContext = createContext(null);

function safeReadSession() {
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const raw = safeReadSession();
    if (!raw) {
      setAuthReady(true);
      return;
    }

    usersApi.getById(raw).then((user) => {
      if (!mounted) return;
      setCurrentUser(user ?? null);
      setAuthReady(true);
    });

    return () => { mounted = false; };
  }, []);

  const value = useMemo(() => ({
    currentUser,
    authReady,
    isStaff: currentUser ? ['maintenance_staff', 'admin'].includes(currentUser.role) : false,
    login: async (identifier) => {
      const user = await usersApi.login(identifier);
      if (!user) {
        throw new Error('No account found for that identifier.');
      }
      window.localStorage.setItem(SESSION_KEY, String(user.user_id));
      setCurrentUser(user);
      return user;
    },
    logout: () => {
      window.localStorage.removeItem(SESSION_KEY);
      setCurrentUser(null);
    }
  }), [currentUser, authReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider.');
  return ctx;
}
