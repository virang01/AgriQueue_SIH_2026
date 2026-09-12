import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Building2, Search, MapPin, Wheat, Eye, Plus } from 'lucide-react';
import { centreApi } from '../../api/centre.api';

export const AllCenters = () => {
  const [centres, setCentres] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewCentre, setViewCentre] = useState(null);

  useEffect(() => {
    centreApi
      .getAllCentres()
      .then((res) => setCentres(res.centres || res.data?.centres || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const states = ['all', ...new Set(centres.map((c) => c.state).filter(Boolean))];

  const filteredCentres = centres.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase());
    const matchesState = selectedState === 'all' || c.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <DashboardLayout
      title="National Procurement Centres Registry"
      subtitle="Master directory of all registered procurement centres across states with live operating status"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gov-border flex flex-col sm:flex-row justify-between gap-3 items-center">
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-gov-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by centre code, name, district..."
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
              {states.map((st) => st !== 'all' && <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>

        {/* Master Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-red tracking-wider">
              Procurement Centres ({filteredCentres.length})
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gov-muted">Loading centre directory...</div>
          ) : filteredCentres.length === 0 ? (
            <div className="py-12 text-center text-gov-muted text-xs">No matching procurement centres found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                  <tr>
                    <th className="p-3">Centre Code</th>
                    <th className="p-3">Procurement Centre Name</th>
                    <th className="p-3">State & District</th>
                    <th className="p-3">Daily Capacity</th>
                    <th className="p-3">Supported Crops</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {filteredCentres.map((c) => (
                    <tr key={c._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3 font-mono font-bold text-gov-red">{c.code}</td>
                      <td className="p-3 font-semibold">{c.name}</td>
                      <td className="p-3">{c.district}, {c.state}</td>
                      <td className="p-3 font-bold">{c.dailyCapacityQuintals || 500} Qtl</td>
                      <td className="p-3 text-gov-muted">{c.supportedCrops?.join(', ') || 'Wheat, Paddy'}</td>
                      <td className="p-3">
                        <span className="badge-green-light text-[10px] px-2 py-0.5 rounded font-bold font-heading">
                          ACTIVE
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => setViewCentre(c)}
                          className="text-gov-red hover:underline font-bold flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 mr-0.5" />
                          <span>View Overview</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Manager-Level Overview Modal */}
        {viewCentre && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <Card accent="red" hover={false} className="w-full max-w-lg bg-white space-y-4 animate-fade-in-up">
              <div className="border-b border-gov-border pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-gov-red font-mono font-bold">CODE: {viewCentre.code}</span>
                  <h3 className="text-base font-bold font-heading text-gov-text">{viewCentre.name}</h3>
                </div>
                <button onClick={() => setViewCentre(null)} className="text-gov-muted hover:text-gov-text font-bold">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-heading bg-gov-gray p-3.5 rounded-xl border border-gov-border">
                <div>
                  <span className="text-gov-muted text-[10px] uppercase font-bold block">District & State</span>
                  <span className="font-bold text-gov-text">{viewCentre.district}, {viewCentre.state}</span>
                </div>
                <div>
                  <span className="text-gov-muted text-[10px] uppercase font-bold block">Daily Capacity</span>
                  <span className="font-bold text-gov-red">{viewCentre.dailyCapacityQuintals || 500} Quintals/Day</span>
                </div>
                <div>
                  <span className="text-gov-muted text-[10px] uppercase font-bold block">Operating Hours</span>
                  <span className="font-semibold text-gov-text">08:00 AM - 05:00 PM</span>
                </div>
                <div>
                  <span className="text-gov-muted text-[10px] uppercase font-bold block">Supported Crops</span>
                  <span className="font-semibold text-gov-text">{viewCentre.supportedCrops?.join(', ') || 'Wheat, Paddy'}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setViewCentre(null)}>
                  Close Overview
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AllCenters;
