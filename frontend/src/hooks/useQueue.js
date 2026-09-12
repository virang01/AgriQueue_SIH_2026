import { useState, useEffect, useCallback } from 'react';
import { queueApi } from '../api/queue.api';
import { useSocketContext } from '../context/SocketContext';

export const useQueue = (centreId, date) => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const socketContext = useSocketContext();
  const joinCentreRoom = socketContext?.joinCentreRoom;
  const leaveCentreRoom = socketContext?.leaveCentreRoom;
  const lastNotification = socketContext?.lastNotification;

  const fetchQueue = useCallback(async () => {
    if (!centreId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await queueApi.getLiveQueue(centreId, date);
      setQueueData(res.data || res);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [centreId, date]);

  useEffect(() => {
    fetchQueue();
    if (centreId && joinCentreRoom) {
      joinCentreRoom(centreId);
      return () => {
        if (leaveCentreRoom) leaveCentreRoom(centreId);
      };
    }
  }, [centreId, date, fetchQueue, joinCentreRoom, leaveCentreRoom]);

  useEffect(() => {
    if (lastNotification && centreId) {
      fetchQueue();
    }
  }, [lastNotification, centreId, fetchQueue]);

  // Helper to calculate estimated wait for a specific token
  const getEstimatedWaitMinutes = (tokenNumber) => {
    if (!queueData || !tokenNumber) return null;
    const waitingList = queueData.checkedInWaiting || [];
    const index = waitingList.findIndex((t) => t.tokenNumber === tokenNumber);
    if (index === -1) return 0;
    // Estimate 15 minutes per farmer inspection
    return (index + 1) * 15;
  };

  return {
    queueData,
    loading,
    error,
    refreshQueue: fetchQueue,
    getEstimatedWaitMinutes,
  };
};

export default useQueue;
