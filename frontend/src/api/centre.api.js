import api from './client';

export const centreApi = {
  getAllCentres: async () => {
    const res = await api.get('/api/centres');
    return res.data;
  },

  getCentreById: async (id) => {
    const res = await api.get(`/api/centres/${id}`);
    return res.data;
  },

  createCentre: async (centreData) => {
    const res = await api.post('/api/centres', centreData);
    return res.data;
  },
};
