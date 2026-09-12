import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import { UserCheck, Search, MapPin, Phone, Wheat } from 'lucide-react';

export const FarmerRecords = () => {
  const [search, setSearch] = useState('');

  const mockFarmers = [
    {
      id: 'FARM-001',
      name: 'Rameshwar Farmer',
      phone: '9876543210',
      district: 'Karnal',
      state: 'Haryana',
      visits: 3,
      totalQuintals: 152,
      lastVisit: '2026-09-10'
    },
    {
      id: 'FARM-002',
      name: 'Suresh Kumar',
      phone: '9876543211',
      district: 'Karnal',
      state: 'Haryana',
      visits: 2,
      totalQuintals: 95,
      lastVisit: '2026-09-08'
    },
    {
      id: 'FARM-003',
      name: 'Harpreet Singh',
      phone: '9876543212',
      district: 'Ludhiana',
      state: 'Punjab',
      visits: 4,
      totalQuintals: 210,
      lastVisit: '2026-09-05'
    }
  ];

  const filteredFarmers = mockFarmers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search) ||
      f.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Centre Farmer Registry & Visit Records"
      subtitle="Historical record of farmers who have conducted grain weighments at this centre"
    >
      <div className="space-y-6">
        {/* Search Input */}
        <div className="bg-white p-4 rounded-xl border border-gov-border max-w-md relative">
          <Search className="w-4 h-4 text-gov-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search farmer by name, phone, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
          />
        </div>

        {/* Farmer Registry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredFarmers.map((f) => (
            <Card key={f.id} accent="red" className="space-y-3">
              <div className="flex items-center justify-between border-b border-gov-border pb-2">
                <span className="font-mono text-xs font-bold text-gov-red">{f.id}</span>
                <span className="badge-red-light text-[10px] px-2 py-0.5 rounded font-bold">{f.visits} Visits</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold font-heading text-gov-text">{f.name}</h3>
                <div className="text-xs text-gov-muted flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-gov-red" />
                  <span>+91 {f.phone}</span>
                </div>
                <div className="text-xs text-gov-muted flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-gov-muted" />
                  <span>{f.district}, {f.state}</span>
                </div>
              </div>

              <div className="bg-gov-gray p-2.5 rounded-lg text-xs font-heading flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gov-muted block">Total Procured</span>
                  <span className="font-bold text-gov-text">{f.totalQuintals} Quintals</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gov-muted block">Last Visit</span>
                  <span className="font-semibold text-gov-muted">{f.lastVisit}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FarmerRecords;
