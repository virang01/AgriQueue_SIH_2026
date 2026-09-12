import api from './client';

export const adminApi = {
  getOverview: async () => {
    const res = await api.get('/api/admin/overview');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/api/analytics');
    return res.data;
  },
};
