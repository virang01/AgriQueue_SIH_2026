import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { CheckSquare, Search, RefreshCw, UserCheck, Clock } from 'lucide-react';
import { queueApi } from '../../api/queue.api';
import { useAuth } from '../../context/AuthContext';

export const TodaysQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchQueue = () => {
    const centreId = user?.centreId?._id || user?.centreId;
    if (!centreId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    queueApi
      .getTodayQueue(centreId)
      .then((res) => {
        const data = res.data || res;
        if (data.checkedInWaiting || data.upcomingBooked || data.completedToday) {
          const list = [
            ...(data.currentlyServing ? [data.currentlyServing] : []),
            ...(data.checkedInWaiting || []),
            ...(data.upcomingBooked || []),
            ...(data.completedToday || []),
          ];
          setQueue(list);
        } else {
          setQueue(res.queue || res.data?.queue || []);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, [user]);

  const filteredQueue = queue.filter((item) => {
    const token = item.tokenNumber || '';
    const name = item.farmerId?.name || '';
    const matchesSearch =
      token.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout
      title="Today's Queue Roster"
      subtitle="Live queue roster of all farmers scheduled and checked in at this centre today"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl border border-gov-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gov-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search token or farmer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-2 px-3 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="checked_in">Checked In</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <Button variant="outline" onClick={fetchQueue}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Queue Roster Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-red tracking-wider">
              Centre Queue Entries ({filteredQueue.length})
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gov-muted">Loading queue roster...</div>
          ) : filteredQueue.length === 0 ? (
            <div className="py-12 text-center text-gov-muted text-xs">No queue records match your filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                  <tr>
                    <th className="p-3">Token No.</th>
                    <th className="p-3">Farmer Name</th>
                    <th className="p-3">Crop & Qty</th>
                    <th className="p-3">Slot Time</th>
                    <th className="p-3">Current Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {filteredQueue.map((q) => (
                    <tr key={q._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900 text-sm">
                        <span className="px-2.5 py-1 rounded-md bg-red-100/90 text-gov-red font-black border border-red-300 font-mono inline-block shadow-2xs">
                          {q.tokenNumber}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{q.farmerId?.name || 'Farmer'}</td>
                      <td className="p-3">
                        {q.cropType} ({q.estimatedQuantityQuintals} Qtl)
                      </td>
                      <td className="p-3 font-mono">
                        {q.slotId?.startTime || '08:00'} - {q.slotId?.endTime || '10:00'}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TodaysQueue;
