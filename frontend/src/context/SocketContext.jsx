import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [lastNotification, setLastNotification] = useState(null);

  useEffect(() => {
    const newSocket = io('/', {
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('⚡ Connected to AgriQueue Socket.IO Server:', newSocket.id);
    });

    newSocket.on('token_called', (data) => {
      setLastNotification({
        type: 'TOKEN_CALLED',
        message: `📢 TOKEN CALLED: ${data.tokenNumber} (${data.farmerName}) - Please report for inspection!`,
        timestamp: new Date(),
        data,
      });
    });

    newSocket.on('queue_updated', (data) => {
      setLastNotification({
        type: 'QUEUE_UPDATED',
        message: `🔄 Queue updated for token status`,
        timestamp: new Date(),
        data,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinCentreRoom = (centreId) => {
    if (socket && centreId) {
      socket.emit('join_centre', centreId);
    }
  };

  const leaveCentreRoom = (centreId) => {
    if (socket && centreId) {
      socket.emit('leave_centre', centreId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinCentreRoom, leaveCentreRoom, lastNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export const useSocketContext = useSocket;
