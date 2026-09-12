import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Scale, Ticket, CheckCircle2 } from 'lucide-react';

export const Weighing = () => {
  const [tokenNo, setTokenNo] = useState('TOK-KNL01-20260910-001');
  const [grossWeight, setGrossWeight] = useState(54.2);
  const [tareWeight, setTareWeight] = useState(4.2);
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const netWeight = Math.max(0, (parseFloat(grossWeight || 0) - parseFloat(tareWeight || 0))).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    setTimeout(() => {
      setMsg(`Success! Weighment scale record saved for ${tokenNo}. Net Weight: ${netWeight} Quintals.`);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <DashboardLayout
      title="Electronic Weighbridge Station"
      subtitle="Capture electronic weighbridge measurements (Gross Weight, Tare Weight, Net Quintals)"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-gov-red mr-1" />
              <span>Weighbridge Station Counter</span>
            </span>
            <h2 className="text-lg font-bold font-heading text-gov-text mt-0.5">
              Record Electronic Weighment Scale Reading
            </h2>
          </div>

          {msg && (
            <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">
                Token Serial Number *
              </label>
              <div className="relative">
                <Ticket className="w-4 h-4 text-gov-red absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={tokenNo}
                  onChange={(e) => setTokenNo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">
                  Gross Weight (Tractor/Truck + Grain) in Quintals *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={grossWeight}
                  onChange={(e) => setGrossWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">
                  Tare Weight (Empty Vehicle/Bags) in Quintals *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={tareWeight}
                  onChange={(e) => setTareWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Net Output Board */}
            <div className="bg-gov-text text-white p-4 rounded-xl font-mono text-center space-y-1 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-heading uppercase block">Calculated Net Grain Weight</span>
              <div className="text-3xl font-black text-gov-green">{netWeight} Quintals</div>
              <div className="text-[11px] text-slate-300 font-sans">Formula: Gross ({grossWeight}) - Tare ({tareWeight})</div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} variant="primary">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {submitting ? 'Recording Scale...' : 'Save Weighment Slip'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Weighing;
