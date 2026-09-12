import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import QueueDisplay from '../../components/QueueDisplay';
import Card from '../../components/Card';
import { useQueue } from '../../hooks/useQueue';
import { centreApi } from '../../api/centre.api';
import { queueApi } from '../../api/queue.api';
import { Radio, MapPin, Ticket } from 'lucide-react';

export const LiveQueueView = () => {
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState('');
  const [myTokenNumber, setMyTokenNumber] = useState(null);

  useEffect(() => {
    centreApi.getAllCentres().then((res) => {
      const list = res.centres || res.data?.centres || [];
      setCentres(list);
      if (list.length > 0) setSelectedCentre(list[0]._id);
    });

    queueApi.getMyBookings().then((res) => {
      const list = res.bookings || res.data?.bookings || [];
      const active = list.find(
        (b) => b.status === 'booked' || b.status === 'checked_in' || b.status === 'in_inspection'
      ) || list[0];
      if (active) {
        setMyTokenNumber(active.tokenNumber);
        const activeCentreId = active.centreId?._id || active.centreId;
        if (activeCentreId) setSelectedCentre(activeCentreId);
      }
    });
  }, []);

  const { queueData, loading } = useQueue(selectedCentre);

  const selectedCentreObj = centres.find((c) => c._id === selectedCentre);

  return (
    <DashboardLayout
      title="Live Centre Queue Status"
      subtitle="Real-time procurement counter status board auto-highlighted for your token"
    >
      <div className="space-y-6">
        {/* Highlight Banner if Token Exists */}
        {myTokenNumber && (
          <div className="bg-gov-red text-white p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Ticket className="w-6 h-6 flex-shrink-0 text-white" />
              <div>
                <div className="text-[11px] uppercase font-bold font-heading text-white/90">Your Token Ticket</div>
                <div className="text-lg font-black font-mono tracking-wide text-white bg-white/20 px-3 py-1 rounded-md border border-white/30 inline-block mt-0.5">{myTokenNumber}</div>
              </div>
            </div>
            <div className="text-xs bg-white text-gov-red px-3 py-1.5 rounded-lg font-bold font-heading shadow-2xs">
              Highlight active on live board below
            </div>
          </div>
        )}

        {/* Centre Picker */}
        <div className="bg-white p-4 rounded-xl border border-gov-border flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gov-red" />
          <div className="flex-1">
            <label className="block text-xs font-bold text-gov-muted uppercase">Select Centre</label>
            <select
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
              className="w-full bg-gov-gray font-semibold text-sm text-gov-text p-2 rounded-lg border border-gov-border focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              {centres.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.district}, {c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Board */}
        {loading ? (
          <div className="py-12 text-center text-xs text-gov-muted">Connecting to live queue stream...</div>
        ) : (
          <QueueDisplay
            currentlyServing={queueData?.currentlyServing}
            summary={queueData?.summary}
            checkedInWaiting={queueData?.checkedInWaiting}
            upcomingBooked={queueData?.upcomingBooked}
            completedToday={queueData?.completedToday}
            highlightToken={myTokenNumber}
            centreName={selectedCentreObj?.name}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default LiveQueueView;
