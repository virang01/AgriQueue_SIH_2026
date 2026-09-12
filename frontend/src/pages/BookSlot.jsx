import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Building2, Plus, ArrowLeft } from 'lucide-react';
import { centreApi } from '../api/centre.api';
import { slotApi } from '../api/slot.api';
import Button from '../components/Button';
import Card from '../components/Card';

export const BookSlot = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [cropType, setCropType] = useState('Wheat');
  const [estimatedQty, setEstimatedQty] = useState(50);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    centreApi
      .getAllCentres()
      .then((res) => {
        const list = res.centres || res.data?.centres || [];
        setCentres(list);
        if (list.length > 0) setSelectedCentre(list[0]._id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedCentre && bookingDate) {
      slotApi
        .getAvailableSlots(selectedCentre, bookingDate)
        .then((res) => {
          const list = res.slots || res.data?.slots || [];
          setAvailableSlots(list);
          const firstAvailable = list.find((s) => (s.bookedFarmers || 0) < (s.maxFarmers || 5));
          if (firstAvailable) {
            setSelectedSlotId(firstAvailable._id);
          } else {
            setSelectedSlotId('');
          }
        })
        .catch(() => setAvailableSlots([]));
    }
  }, [selectedCentre, bookingDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedSlotId) {
      setError('Please select an active time slot');
      return;
    }

    const currentSlot = availableSlots.find((s) => s._id === selectedSlotId);
    if (currentSlot) {
      const maxF = currentSlot.maxFarmers || 5;
      if ((currentSlot.bookedFarmers || 0) >= maxF) {
        setError(`This time slot is already fully booked (${currentSlot.bookedFarmers}/${maxF}). Please select another slot.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await slotApi.bookSlot({
        slotId: selectedSlotId,
        cropType,
        estimatedQuantityQuintals: Number(estimatedQty),
      });

      const token = res.booking?.tokenNumber || res.data?.booking?.tokenNumber || 'TOK-GEN';
      setSuccessMsg(`Success! Slot booked. Token Pass: ${token}`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book procurement slot');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 my-10 font-body text-gov-text bg-white pb-16 animate-fade-in-up">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 inline-flex items-center space-x-1.5 text-xs font-bold font-heading text-gov-red hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <Card accent="red" hover={false} className="hero-container-shadow space-y-6">
        <div className="border-b border-gov-border pb-4">
          <span className="text-xs uppercase tracking-wider text-gov-red font-bold font-heading">
            Official Grain Procurement
          </span>
          <h1 className="text-2xl font-bold font-heading text-gov-text mt-0.5">
            Book Procurement Slot Token
          </h1>
          <p className="text-xs text-gov-muted">
            Select your nearest government procurement centre, date, and crop yield estimate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-gov-red text-xs rounded-lg font-semibold">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-lg font-bold">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gov-text mb-1 flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-gov-red" />
              <span>Select Procurement Centre *</span>
            </label>
            <select
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              {centres.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.district}, {c.state})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-gov-red" />
                <span>Procurement Date *</span>
              </label>
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
              <label className="block text-xs font-semibold text-gov-text mb-1">Crop Type *</label>
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
            <label className="block text-xs font-semibold text-gov-text mb-1">
              Estimated Crop Quantity (Quintals) *
            </label>
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
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gov-text">
                Available Time Windows *
              </label>
              <span className="text-[11px] text-gov-muted font-medium">
                Capacity Limit: <strong className="text-gov-red font-bold">Max 5 Farmers</strong> per window
              </span>
            </div>

            {availableSlots.length === 0 ? (
              <p className="text-xs text-gov-red bg-red-50 p-3 rounded-lg border border-red-200 font-semibold">
                No active slots generated for date {bookingDate}. Contact centre manager.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSlots.map((s) => {
                  const maxF = s.maxFarmers || 5;
                  const booked = s.bookedFarmers || 0;
                  const isFull = booked >= maxF;
                  const isSelected = selectedSlotId === s._id;

                  return (
                    <button
                      type="button"
                      key={s._id}
                      disabled={isFull}
                      onClick={() => !isFull && setSelectedSlotId(s._id)}
                      className={`p-3.5 rounded-xl border text-xs text-left font-semibold transition-all relative overflow-hidden ${
                        isFull
                          ? 'bg-slate-100/90 border-slate-200 text-slate-400 cursor-not-allowed opacity-65'
                          : isSelected
                          ? 'btn-primary-red shadow-sm'
                          : 'bg-gov-gray text-gov-text border-gov-border hover:border-gov-red cursor-pointer'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-heading font-bold text-sm">
                          {s.startTime} - {s.endTime}
                        </div>
                        {isFull ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200 rounded-md">
                            FULL (5/5)
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {maxF - booked} available
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex items-center justify-between text-[11px]">
                        <span className={isSelected ? 'text-white/90' : isFull ? 'text-slate-400' : 'text-gov-muted'}>
                          Farmer Counter:
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isSelected
                              ? 'text-white'
                              : isFull
                              ? 'text-red-500 font-extrabold'
                              : 'text-gov-text'
                          }`}
                        >
                          {booked} / {maxF} Booked
                        </span>
                      </div>

                      {/* Visual progress meter */}
                      <div className="mt-2 w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isFull
                              ? 'bg-red-500 w-full'
                              : isSelected
                              ? 'bg-white'
                              : 'bg-gov-red'
                          }`}
                          style={{ width: `${Math.min(100, (booked / maxF) * 100)}%` }}
                        />
                      </div>

                      {isFull && (
                        <div className="mt-1 text-[10px] text-red-600 font-bold tracking-tight">
                          ⛔ Time zone booked. No other farmer can register.
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !selectedSlotId || availableSlots.find((s) => s._id === selectedSlotId)?.bookedFarmers >= (availableSlots.find((s) => s._id === selectedSlotId)?.maxFarmers || 5)}
              variant="primary"
            >
              {submitting ? 'Generating Token...' : 'Confirm Slot Booking'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default BookSlot;
