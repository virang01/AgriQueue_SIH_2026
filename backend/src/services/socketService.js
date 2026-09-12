import { getIO } from '../config/socket.js';

export const emitQueueUpdate = (centreId, payload) => {
  try {
    const io = getIO();
    const roomName = `centre_${centreId}`;
    io.to(roomName).emit('queue_updated', payload);
    console.log(`📡 [Socket Broadcast] Emitted queue_updated to room ${roomName}`);
  } catch (err) {
    console.warn(`⚠️ Socket broadcast skipped: ${err.message}`);
  }
};

export const emitTokenStatusChange = (centreId, tokenData) => {
  try {
    const io = getIO();
    const roomName = `centre_${centreId}`;
    io.to(roomName).emit('token_status_changed', tokenData);
  } catch (err) {
    console.warn(`⚠️ Socket broadcast skipped: ${err.message}`);
  }
};
