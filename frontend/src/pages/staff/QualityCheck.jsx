import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Award, Droplets, CheckCircle2, Ticket } from 'lucide-react';
import { procurementApi } from '../../api/procurement.api';

export const QualityCheck = () => {
  const [tokenNo, setTokenNo] = useState('TOK-KNL01-20260910-001');
  const [moisture, setMoisture] = useState(11.5);
  const [grade, setGrade] = useState('Grade A');
  const [foreignMatter, setForeignMatter] = useState(0.5);
  const [notes, setNotes] = useState('Good grain luster, moisture well within 12% MSP threshold.');
  const [msg, setMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    setTimeout(() => {
      setMsg(`Success! Quality Inspection Certificate recorded for ${tokenNo}. Grade: ${grade}, Moisture: ${moisture}%.`);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <DashboardLayout
      title="Crop Quality Grading Counter"
      subtitle="Inspect incoming grain moisture content, impurities, and assign official MSP quality grade"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-gov-red mr-1" />
              <span>Quality Inspection Station</span>
            </span>
            <h2 className="text-lg font-bold font-heading text-gov-text mt-0.5">
              Record Grain Quality Inspection Entry
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
                <label className="block text-xs font-semibold text-gov-text mb-1 flex items-center space-x-1">
                  <Droplets className="w-3.5 h-3.5 text-gov-red" />
                  <span>Moisture Content (%) *</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
                <span className="text-[10px] text-gov-muted block mt-1">MSP standard max threshold: 12.0%</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gov-text mb-1">Assigned Quality Grade *</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                >
                  <option value="Grade A">Grade A (Premium Fair Average Quality)</option>
                  <option value="Grade B">Grade B (Standard MSP Acceptable)</option>
                  <option value="Grade C">Grade C (Minor Impurities - Price Deduction)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">Foreign Matter / Impurities (%)</label>
              <input
                type="number"
                step="0.1"
                value={foreignMatter}
                onChange={(e) => setForeignMatter(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">Inspector Quality Remarks</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-gov-gray border border-gov-border rounded-xl text-xs text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting} variant="primary">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {submitting ? 'Saving Certificate...' : 'Submit Quality Certificate'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default QualityCheck;
