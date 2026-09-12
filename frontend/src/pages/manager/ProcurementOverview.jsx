import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { FileText, Filter, Search, Calendar } from 'lucide-react';

export const ProcurementOverview = () => {
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedStaff, setSelectedStaff] = useState('all');

  const mockRecords = [
    {
      id: 'PROC-101',
      token: 'TOK-KNL01-20260910-001',
      farmer: 'Rameshwar Farmer',
      crop: 'Wheat',
      qty: 50,
      grade: 'Grade A',
      moisture: '11.5%',
      staff: 'Vikram Singh',
      mspTotal: 113750,
      date: '2026-09-10'
    },
    {
      id: 'PROC-102',
      token: 'TOK-KNL01-20260910-002',
      farmer: 'Suresh Kumar',
      crop: 'Wheat',
      qty: 52,
      grade: 'Grade A',
      moisture: '11.5%',
      staff: 'Anil Mehta',
      mspTotal: 118300,
      date: '2026-09-10'
    },
    {
      id: 'PROC-103',
      token: 'TOK-KNL01-20260910-003',
      farmer: 'Harpreet Singh',
      crop: 'Paddy',
      qty: 60,
      grade: 'Grade B',
      moisture: '12.0%',
      staff: 'Vikram Singh',
      mspTotal: 132000,
      date: '2026-09-09'
    }
  ];

  const filtered = mockRecords.filter((r) => {
    const matchesCrop = selectedCrop === 'all' || r.crop === selectedCrop;
    const matchesStaff = selectedStaff === 'all' || r.staff === selectedStaff;
    return matchesCrop && matchesStaff;
  });

  return (
    <DashboardLayout
      title="Centre Procurement Overview Logs"
      subtitle="Aggregated weighment & quality inspection records filterable by crop type and staff member"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gov-border flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gov-red" />
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="py-2 px-3 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              <option value="all">All Crops</option>
              <option value="Wheat">Wheat</option>
              <option value="Paddy">Paddy</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="py-2 px-3 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              <option value="all">All Staff Members</option>
              <option value="Vikram Singh">Vikram Singh</option>
              <option value="Anil Mehta">Anil Mehta</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-red tracking-wider">
              Centre Aggregated Logs ({filtered.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Record ID & Token</th>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Crop & Quantity</th>
                  <th className="p-3">Grade & Moisture</th>
                  <th className="p-3">Total MSP Amount</th>
                  <th className="p-3">Staff Operator</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-gov-red">{r.id}</div>
                      <div className="text-[10px] text-gov-muted">{r.token}</div>
                    </td>
                    <td className="p-3 font-semibold">{r.farmer}</td>
                    <td className="p-3">{r.crop} ({r.qty} Qtl)</td>
                    <td className="p-3">
                      <span className="font-bold">{r.grade}</span>
                      <div className="text-[10px] text-gov-muted">{r.moisture}</div>
                    </td>
                    <td className="p-3 font-bold text-gov-green text-sm">
                      ₹{r.mspTotal.toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-gov-muted">{r.staff}</td>
                    <td className="p-3 font-mono text-[11px]">{r.date}</td>
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

export default ProcurementOverview;
