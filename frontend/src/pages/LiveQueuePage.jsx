import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Volume2, RefreshCw, CheckCircle2, Clock, User } from 'lucide-react';
import axios from 'axios';

const LiveQueuePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { joinCentreRoom, leaveCentreRoom, lastNotification } = useSocket();

  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/centres').then((res) => {
      const list = res.data.centres || [];
      setCentres(list);
      if (list.length > 0) {
        const userCentreId = user?.centreId?._id || user?.centreId;
        const knlCentre = list.find((c) => c.code === 'KNL01');
        const defaultCentre = userCentreId || (knlCentre ? knlCentre._id : list[0]._id);
        setSelectedCentreId(defaultCentre);
      }
    });
  }, [user]);

  const fetchQueue = (centreId) => {
    if (!centreId) return;
    setLoading(true);
    axios
      .get(`/api/queue/live?centreId=${centreId}`)
      .then((res) => setQueueData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedCentreId) {
      fetchQueue(selectedCentreId);
      joinCentreRoom(selectedCentreId);

      return () => {
        leaveCentreRoom(selectedCentreId);
      };
    }
  }, [selectedCentreId]);

  useEffect(() => {
    if (lastNotification && selectedCentreId) {
      fetchQueue(selectedCentreId);
    }
  }, [lastNotification]);

  return (
    <div className="space-y-16 max-w-7xl mx-auto px-4 my-8 font-body text-gov-text bg-white pb-16 animate-fade-in-up">
      {/* Header Selector: Subtle Depth & Drop Shadow */}
      <div className="relative bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] p-6 sm:p-8 rounded-2xl border border-gov-border hero-container-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
        {/* Soft Decorative Blurred Red Circle */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-200/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-gov-text flex items-center space-x-2">
            <Volume2 className="w-6 h-6 text-gov-red animate-pulse" />
            <span>{t('queue.live_board_title')}</span>
          </h1>
          <p className="text-xs text-gov-muted mt-0.5">
            Real-time token display board • Synchronized with centre weighbridge counters
          </p>
        </div>

        <div className="relative flex items-center space-x-3 font-heading">
          <label className="text-xs font-semibold text-gov-text whitespace-nowrap">
            Select Centre:
          </label>
          <select
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-gov-border rounded-lg text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none shadow-xs"
          >
            {centres.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.code}) - {c.district}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchQueue(selectedCentreId)}
            className="p-2.5 btn-primary-red rounded-lg shadow-xs transition-all flex items-center justify-center text-white"
            title="Refresh Board"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {queueData && (
        <div className="space-y-8">
          {/* NOW SERVING TOKEN DISPLAY BOARD */}
          <div className="bg-white border-2 border-gov-red text-gov-text rounded-2xl p-8 hero-container-shadow relative overflow-hidden text-center space-y-4">
            <div className="inline-block bg-gov-red text-white font-bold font-heading text-xs px-4 py-1.5 rounded-full tracking-wider uppercase shadow-xs">
              {t('queue.currently_serving')}
            </div>

            {queueData.currentlyServing ? (
              <div className="space-y-2">
                <div className="text-5xl sm:text-6xl font-black font-heading tracking-wider text-gov-red font-mono py-2">
                  {queueData.currentlyServing.tokenNumber}
                </div>
                <div className="text-xl font-bold font-heading text-gov-text">
                  {queueData.currentlyServing.farmerId?.name} • Crop: <span className="text-gov-red">{queueData.currentlyServing.cropType}</span> ({queueData.currentlyServing.estimatedQuantityQuintals} Qtl)
                </div>
                <div className="text-xs text-gov-muted font-medium">
                  Inspection Counter 1 • Please report immediately with booking token pass
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-1 bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] rounded-xl p-4 border border-gov-border">
                <div className="text-2xl font-bold font-heading text-gov-muted">NO TOKEN CURRENTLY SERVING</div>
                <p className="text-xs text-gov-muted">Counter is ready for next farmer check-in</p>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-gov-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-heading">
              <div className="bg-gov-gray p-3.5 rounded-xl border border-gov-border shadow-xs">
                <div className="text-xs text-gov-muted">Total Booked Today</div>
                <div className="text-xl font-bold text-gov-text mt-0.5">{queueData.summary?.totalTotalBooked || 0}</div>
              </div>
              <div className="bg-gov-amber-light p-3.5 rounded-xl border border-amber-200 shadow-xs">
                <div className="text-xs text-amber-900 font-semibold">Checked-In & Waiting</div>
                <div className="text-xl font-bold text-amber-900 mt-0.5">{queueData.summary?.checkedInWaitingCount || 0}</div>
              </div>
              <div className="bg-gov-green-light p-3.5 rounded-xl border border-green-200 shadow-xs">
                <div className="text-xs text-gov-green font-semibold">Completed Today</div>
                <div className="text-xl font-bold text-gov-green mt-0.5">{queueData.summary?.completedCount || 0}</div>
              </div>
              <div className="bg-gov-gray p-3.5 rounded-xl border border-gov-border shadow-xs">
                <div className="text-xs text-gov-muted">Date</div>
                <div className="text-xs font-bold text-gov-text mt-1">{queueData.date}</div>
              </div>
            </div>
          </div>

          {/* Queue Lists Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checked In Waiting List */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h3 className="font-bold font-heading text-gov-text flex items-center justify-between border-b border-gov-border pb-3">
                <span className="flex items-center space-x-2 text-amber-900">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span>{t('queue.waiting_in_queue')}</span>
                </span>
                <span className="bg-gov-amber-light text-amber-900 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {queueData.checkedInWaiting?.length || 0}
                </span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {queueData.checkedInWaiting?.length === 0 ? (
                  <p className="text-xs text-gov-muted py-4 text-center">No checked-in farmers waiting in queue.</p>
                ) : (
                  queueData.checkedInWaiting?.map((item) => (
                    <div key={item._id} className="p-3.5 bg-gov-amber-light rounded-xl border border-amber-200 flex justify-between items-center transition-all hover:border-amber-300">
                      <div>
                        <span className="text-xs font-bold font-mono text-slate-900 bg-white px-2.5 py-1 rounded-md border border-amber-300 shadow-2xs">
                          {item.tokenNumber}
                        </span>
                        <div className="text-xs font-semibold text-slate-900 mt-1">{item.farmerId?.name}</div>
                        <div className="text-[11px] text-gov-muted">{item.cropType} ({item.estimatedQuantityQuintals} Qtl)</div>
                      </div>
                      <span className="text-[11px] bg-amber-200 text-amber-950 border border-amber-400 font-bold px-2.5 py-1 rounded-full">
                        Ready
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Scheduled Today List */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h3 className="font-bold font-heading text-gov-text flex items-center justify-between border-b border-gov-border pb-3">
                <span className="flex items-center space-x-2 text-gov-text">
                  <User className="w-5 h-5 text-gov-muted" />
                  <span>{t('queue.upcoming_tokens')}</span>
                </span>
                <span className="bg-gov-gray text-gov-text text-xs px-2.5 py-0.5 rounded-full font-bold border border-gov-border">
                  {queueData.upcomingBooked?.length || 0}
                </span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {queueData.upcomingBooked?.length === 0 ? (
                  <p className="text-xs text-gov-muted py-4 text-center">No remaining upcoming tickets scheduled for today.</p>
                ) : (
                  queueData.upcomingBooked?.map((item) => (
                    <div key={item._id} className="p-3.5 bg-gov-gray rounded-xl border border-gov-border flex justify-between items-center transition-all hover:border-gov-red">
                      <div>
                        <span className="text-xs font-bold font-mono text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-300 shadow-2xs">
                          {item.tokenNumber}
                        </span>
                        <div className="text-xs font-medium text-slate-900 mt-1">{item.farmerId?.name}</div>
                        <div className="text-[11px] text-gov-muted">{item.slotId?.startTime} - {item.slotId?.endTime}</div>
                      </div>
                      <span className="text-[11px] bg-white border border-gov-border text-gov-text font-medium px-2.5 py-1 rounded-full">
                        Booked
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Completed Today List */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h3 className="font-bold font-heading text-gov-text flex items-center justify-between border-b border-gov-border pb-3">
                <span className="flex items-center space-x-2 text-gov-green">
                  <CheckCircle2 className="w-5 h-5 text-gov-green" />
                  <span>{t('queue.completed_today')}</span>
                </span>
                <span className="bg-gov-green-light text-gov-green border border-green-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {queueData.completedToday?.length || 0}
                </span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {queueData.completedToday?.length === 0 ? (
                  <p className="text-xs text-gov-muted py-4 text-center">No completed procurement weighments yet today.</p>
                ) : (
                  queueData.completedToday?.map((item) => (
                    <div key={item._id} className="p-3.5 bg-gov-green-light rounded-xl border border-green-200 flex justify-between items-center transition-all hover:border-green-300">
                      <div>
                        <span className="text-xs font-bold font-mono text-gov-green">
                          {item.tokenNumber}
                        </span>
                        <div className="text-xs font-semibold text-gov-text">{item.farmerId?.name}</div>
                        <div className="text-[11px] text-gov-green">{item.cropType}</div>
                      </div>
                      <span className="text-[11px] bg-gov-green text-white font-bold px-2.5 py-1 rounded-full">
                        Weighment Done
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveQueuePage;
