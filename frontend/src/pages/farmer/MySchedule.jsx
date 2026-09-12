import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { Calendar as CalendarIcon, Clock, Building2, ChevronRight, Plus } from 'lucide-react';
import { queueApi } from '../../api/queue.api';
import { useNavigate } from 'react-router-dom';

export const MySchedule = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | upcoming | completed

  useEffect(() => {
    queueApi
      .getMyBookings()
      .then((res) => setBookings(res.bookings || res.data?.bookings || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'upcoming') return b.status === 'scheduled' || b.status === 'checked_in' || b.status === 'in_progress';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <DashboardLayout
      title="My Slot Schedule"
      subtitle="Comprehensive timetable of your upcoming and past grain procurement appointments"
    >
      <div className="space-y-6">
        {/* Header & Quick Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gov-border">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-heading transition-all ${filter === 'all' ? 'bg-gov-red text-white' : 'bg-gov-gray text-gov-text hover:bg-slate-200'
                }`}
            >
              All Slots ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-heading transition-all ${filter === 'upcoming' ? 'bg-gov-red text-white' : 'bg-gov-gray text-gov-text hover:bg-slate-200'
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-heading transition-all ${filter === 'completed' ? 'bg-gov-red text-white' : 'bg-gov-gray text-gov-text hover:bg-slate-200'
                }`}
            >
              Completed
            </button>
          </div>
          <Button variant="primary" onClick={() => navigate('/book-slot')}>
            <Plus className="w-4 h-4 mr-1" />
            Book New Slot
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gov-muted">Loading schedule...</div>
        ) : filteredBookings.length === 0 ? (
          <Card accent="red" hover={false} className="text-center py-12 space-y-3">
            <CalendarIcon className="w-10 h-10 text-gov-red mx-auto opacity-40" />
            <div className="text-sm font-bold font-heading text-gov-text">No slots found</div>
            <p className="text-xs text-gov-muted max-w-sm mx-auto">
              You don't have any booked procurement appointments matching this filter.
            </p>
            <Button variant="primary" onClick={() => navigate('/book-slot')}>
              Book Procurement Slot
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBookings.map((b) => (
              <Card key={b._id} accent={b.status === 'completed' ? 'green' : 'red'} className="space-y-4">
                <div className="flex items-center justify-between border-b border-gov-border pb-3">
                  <div>
                    <span className="text-[10px] text-gov-muted uppercase font-bold tracking-wider block">Token Pass</span>
                    <span className="font-mono text-base font-bold text-gov-red">{b.tokenNumber}</span>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="space-y-2 text-xs text-gov-text">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-gov-red flex-shrink-0" />
                    <span className="font-semibold">{b.centreId?.name || 'Procurement Centre'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gov-muted flex-shrink-0" />
                    <span>{new Date(b.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gov-muted flex-shrink-0" />
                    <span className="font-semibold text-gov-red">{b.slotId?.startTime || '08:00'} - {b.slotId?.endTime || '10:00'}</span>
                  </div>
                </div>

                <div className="bg-gov-gray p-2.5 rounded-lg flex items-center justify-between text-xs font-heading">
                  <div>
                    <span className="text-gov-muted block text-[10px]">Crop & Quantity</span>
                    <span className="font-bold text-gov-text">{b.cropType} ({b.estimatedQuantityQuintals} Qtl)</span>
                  </div>
                  <button
                    onClick={() => navigate('/dashboard/my-token')}
                    className="text-gov-red hover:underline font-bold text-xs inline-flex items-center"
                  >
                    View Pass <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MySchedule;
