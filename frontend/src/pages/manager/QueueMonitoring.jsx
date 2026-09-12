import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import QueueDisplay from '../../components/QueueDisplay';
import { useQueue } from '../../hooks/useQueue';
import { centreApi } from '../../api/centre.api';
import { useAuth } from '../../context/AuthContext';
import { Eye } from 'lucide-react';

export const QueueMonitoring = () => {
  const { user } = useAuth();
  const [centreId, setCentreId] = useState('');
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    let isMounted = true;
    centreApi.getAllCentres().then((res) => {
      if (!isMounted) return;
      const list = res.centres || res.data?.centres || [];
      setCentres(list);
      if (list.length > 0) setCentreId(list[0]._id);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCentreId = user?.centreId?._id || user?.centreId || centreId;
  const { queueData, loading } = useQueue(activeCentreId);

  return (
    <DashboardLayout
      title="Live Multi-Counter Queue Monitor"
      subtitle="Read-only live queue monitoring console across centre weighbridges and quality counters"
    >
      <div className="space-y-6">
        {/* Monitoring Mode Banner */}
        <div className="bg-gov-gray border border-gov-border p-4 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2 text-xs font-bold font-heading text-gov-red">
            <Eye className="w-5 h-5 text-gov-red" />
            <span>MANAGER MONITORING CONSOLE (READ-ONLY)</span>
          </div>
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] px-2.5 py-1 rounded font-bold font-heading uppercase">
            LIVE STREAM ONLINE
          </span>
        </div>

        {/* Live Queue Component */}
        {loading ? (
          <div className="py-12 text-center text-xs text-gov-muted">Connecting to queue socket room...</div>
        ) : (
          <QueueDisplay
            currentlyServing={queueData?.currentlyServing || queueData?.currentServing}
            checkedInWaiting={queueData?.checkedInWaiting || queueData?.waitingList || []}
            upcomingBooked={queueData?.upcomingBooked || queueData?.upcomingList || []}
            completedToday={queueData?.completedToday || queueData?.completedList || []}
            summary={queueData?.summary}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default QueueMonitoring;
