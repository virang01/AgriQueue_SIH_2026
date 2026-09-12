import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Search, UserCheck, Scale, Volume2 } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';

const StaffDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [queue, setQueue] = useState(null);
  const [procurementRecords, setProcurementRecords] = useState([]);
  const [tokenInput, setTokenInput] = useState('');
  const [checkInMsg, setCheckInMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);

  // Weighment Form State
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actualQty, setActualQty] = useState('');
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [moisture, setMoisture] = useState(11.5);
  const [mspPrice, setMspPrice] = useState(2275);
  const [notes, setNotes] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  const fetchStaffData = async () => {
    if (!user?.centreId?._id) return;
    setLoading(true);
    try {
      const [resQueue, resHistory] = await Promise.all([
        axios.get(`/api/queue/live?centreId=${user.centreId._id}`),
        axios.get(`/api/procurement?centreId=${user.centreId._id}`),
      ]);
      setQueue(resQueue.data);
      setProcurementRecords(resHistory.data.records || []);

      if (resQueue.data.currentlyServing) {
        setSelectedTicket(resQueue.data.currentlyServing);
        setActualQty(resQueue.data.currentlyServing.estimatedQuantityQuintals || 50);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, [user]);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setCheckInMsg({ type: '', text: '' });

    if (!tokenInput) return;

    try {
      const res = await axios.post('/api/queue/check-in', { tokenNumber: tokenInput.trim() });
      setCheckInMsg({ type: 'success', text: res.data.message });
      setTokenInput('');
      fetchStaffData();
    } catch (err) {
      setCheckInMsg({ type: 'error', text: err.response?.data?.message || 'Check-in failed' });
    }
  };

  const handleCallNext = async (ticketId) => {
    try {
      const res = await axios.post('/api/queue/call-next', { bookingId: ticketId });
      alert(`Token Called: ${res.data.booking.tokenNumber}. Turn SMS sent to farmer!`);
      fetchStaffData();
    } catch (err) {
      alert(err.response?.data?.message || 'Call next failed');
    }
  };

  const handleRecordWeighment = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setSubmitMsg('');

    try {
      await axios.post('/api/procurement', {
        bookingId: selectedTicket._id,
        actualQuantityQuintals: Number(actualQty),
        qualityGrade,
        moisturePercentage: Number(moisture),
        mspPricePerQuintal: Number(mspPrice),
        notes,
      });

      setSubmitMsg('Procurement weighment recorded! Payment ticket created awaiting approval.');
      setSelectedTicket(null);
      fetchStaffData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record procurement');
    }
  };

  const baseAmt = Number(actualQty || 0) * Number(mspPrice || 2275);
  let deductionPct = 0;
  if (qualityGrade === 'Grade B') deductionPct = 5;
  if (qualityGrade === 'Grade C') deductionPct = 15;
  if (qualityGrade === 'Rejected') deductionPct = 100;
  const finalCalculatedAmt = Math.max(0, baseAmt - (baseAmt * deductionPct) / 100);

  return (
    <DashboardLayout title="Staff Dashboard Overview" subtitle="Centre Operational Control & Weighment Counter">
      <div className="space-y-8 text-gov-text">
        {/* Staff Header */}
        <div className="relative bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] border-2 border-gov-red text-gov-text p-6 sm:p-8 rounded-2xl hero-container-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden">
          {/* Soft Decorative Blurred Red Circle */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-200/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative">
            <span className="text-xs uppercase tracking-wider text-gov-red font-bold font-heading">{t('roles.staff')} Portal</span>
            <h1 className="text-2xl font-bold font-heading text-gov-text mt-0.5">{user.name}</h1>
            <p className="text-xs text-gov-muted">
              Centre: <span className="font-semibold text-gov-text">{user.centreId?.name || 'Karnal Centre'} ({user.centreId?.code})</span>
            </p>
          </div>

          <div className="relative bg-white px-4 py-2.5 rounded-xl border border-red-200 text-right font-heading shadow-2xs">
            <div className="text-[10px] text-slate-700 uppercase font-extrabold tracking-wider">Currently Serving</div>
            <div className="text-xl font-mono font-black text-gov-red mt-0.5">
              {queue?.currentlyServing ? queue.currentlyServing.tokenNumber : 'None'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Check-in & Queue Caller */}
          <div className="space-y-6">
            {/* Check In Box */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h2 className="text-base font-bold font-heading text-gov-text flex items-center space-x-2 border-b border-gov-border pb-3">
                <UserCheck className="w-5 h-5 text-gov-red" />
                <span>{t('staff.checkin_section')}</span>
              </h2>

              {checkInMsg.text && (
                <div className={`p-3 rounded-lg text-xs font-semibold ${checkInMsg.type === 'success' ? 'badge-green-light border border-green-300' : 'badge-red-light border border-red-300'}`}>
                  {checkInMsg.text}
                </div>
              )}

              <form onSubmit={handleCheckIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">{t('staff.enter_token')}</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gov-muted absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="e.g. TOK-KNL01-20260910-001"
                      className="w-full pl-9 pr-3 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 btn-primary-red font-bold font-heading text-xs rounded-lg shadow-xs transition-all"
                >
                  {t('staff.checkin_btn')}
                </button>
              </form>
            </div>

            {/* Checked-In Waiting List & Call Next */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h2 className="text-base font-bold font-heading text-gov-text flex items-center justify-between border-b border-gov-border pb-3">
                <span>{t('queue.waiting_in_queue')}</span>
                <span className="bg-gov-amber-light text-amber-900 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {queue?.checkedInWaiting?.length || 0}
                </span>
              </h2>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {queue?.checkedInWaiting?.length === 0 ? (
                  <p className="text-xs text-gov-muted text-center py-4">No tickets ready in check-in line.</p>
                ) : (
                  queue?.checkedInWaiting?.map((item) => (
                    <div key={item._id} className="p-3.5 bg-gov-amber-light rounded-xl border border-amber-200 flex items-center justify-between transition-all hover:border-amber-300">
                      <div>
                        <div className="text-xs font-mono font-bold text-gov-text">{item.tokenNumber}</div>
                        <div className="text-xs text-gov-text">{item.farmerId?.name} ({item.cropType})</div>
                      </div>
                      <button
                        onClick={() => handleCallNext(item._id)}
                        className="px-3 py-1.5 btn-primary-red font-bold font-heading text-xs rounded-lg shadow-xs flex items-center space-x-1 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-white" />
                        <span>{t('staff.call_next_btn')}</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Weighment & Quality Inspection Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h2 className="text-lg font-bold font-heading text-gov-text flex items-center space-x-2 border-b border-gov-border pb-3">
                <Scale className="w-5 h-5 text-gov-red" />
                <span>{t('staff.record_procurement')}</span>
              </h2>

              {submitMsg && (
                <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-lg font-bold">
                  {submitMsg}
                </div>
              )}

              {!selectedTicket ? (
                <div className="p-8 text-center bg-gov-gray rounded-xl border border-dashed border-gov-border text-gov-muted text-xs">
                  Call or select a ticket currently in inspection to fill out weighment details.
                </div>
              ) : (
                <form onSubmit={handleRecordWeighment} className="space-y-4">
                  <div className="bg-gov-gray border border-gov-border text-gov-text p-4 rounded-xl flex justify-between items-center text-xs font-heading">
                    <div>
                      <span className="text-gov-muted">Token: </span>
                      <span className="font-mono font-bold text-gov-red">{selectedTicket.tokenNumber}</span>
                    </div>
                    <div>
                      <span className="text-gov-muted">Farmer: </span>
                      <span className="font-bold">{selectedTicket.farmerId?.name}</span>
                    </div>
                    <div>
                      <span className="text-gov-muted">Crop: </span>
                      <span className="font-bold text-gov-text">{selectedTicket.cropType}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gov-text mb-1">{t('staff.actual_qty')} *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={actualQty}
                        onChange={(e) => setActualQty(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm font-bold text-gov-text focus:ring-2 focus:ring-gov-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gov-text mb-1">{t('staff.quality_grade')} *</label>
                      <select
                        value={qualityGrade}
                        onChange={(e) => setQualityGrade(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm font-bold text-gov-text focus:ring-2 focus:ring-gov-red"
                      >
                        <option value="Grade A">Grade A (Standard MSP - 100%)</option>
                        <option value="Grade B">Grade B (5% Deduction)</option>
                        <option value="Grade C">Grade C (15% Deduction)</option>
                        <option value="Rejected">Rejected (Substandard Quality)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gov-text mb-1">{t('staff.moisture')}</label>
                      <input
                        type="number"
                        step="0.1"
                        value={moisture}
                        onChange={(e) => setMoisture(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gov-text mb-1">{t('staff.msp_price')}</label>
                      <input
                        type="number"
                        value={mspPrice}
                        onChange={(e) => setMspPrice(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text focus:ring-2 focus:ring-gov-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gov-text mb-1">Inspector Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Grain moisture acceptable, clean sample"
                      className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs text-gov-text"
                    />
                  </div>

                  {/* Calculation Summary Box */}
                  <div className="bg-gov-gray p-4 rounded-xl border border-gov-border flex justify-between items-center text-gov-text">
                    <div>
                      <div className="text-xs text-gov-muted font-semibold">{t('staff.calculated_amount')}</div>
                      <div className="text-2xl font-bold font-heading text-gov-green">₹{finalCalculatedAmt.toLocaleString()}</div>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 btn-primary-red font-bold font-heading text-xs rounded-lg shadow-xs transition-all"
                    >
                      {t('staff.submit_weighment')}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Recent Inspection Log Table */}
            <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
              <h2 className="text-base font-bold font-heading text-gov-text border-b border-gov-border pb-2">Recent Procurement Entries Log</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gov-text">
                  <thead className="bg-gov-gray text-gov-text font-bold font-heading uppercase text-[10px] border-b border-gov-border">
                    <tr>
                      <th className="p-3">Farmer</th>
                      <th className="p-3">Crop</th>
                      <th className="p-3">Qty (Qtl)</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">Total Payable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gov-border">
                    {procurementRecords.slice(0, 5).map((r) => (
                      <tr key={r._id} className="hover:bg-gov-gray transition-colors">
                        <td className="p-3 font-semibold">{r.farmerId?.name}</td>
                        <td className="p-3">{r.cropType}</td>
                        <td className="p-3 font-mono">{r.actualQuantityQuintals}</td>
                        <td className="p-3"><span className="bg-gov-gray border border-gov-border text-gov-text px-2 py-0.5 rounded font-bold">{r.qualityGrade}</span></td>
                        <td className="p-3 font-bold text-gov-green">₹{r.totalAmount?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
