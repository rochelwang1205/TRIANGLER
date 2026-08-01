import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { getStoredUser } from '../utils/auth';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = useCallback((loggedInUser, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const role = user?.role ?? ROLES.STUDENT;

  const value = useMemo(
    () => ({
      user,
      role,
      isLoggedIn: Boolean(user),
      isStudent: role === ROLES.STUDENT,
      isTeacher: role === ROLES.TEACHER,
      isAdmin: role === ROLES.ADMIN,
      login,
      logout,
    }),
    [user, role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
