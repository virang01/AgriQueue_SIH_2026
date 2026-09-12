import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import { Volume2, Radio, User, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { queueApi } from '../../api/queue.api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const CallNextFarmer = () => {
  const { user } = useAuth();
  const { lastNotification } = useSocket();
  const [calling, setCalling] = useState(false);
  const [queueState, setQueueState] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const centreId = user?.centreId?._id || user?.centreId;

  const fetchQueue = async () => {
    if (!centreId) return;
    try {
      const data = await queueApi.getLiveQueue(centreId);
      setQueueState(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [centreId]);

  useEffect(() => {
    if (lastNotification && centreId) {
      fetchQueue();
    }
  }, [lastNotification, centreId]);

  const handleCallNext = async () => {
    setCalling(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await queueApi.callNextFarmer({ centreId });
      const booking = res.booking || res.data?.booking;
      const token = booking?.tokenNumber || 'Token';
      const farmerName = booking?.farmerId?.name || 'Farmer';

      setMsg({
        type: 'success',
        text: `Success! Called Token ${token} (${farmerName}). Turn SMS sent & live queue board updated!`,
      });
      fetchQueue();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to call next token in queue';
      setMsg({
        type: 'error',
        text: errMsg,
      });
    } finally {
      setCalling(false);
    }
  };

  const currentlyServing = queueState?.currentlyServing;
  const nextWaiting = queueState?.checkedInWaiting?.[0];
  const waitingCount = queueState?.checkedInWaiting?.length || 0;

  return (
    <DashboardLayout
      title="Call Next Farmer Counter Control"
      subtitle="Broadcast next token call over loud speakers, Socket.IO live display, and instant SMS alerts"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Prominent Call Next Card */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-6 text-center border-2 border-gov-red">
          <div className="flex items-center justify-center space-x-2 text-gov-red font-bold font-heading text-xs uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Counter Broadcast Controller</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold font-heading text-gov-text">
              Advance Queue & Signal Next Farmer
            </h2>
            <p className="text-xs text-gov-muted max-w-md mx-auto mt-1">
              Clicking "Call Next" advances the queue, marks previous inspection done, broadcasts to the live board, and sends an SMS to the farmer.
            </p>
          </div>

          {/* Queue Stage Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-heading">
            {/* Current Serving Box */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
              <div className="text-[10px] uppercase font-bold text-gov-red flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-gov-red animate-pulse"></span>
                <span>Now Serving at Counter</span>
              </div>
              {currentlyServing ? (
                <div className="mt-1">
                  <div className="text-xl font-mono font-black text-gov-red">
                    {currentlyServing.tokenNumber}
                  </div>
                  <div className="text-xs font-bold text-gov-text">
                    {currentlyServing.farmerId?.name} ({currentlyServing.cropType})
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-gov-muted italic">No farmer currently at counter</div>
              )}
            </div>

            {/* Next Up Box */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="text-[10px] uppercase font-bold text-amber-900 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Next In Line ({waitingCount} waiting)</span>
                </span>
              </div>
              {nextWaiting ? (
                <div className="mt-1">
                  <div className="text-xl font-mono font-black text-amber-950">
                    {nextWaiting.tokenNumber}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {nextWaiting.farmerId?.name} ({nextWaiting.cropType})
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-gov-muted italic">No checked-in farmers waiting</div>
              )}
            </div>
          </div>

          {/* Large Action Button */}
          <div className="py-3">
            <button
              onClick={handleCallNext}
              disabled={calling || waitingCount === 0}
              className="w-36 h-36 rounded-full btn-primary-red flex flex-col items-center justify-center mx-auto transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Volume2 className="w-11 h-11 mb-1" />
              <span className="font-heading font-black text-xs uppercase tracking-wider">
                {calling ? 'Broadcasting...' : 'CALL NEXT'}
              </span>
            </button>
            {waitingCount === 0 && (
              <p className="text-[11px] text-gov-muted mt-2">
                Check-in farmers to queue first before calling next.
              </p>
            )}
          </div>

          {/* Message Banner */}
          {msg.text && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold text-left flex items-start space-x-2 ${
                msg.type === 'success'
                  ? 'badge-green-light border border-green-300 text-gov-green'
                  : 'bg-red-50 border border-red-300 text-gov-red'
              }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-gov-green shrink-0 mt-0.5" />
              ) : (
                <span className="text-gov-red font-black shrink-0">⚠️</span>
              )}
              <span>{msg.text}</span>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CallNextFarmer;
