import api from './client';

export const paymentApi = {
  getPayments: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/payments?${query}`);
    return res.data;
  },

  updateStatus: async (paymentId, status, remarks) => {
    const res = await api.put(`/api/payments/${paymentId}/status`, { status, remarks });
    return res.data;
  },
};
