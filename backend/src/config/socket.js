import { Server } from 'socket.io';

let ioInstance = null;

export const initSocketConfig = (server) => {
  ioInstance = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  ioInstance.on('connection', (socket) => {
    console.log(`⚡ [Socket.IO] Client connected: ${socket.id}`);

    // Join Centre room
    socket.on('join_centre', (centreId) => {
      if (centreId) {
        const roomName = `centre_${centreId}`;
        socket.join(roomName);
        console.log(`📌 [Socket.IO] Socket ${socket.id} joined room ${roomName}`);
      }
    });

    // Leave Centre room
    socket.on('leave_centre', (centreId) => {
      if (centreId) {
        const roomName = `centre_${centreId}`;
        socket.leave(roomName);
        console.log(`🚪 [Socket.IO] Socket ${socket.id} left room ${roomName}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized!');
  }
  return ioInstance;
};
