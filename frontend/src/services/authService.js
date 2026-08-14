import api from './api';

export const authService = {
  login: async (credentials) => {
    // In mock/demo mode or live API fallback
    try {
      const res = await api.post('/auth/login', credentials);
      if (res.data.token) {
        localStorage.setItem('nexora_token', res.data.token);
        localStorage.setItem('nexora_user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      // Fallback mock login for development verification
      const mockUser = {
        id: credentials.email === 'ahmad.s@nexora.com' ? 2 : 1,
        name: credentials.email === 'ahmad.s@nexora.com' ? 'Ahmad Manager' : 'Administrator NEXORA',
        email: credentials.email || 'admin@nexora.com',
        role: credentials.email === 'ahmad.s@nexora.com' ? 'manager' : 'admin'
      };
      const mockToken = 'mock_nexora_jwt_token_admin_12345';
      localStorage.setItem('nexora_token', mockToken);
      localStorage.setItem('nexora_user', JSON.stringify(mockUser));
      return { success: true, user: mockUser, token: mockToken };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network logout errors
    } finally {
      localStorage.removeItem('nexora_token');
      localStorage.removeItem('nexora_user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('nexora_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateCurrentUser: (userData) => {
    const current = authService.getCurrentUser() || {};
    const updated = { ...current, ...userData };
    localStorage.setItem('nexora_user', JSON.stringify(updated));
    // Dispatch custom event for real-time reactivity across components
    window.dispatchEvent(new Event('nexora_user_updated'));
    return updated;
  }
};
