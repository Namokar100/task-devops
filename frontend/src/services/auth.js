import api from './api';

export const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async signup(userData) {
    const response = await api.post('/auth/signup', userData);
    // After signup, automatically login
    if (response.data.user) {
      const loginResponse = await this.login({
        email: userData.email,
        password: userData.password
      });
      return loginResponse;
    }
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};