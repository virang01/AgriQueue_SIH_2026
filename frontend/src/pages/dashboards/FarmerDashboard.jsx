import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Plus, Ticket, Landmark, Trash2 } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCentre, setSelectedCentre] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [cropType, setCropType] = useState('Wheat');
  const [estimatedQty, setEstimatedQty] = useState(50);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const [resBookings, resPayments, resCentres] = await Promise.all([
        axios.get('/api/queue/my-bookings'),
        axios.get('/api/payments'),
        axios.get('/api/centres'),
      ]);
      setBookings(resBookings.data.bookings || []);
      setPayments(resPayments.data.payments || []);
      const centreList = resCentres.data.centres || [];
      setCentres(centreList);
      if (centreList.length > 0 && !selectedCentre) {
        setSelectedCentre(centreList[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchFarmerData();
    }
  }, [user?._id]);

  useEffect(() => {
    if (selectedCentre && bookingDate) {
      axios
        .get(`/api/slots?centreId=${selectedCentre}&date=${bookingDate}`)
        .then((res) => {
          setAvailableSlots(res.data.slots || []);
          if (res.data.slots?.length > 0) {
            setSelectedSlotId(res.data.slots[0]._id);
          } else {
            setSelectedSlotId('');
          }
        })
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedCentre, bookingDate]);

  const handleBookSlot = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!selectedSlotId) {
      setBookingError('Please select a valid time slot');
      return;
    }

    try {
      const res = await axios.post('/api/slots/book', {
        slotId: selectedSlotId,
        cropType,
        estimatedQuantityQuintals: Number(estimatedQty),
      });

      setBookingSuccess(`Success! Token Generated: ${res.data.booking.tokenNumber}`);
      fetchFarmerData();
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess('');
      }, 2000);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to book slot');
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this procurement booking?')) {
      try {
        await axios.put(`/api/queue/${id}/cancel`);
        fetchFarmerData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to cancel');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'booked':
        return <span className="badge-amber-light border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">Slot Booked</span>;
      case 'checked_in':
        return <span className="bg-amber-200 text-amber-950 border border-amber-400 text-xs px-2.5 py-0.5 rounded-full font-bold">Checked In</span>;
      case 'in_inspection':
        return <span className="badge-red-light border border-red-300 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">In Inspection</span>;
      case 'weighment_completed':
        return <span className="badge-green-light border border-green-300 text-xs px-2.5 py-0.5 rounded-full font-bold">Weighment Complete</span>;
      case 'completed':
        return <span className="bg-gov-green text-white text-xs px-2.5 py-0.5 rounded-full font-bold">Completed & Paid</span>;
      case 'cancelled':
        return <span className="bg-gov-gray text-gov-muted border border-gov-border text-xs px-2.5 py-0.5 rounded-full font-medium">Cancelled</span>;
      default:
        return <span className="bg-gov-gray text-gov-text text-xs px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <DashboardLayout title="Farmer Dashboard Overview" subtitle="Smart grain procurement slot status and active token management">
      <div className="space-y-8 text-gov-text">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] border-2 border-gov-red text-gov-text p-6 sm:p-8 rounded-2xl hero-container-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden">
          {/* Soft Decorative Blurred Red Circle */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-200/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative">
            <span className="text-xs uppercase tracking-wider text-gov-red font-bold font-heading">Farmer Portal</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-gov-text mt-0.5">Namaste, {user.name}! 🌾</h1>
            <p className="text-xs text-gov-muted mt-1">
              District: {user.farmerDetails?.district || 'Haryana'} • SMS Alert Phone: {user.phone} ({user.preferredLanguage?.toUpperCase()})
            </p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => navigate('/book-slot')}
            className="relative px-6 py-3.5 btn-primary-red font-bold font-heading text-sm rounded-lg flex items-center space-x-2 transition-all shadow-xs hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-white" />
            <span>{t('farmer.book_slot_title')}</span>
          </button>
        </div>

        {/* Active Tickets Section */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
          <div className="flex justify-between items-center border-b border-gov-border pb-3">
            <h2 className="text-lg font-bold font-heading text-gov-text flex items-center space-x-2">
              <Ticket className="w-5 h-5 text-gov-red" />
              <span>{t('farmer.my_tickets')}</span>
            </h2>
            <span className="text-xs text-gov-muted font-medium">Total Bookings: {bookings.length}</span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 text-gov-muted space-y-3">
              <p className="text-sm">{t('farmer.no_tickets')}</p>
              <button
                onClick={() => navigate('/book-slot')}
                className="text-xs font-bold font-heading text-gov-red hover:underline cursor-pointer"
              >
                Book your first procurement slot now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-gov-gray p-5 rounded-xl border border-gov-border border-l-4 border-l-gov-red space-y-3 relative card-hover-elevate hover:border-gov-red"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">Token Ticket</div>
                      <div className="text-sm font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-300 inline-block shadow-2xs mt-0.5">
                        {b.tokenNumber}
                      </div>
                    </div>
                    {getStatusBadge(b.status)}
                  </div>

                  <div className="text-xs space-y-1 text-gov-text">
                    <div><span className="font-semibold text-gov-muted">Centre:</span> {b.centreId?.name}</div>
                    <div><span className="font-semibold text-gov-muted">Date & Slot:</span> {b.bookingDate} ({b.slotId?.startTime} - {b.slotId?.endTime})</div>
                    <div><span className="font-semibold text-gov-muted">Crop & Qty:</span> {b.cropType} ({b.estimatedQuantityQuintals} Quintals)</div>
                  </div>

                  {b.status === 'booked' && (
                    <div className="pt-2 flex justify-end">
                      {/* Secondary Outlined Action */}
                      <button
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-1.5 btn-secondary-red text-xs font-semibold font-heading rounded flex items-center space-x-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-gov-red" />
                        <span>{t('farmer.cancel')}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Logs */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
          <h2 className="text-lg font-bold font-heading text-gov-text flex items-center space-x-2 border-b border-gov-border pb-3">
            <Landmark className="w-5 h-5 text-gov-green" />
            <span>{t('farmer.payment_history')}</span>
          </h2>

          {payments.length === 0 ? (
            <p className="text-xs text-gov-muted text-center py-6">No payment records found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray text-gov-text font-bold font-heading uppercase text-[10px] border-b border-gov-border">
                  <tr>
                    <th className="p-3">Token & Centre</th>
                    <th className="p-3">Crop & Qty</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Txn Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3 font-mono font-semibold">{p.procurementRecordId?.bookingId?.tokenNumber || 'N/A'}</td>
                      <td className="p-3">{p.procurementRecordId?.cropType} ({p.procurementRecordId?.actualQuantityQuintals} Qtl)</td>
                      <td className="p-3 font-semibold">{p.procurementRecordId?.qualityGrade}</td>
                      <td className="p-3 font-bold text-gov-green">₹{p.amount?.toLocaleString()}</td>
                      <td className="p-3">
                        {p.status === 'processed' ? (
                          <span className="badge-green-light border border-green-300 px-2.5 py-0.5 rounded-full font-bold">Processed to Bank</span>
                        ) : p.status === 'approved' ? (
                          <span className="badge-red-light border border-red-300 px-2.5 py-0.5 rounded-full font-bold">Approved</span>
                        ) : (
                          <span className="badge-amber-light border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">Awaiting Approval</span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gov-muted">{p.paymentReference || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-gov-border animate-fade-in-up">
              <div className="bg-white border-b-2 border-gov-red p-5 flex justify-between items-center">
                <h3 className="font-bold font-heading text-base text-gov-text">{t('farmer.book_slot_title')}</h3>
                <button onClick={() => setShowBookingModal(false)} className="text-gov-muted hover:text-gov-text text-lg">✕</button>
              </div>

              <form onSubmit={handleBookSlot} className="p-6 space-y-4">
                {bookingError && <div className="p-3 bg-red-50 border border-red-200 text-gov-red text-xs rounded-lg font-semibold">{bookingError}</div>}
                {bookingSuccess && <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-lg font-bold">{bookingSuccess}</div>}

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">{t('farmer.select_centre')}</label>
                  <select
                    value={selectedCentre}
                    onChange={(e) => setSelectedCentre(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                  >
                    {centres.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.district})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gov-text mb-1">{t('farmer.select_date')}</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gov-text mb-1">{t('farmer.select_crop')}</label>
                    <select
                      value={cropType}
                      onChange={(e) => setCropType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                    >
                      <option value="Wheat">Wheat (गेहूँ)</option>
                      <option value="Paddy">Paddy (धान)</option>
                      <option value="Mustard">Mustard (सरसों)</option>
                      <option value="Chana">Chana (चना)</option>
                      <option value="Pulses">Pulses (दालें)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">{t('farmer.estimated_qty')}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="500"
                    value={estimatedQty}
                    onChange={(e) => setEstimatedQty(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">{t('farmer.available_slots')}</label>
                  {availableSlots.length === 0 ? (
                    <p className="text-xs text-gov-red bg-red-50 p-3 rounded-lg border border-red-200 font-semibold">
                      No active slots for this date. Ask manager to configure slots.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {availableSlots.map((s) => {
                        const maxF = s.maxFarmers || 5;
                        const booked = s.bookedFarmers || 0;
                        const isFull = booked >= maxF;
                        return (
                          <button
                            type="button"
                            key={s._id}
                            disabled={isFull}
                            onClick={() => !isFull && setSelectedSlotId(s._id)}
                            className={`p-2.5 rounded-lg border text-xs text-left font-semibold transition-all ${
                              isFull
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                : selectedSlotId === s._id
                                ? 'btn-primary-red'
                                : 'bg-gov-gray text-gov-text border-gov-border hover:border-gov-red'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-heading">{s.startTime} - {s.endTime}</span>
                              {isFull && <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">FULL</span>}
                            </div>
                            <div className="text-[10px] opacity-80 mt-1">{booked}/{maxF} Farmers Booked</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end space-x-3 font-heading">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="px-4 py-2.5 bg-white border border-gov-border text-gov-muted hover:text-gov-text text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedSlotId}
                    className="px-6 py-2.5 btn-primary-red disabled:opacity-50 font-bold text-xs rounded-lg transition-all"
                  >
                    {t('farmer.confirm_booking')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FarmerDashboard;
