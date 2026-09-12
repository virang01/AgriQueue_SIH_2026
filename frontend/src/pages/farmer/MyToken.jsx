import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { Ticket, QrCode, Building2, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { queueApi } from '../../api/queue.api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MyToken = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) {
      queueApi
        .getMyBookings()
        .then((res) => {
          const list = res.bookings || res.data?.bookings || [];
          const active = list.find(
            (b) => b.status === 'scheduled' || b.status === 'checked_in' || b.status === 'in_progress'
          ) || list[0];
          setActiveBooking(active || null);
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    }
  }, [user?._id]);

  return (
    <DashboardLayout
      title="My Active Token Pass"
      subtitle="Official high-contrast digital token ticket for gate check-in and weighment counter"
    >
      {loading ? (
        <div className="py-12 text-center text-xs text-gov-muted">Loading active token pass...</div>
      ) : !activeBooking ? (
        <Card accent="red" hover={false} className="text-center py-12 space-y-4 max-w-lg mx-auto">
          <Ticket className="w-12 h-12 text-gov-red mx-auto opacity-40" />
          <h2 className="text-lg font-bold font-heading text-gov-text">No Active Token Pass Found</h2>
          <p className="text-xs text-gov-muted">
            You do not currently have an active booked slot for today's procurement.
          </p>
          <Button variant="primary" onClick={() => navigate('/book-slot')}>
            Book Slot Now
          </Button>
        </Card>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main High-Contrast Token Ticket Card */}
          <Card accent="red" hover={false} className="bg-white hero-container-shadow space-y-6 border-2 border-gov-red overflow-hidden">
            {/* Header Ribbon */}
            <div className="bg-gov-red text-white p-4 -m-6 mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5" />
                <span className="font-bold font-heading text-sm uppercase tracking-wide">
                  Official Gate Entry Pass
                </span>
              </div>
              <span className="bg-white text-gov-red font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                VERIFIED
              </span>
            </div>

            {/* Large Token Display Board */}
            <div className="bg-gradient-to-br from-red-50 via-white to-red-100/60 p-6 rounded-2xl text-center space-y-3 font-mono shadow-xs border-2 border-red-200">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 font-heading block">
                TOKEN SERIAL NUMBER
              </span>
              <div className="text-3xl sm:text-4xl font-black tracking-wider text-gov-red bg-white px-6 py-2.5 rounded-xl inline-block border-2 border-red-300 shadow-xs">
                {activeBooking.tokenNumber}
              </div>
              <div className="flex justify-center items-center space-x-2 pt-1">
                <StatusBadge status={activeBooking.status} />
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-heading border-t border-b border-gov-border py-4">
              <div>
                <span className="text-gov-muted block text-[10px] uppercase font-bold">Procurement Centre</span>
                <span className="font-bold text-gov-text text-sm flex items-center mt-0.5">
                  <Building2 className="w-4 h-4 text-gov-red mr-1.5 flex-shrink-0" />
                  {activeBooking.centreId?.name || 'Karnal Anaj Mandi'}
                </span>
              </div>
              <div>
                <span className="text-gov-muted block text-[10px] uppercase font-bold">Slot Window</span>
                <span className="font-bold text-gov-red text-sm flex items-center mt-0.5">
                  <Clock className="w-4 h-4 text-gov-red mr-1.5 flex-shrink-0" />
                  {activeBooking.slotId?.startTime || '08:00'} - {activeBooking.slotId?.endTime || '10:00'}
                </span>
              </div>
              <div>
                <span className="text-gov-muted block text-[10px] uppercase font-bold">Crop & Estimated Yield</span>
                <span className="font-semibold text-gov-text">
                  {activeBooking.cropType} ({activeBooking.estimatedQuantityQuintals} Quintals)
                </span>
              </div>
              <div>
                <span className="text-gov-muted block text-[10px] uppercase font-bold">Booking Date</span>
                <span className="font-semibold text-gov-text">
                  {new Date(activeBooking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Simulated QR Code for Gate Scanner */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-gov-gray p-4 rounded-xl border border-gov-border gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-white p-2 border border-gov-border rounded-xl flex items-center justify-center text-gov-text shadow-xs">
                  <QrCode className="w-12 h-12 text-gov-text" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gov-text font-heading">Digital Gate Scanner QR</div>
                  <div className="text-[11px] text-gov-muted">Show this QR to Centre Gate Staff upon arrival.</div>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate('/dashboard/live-queue')}>
                View Live Queue <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyToken;
