import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FileCheck, Ticket, CheckCircle2, Calculator, AlertCircle } from 'lucide-react';
import { procurementApi } from '../../api/procurement.api';
import { queueApi } from '../../api/queue.api';
import { useAuth } from '../../context/AuthContext';

export const ProcurementEntry = () => {
  const { user } = useAuth();
  const [tokenNo, setTokenNo] = useState('');
  const [cropType, setCropType] = useState('Wheat');
  const [actualQty, setActualQty] = useState(50);
  const [grade, setGrade] = useState('Grade A');
  const [moisture, setMoisture] = useState(11.5);
  const [mspPrice, setMspPrice] = useState(2275);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeTickets, setActiveTickets] = useState([]);

  const centreId = user?.centreId?._id || user?.centreId;

  useEffect(() => {
    if (centreId) {
      queueApi.getLiveQueue(centreId)
        .then((res) => {
          const data = res.data || res;
          const list = [
            ...(data.currentlyServing ? [data.currentlyServing] : []),
            ...(data.checkedInWaiting || []),
            ...(data.upcomingBooked || []),
          ];
          setActiveTickets(list);
          if (data.currentlyServing) {
            setTokenNo(data.currentlyServing.tokenNumber);
            setCropType(data.currentlyServing.cropType || 'Wheat');
            setActualQty(data.currentlyServing.estimatedQuantityQuintals || 50);
          } else if (list.length > 0) {
            setTokenNo(list[0].tokenNumber);
            setCropType(list[0].cropType || 'Wheat');
            setActualQty(list[0].estimatedQuantityQuintals || 50);
          }
        })
        .catch(() => {});
    }
  }, [centreId]);

  const handleSelectToken = (selectedTok) => {
    setTokenNo(selectedTok);
    const found = activeTickets.find((t) => t.tokenNumber === selectedTok);
    if (found) {
      if (found.cropType) setCropType(found.cropType);
      if (found.estimatedQuantityQuintals) setActualQty(found.estimatedQuantityQuintals);
    }
  };

  const calculatedTotal = (parseFloat(actualQty || 0) * parseFloat(mspPrice || 0)).toLocaleString('en-IN');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      await procurementApi.recordProcurement({
        tokenNumber: tokenNo.trim(),
        actualQuantityQuintals: Number(actualQty),
        qualityGrade: grade,
        moisturePercentage: Number(moisture),
        mspPricePerQuintal: Number(mspPrice),
      });

      setMsg({
        type: 'success',
        text: `Success! Complete procurement record logged for ${tokenNo}. Total MSP: ₹${calculatedTotal}. Marked COMPLETED & dispatched for DBT payment approval.`,
      });
    } catch (err) {
      setMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to submit procurement record',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Complete Procurement Entry Screen"
      subtitle="Finalize crop weighment, MSP rate calculation, and dispatch record for DBT payment approval"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading flex items-center space-x-1">
              <FileCheck className="w-3.5 h-3.5 text-gov-red mr-1" />
              <span>Final Procurement Record Entry</span>
            </span>
            <h2 className="text-lg font-bold font-heading text-gov-text mt-0.5">
              Submit Official MSP Grain Procurement Form
            </h2>
          </div>

          {msg.text && (
            <div
              className={`p-3.5 rounded-xl text-xs font-bold flex items-start space-x-2 ${
                msg.type === 'success'
                  ? 'badge-green-light border border-green-300 text-gov-green'
                  : 'bg-red-50 border border-red-300 text-gov-red'
              }`}
            >
              {msg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-gov-green shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-gov-red shrink-0 mt-0.5" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gov-text">
                  Token Serial Number *
                </label>
                {activeTickets.length > 0 && (
                  <span className="text-[11px] text-gov-muted">
                    Active tokens at centre ({activeTickets.length})
                  </span>
                )}
              </div>

              {activeTickets.length > 0 && (
                <div className="mb-2">
                  <select
                    value={tokenNo}
                    onChange={(e) => handleSelectToken(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gov-border rounded-lg text-xs font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none shadow-2xs"
                  >
                    <option value="">-- Choose from active centre queue tokens --</option>
                    {activeTickets.map((t) => (
                      <option key={t._id} value={t.tokenNumber}>
                        {t.tokenNumber} - {t.farmerId?.name || 'Farmer'} ({t.cropType}, {t.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="relative">
                <Ticket className="w-4 h-4 text-gov-red absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. TOK-KNL01-20260911-001"
                  value={tokenNo}
                  onChange={(e) => handleSelectToken(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Crop Type *</label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                >
                  <option value="Wheat">Wheat (गेहूँ)</option>
                  <option value="Paddy">Paddy (धान)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Chana">Chana (चना)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Actual Weighment (Quintals) *</label>
                <input
                  type="number"
                  required
                  value={actualQty}
                  onChange={(e) => setActualQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Quality Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                >
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Grade C">Grade C</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Moisture (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">MSP Rate (₹/Quintal)</label>
                <input
                  type="number"
                  value={mspPrice}
                  onChange={(e) => setMspPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Payment Banner */}
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-gov-green" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-gov-green block">Total Payable MSP Amount</span>
                  <span className="text-xl font-bold font-heading text-gov-green">₹{calculatedTotal}</span>
                </div>
              </div>
              <span className="text-xs text-gov-green font-bold">Auto-Calculated</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} variant="primary">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {submitting ? 'Finalizing Record...' : 'Finalize & Mark Procurement Completed'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProcurementEntry;
