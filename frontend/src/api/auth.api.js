import api from './client';

export const authApi = {
  login: async (phone, password) => {
    const res = await api.post('/api/auth/login', { phone, password });
    return res.data;
  },

  register: async (formData) => {
    const res = await api.post('/api/auth/register', formData);
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/api/auth/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put('/api/auth/profile', data);
    return res.data;
  },
};
