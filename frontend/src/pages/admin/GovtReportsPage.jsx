import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FileSpreadsheet, Download, Globe } from 'lucide-react';

export const GovtReportsPage = () => {
  const [state, setState] = useState('all');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-10');
  const [exporting, setExporting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleExport = () => {
    setExporting(true);
    setMsg('');

    setTimeout(() => {
      setMsg(`Success! National system audit report generated for ${state === 'all' ? 'All States' : state}. File download initiated.`);
      setExporting(false);
    }, 1200);
  };

  return (
    <DashboardLayout
      title="National Audit Reports & Data Export"
      subtitle="Generate pan-India procurement data dumps, state-wise MSP ledgers, and PFMS payment logs"
    >
      <div className="space-y-6">
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading flex items-center space-x-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-gov-red mr-1" />
              <span>National System Report Parameters</span>
            </span>
          </div>

          {msg && (
            <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
              {msg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">State / Jurisdiction</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              >
                <option value="all">All India (National)</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={handleExport} disabled={exporting}>
              <Download className="w-4 h-4 mr-1.5" />
              {exporting ? 'Generating Report...' : 'Download National System Audit Report'}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default GovtReportsPage;
