import api from './client';

export const queueApi = {
  getLiveQueue: async (centreId, date) => {
    const res = await api.get(`/api/queue/live?centreId=${centreId}&date=${date || ''}`);
    return res.data;
  },

  getTodayQueue: async (centreId, date) => {
    const res = await api.get(`/api/queue/live?centreId=${centreId || ''}&date=${date || ''}`);
    return res.data;
  },

  checkInFarmer: async (tokenNumber) => {
    const res = await api.post('/api/queue/check-in', { tokenNumber });
    return res.data;
  },

  callNextToken: async (bookingId) => {
    const res = await api.post('/api/queue/call-next', { bookingId });
    return res.data;
  },

  callNextFarmer: async (data = {}) => {
    const res = await api.post('/api/queue/call-next', data);
    return res.data;
  },

  getMyBookings: async () => {
    const res = await api.get('/api/queue/my-bookings');
    return res.data;
  },

  cancelBooking: async (bookingId) => {
    const res = await api.put(`/api/queue/${bookingId}/cancel`);
    return res.data;
  },
};
