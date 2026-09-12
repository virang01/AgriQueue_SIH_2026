import api from './client';

export const procurementApi = {
  recordWeighment: async (procurementData) => {
    const res = await api.post('/api/procurement', procurementData);
    return res.data;
  },

  recordProcurement: async (procurementData) => {
    const res = await api.post('/api/procurement', procurementData);
    return res.data;
  },

  getRecords: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/procurement?${query}`);
    return res.data;
  },
};
