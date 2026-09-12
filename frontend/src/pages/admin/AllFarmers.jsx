import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import { Users, Search, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const AllFarmers = () => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  const mockFarmers = [
    { id: 'FRM-001', name: 'Rameshwar Farmer', phone: '9876543210', district: 'Karnal', state: 'Haryana', landArea: 4.5, lang: 'hi' },
    { id: 'FRM-002', name: 'Suresh Kumar', phone: '9876543211', district: 'Karnal', state: 'Haryana', landArea: 6.0, lang: 'en' },
    { id: 'FRM-003', name: 'Harpreet Singh', phone: '9876543212', district: 'Ludhiana', state: 'Punjab', landArea: 8.2, lang: 'hi' },
    { id: 'FRM-004', name: 'Rajesh Patel', phone: '9876543213', district: 'Indore', state: 'Madhya Pradesh', landArea: 5.5, lang: 'hi' },
  ];

  const filtered = mockFarmers.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.phone.includes(search) ||
      f.district.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === 'all' || f.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <DashboardLayout
      title="National Registered Farmer Directory"
      subtitle="Centralized registry of all farmers registered for MSP grain procurement across India"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gov-border flex flex-col sm:flex-row justify-between gap-3 items-center">
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gov-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by farmer name, phone, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="py-2.5 px-3 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="Haryana">Haryana</option>
              <option value="Punjab">Punjab</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>
          </div>
        </div>

        {/* Master Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-red tracking-wider">
              Registered Farmers ({filtered.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Farmer ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Mobile Phone</th>
                  <th className="p-3">District & State</th>
                  <th className="p-3">Land Holding</th>
                  <th className="p-3">DBT Bank Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {filtered.map((f) => (
                  <tr key={f.id} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-mono font-bold text-gov-red">{f.id}</td>
                    <td className="p-3 font-semibold">{f.name}</td>
                    <td className="p-3 font-mono">+91 {f.phone}</td>
                    <td className="p-3">{f.district}, {f.state}</td>
                    <td className="p-3 font-bold">{f.landArea} Acres</td>
                    <td className="p-3">
                      <span className="badge-green-light text-[10px] px-2 py-0.5 rounded font-bold font-heading">
                        VERIFIED AADHAAR
                      </span>
                    </td>
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

export default AllFarmers;
