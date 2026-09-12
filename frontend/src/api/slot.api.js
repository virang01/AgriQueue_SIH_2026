import api from './client';

export const slotApi = {
  getAvailableSlots: async (centreId, date) => {
    const res = await api.get(`/api/slots?centreId=${centreId}&date=${date || ''}`);
    return res.data;
  },

  bookSlot: async (bookingData) => {
    const res = await api.post('/api/slots/book', bookingData);
    return res.data;
  },

  createBatchSlots: async (batchData) => {
    const res = await api.post('/api/slots/create-batch', batchData);
    return res.data;
  },
};
