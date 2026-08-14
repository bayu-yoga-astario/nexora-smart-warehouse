import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!authService.getCurrentUser());

  useEffect(() => {
    const handleUserUpdate = () => {
      const current = authService.getCurrentUser();
      setUser(current);
      setIsAuthenticated(!!current);
    };

    window.addEventListener('nexora_user_updated', handleUserUpdate);
    window.addEventListener('storage', handleUserUpdate);
    return () => {
      window.removeEventListener('nexora_user_updated', handleUserUpdate);
      window.removeEventListener('storage', handleUserUpdate);
    };
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (userData) => {
    const updated = authService.updateCurrentUser(userData);
    setUser(updated);
    return updated;
  };

  return { user, isAuthenticated, login, logout, updateProfile };
};
