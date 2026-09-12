import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { GitCommit, CheckCircle2, Clock, ShieldCheck, Scale, Award, CreditCard, ChevronRight } from 'lucide-react';
import { queueApi } from '../../api/queue.api';

export const TrackProcurement = () => {
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    queueApi
      .getMyBookings()
      .then((res) => {
        const list = res.bookings || res.data?.bookings || [];
        setActiveBooking(list[0] || null);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // Determine current active step (0 to 4)
  const getStepIndex = (status) => {
    switch (status) {
      case 'scheduled':
        return 0;
      case 'checked_in':
        return 1;
      case 'in_progress':
        return 2;
      case 'completed':
        return 3;
      case 'paid':
        return 4;
      default:
        return 1;
    }
  };

  const currentStep = activeBooking ? getStepIndex(activeBooking.status) : 1;

  const steps = [
    { title: 'Slot Scheduled', desc: 'Appointment booked', icon: Clock },
    { title: 'Gate Checked-In', desc: 'Token scanned at entrance', icon: CheckCircle2 },
    { title: 'Quality Check', desc: 'Moisture & grade inspected', icon: Award },
    { title: 'Weight Recorded', desc: 'Scale weighment saved', icon: Scale },
    { title: 'DBT Payment', desc: 'Direct bank transfer sent', icon: CreditCard },
  ];

  return (
    <DashboardLayout
      title="Track Live Procurement Stepper"
      subtitle="Real-time end-to-end status tracking from gate check-in to bank payment disbursement"
    >
      {loading ? (
        <div className="py-12 text-center text-xs text-gov-muted">Loading procurement status...</div>
      ) : !activeBooking ? (
        <Card accent="red" hover={false} className="text-center py-12">
          <GitCommit className="w-10 h-10 text-gov-red mx-auto opacity-40 mb-2" />
          <div className="text-sm font-bold font-heading text-gov-text">No active procurement found</div>
          <p className="text-xs text-gov-muted">Book a procurement slot to track live weighment progress.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Booking Ticket Header */}
          <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gov-border pb-3 gap-2">
              <div>
                <span className="text-[10px] text-gov-red uppercase font-bold tracking-wider font-heading">
                  Active Procurement Tracking
                </span>
                <h2 className="text-xl font-bold font-mono text-gov-text">
                  TOKEN: {activeBooking.tokenNumber}
                </h2>
              </div>
              <StatusBadge status={activeBooking.status} />
            </div>

            {/* Horizontal Stepper */}
            <div className="py-6">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isPassed = idx <= currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div
                      key={step.title}
                      className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all ${isCurrent
                          ? 'bg-red-50 border-gov-red text-gov-red shadow-xs scale-[1.02]'
                          : isPassed
                            ? 'bg-green-50 border-green-300 text-gov-green'
                            : 'bg-gov-gray border-gov-border text-gov-muted opacity-60'
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-2 ${isCurrent
                            ? 'bg-gov-red text-white'
                            : isPassed
                              ? 'bg-gov-green text-white'
                              : 'bg-gov-border text-gov-muted'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-xs font-bold font-heading">{step.title}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Details Summary Card */}
            <div className="bg-gov-gray p-4 rounded-xl border border-gov-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-heading">
              <div>
                <span className="text-gov-muted text-[10px] uppercase font-bold block">Centre</span>
                <span className="font-bold text-gov-text">{activeBooking.centreId?.name || 'Karnal Mandi'}</span>
              </div>
              <div>
                <span className="text-gov-muted text-[10px] uppercase font-bold block">Crop</span>
                <span className="font-bold text-gov-text">{activeBooking.cropType}</span>
              </div>
              <div>
                <span className="text-gov-muted text-[10px] uppercase font-bold block">Est. Yield</span>
                <span className="font-bold text-gov-text">{activeBooking.estimatedQuantityQuintals} Quintals</span>
              </div>
              <div>
                <span className="text-gov-muted text-[10px] uppercase font-bold block">Scheduled Slot</span>
                <span className="font-bold text-gov-red">{activeBooking.slotId?.startTime || '08:00'} AM</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TrackProcurement;
