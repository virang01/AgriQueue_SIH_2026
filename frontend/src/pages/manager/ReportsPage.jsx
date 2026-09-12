import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { FileSpreadsheet, Download, Calendar, Filter } from 'lucide-react';

export const ReportsPage = () => {
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-10');
  const [reportType, setReportType] = useState('procurement_summary');
  const [exporting, setExporting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleExport = () => {
    setExporting(true);
    setMsg('');

    setTimeout(() => {
      setMsg(`Success! Report generated for period ${startDate} to ${endDate}. CSV file download initiated.`);
      setExporting(false);
    }, 1200);
  };

  const previewData = [
    { date: '2026-09-10', farmers: 42, quintals: 2100, mspTotal: 4777500, dbtStatus: '95% Disbursed' },
    { date: '2026-09-09', farmers: 38, quintals: 1900, mspTotal: 4322500, dbtStatus: '100% Disbursed' },
    { date: '2026-09-08', farmers: 45, quintals: 2250, mspTotal: 5118750, dbtStatus: '100% Disbursed' },
    { date: '2026-09-07', farmers: 30, quintals: 1500, mspTotal: 3412500, dbtStatus: '100% Disbursed' },
  ];

  return (
    <DashboardLayout
      title="Centre Exportable Reports Generator"
      subtitle="Generate and download official CSV/Excel audit reports for procurement volumes and DBT payments"
    >
      <div className="space-y-6">
        {/* Date Range Picker & Export Form */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading flex items-center space-x-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-gov-red mr-1" />
              <span>Report Generator Criteria</span>
            </span>
          </div>

          {msg && (
            <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
              {msg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">End Date *</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
              >
                <option value="procurement_summary">Procurement Summary Report</option>
                <option value="dbt_payments">DBT Payment Status Audit</option>
                <option value="quality_breakdown">Quality Inspection Breakdown</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={handleExport} disabled={exporting}>
              <Download className="w-4 h-4 mr-1.5" />
              {exporting ? 'Generating Report...' : 'Export CSV / Excel Report'}
            </Button>
          </div>
        </Card>

        {/* Data Preview Table */}
        <Card accent="red" hover={false} className="space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-text tracking-wider">
              Report Data Preview ({previewData.length} Days)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Procurement Date</th>
                  <th className="p-3">Farmers Served</th>
                  <th className="p-3">Volume Procured</th>
                  <th className="p-3">Total Payable MSP</th>
                  <th className="p-3">DBT Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {previewData.map((row) => (
                  <tr key={row.date} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-mono font-semibold">{row.date}</td>
                    <td className="p-3 font-bold">{row.farmers} Farmers</td>
                    <td className="p-3 font-bold">{row.quintals} Quintals</td>
                    <td className="p-3 font-bold text-gov-green">₹{row.mspTotal.toLocaleString()}</td>
                    <td className="p-3 font-semibold text-gov-green">{row.dbtStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
