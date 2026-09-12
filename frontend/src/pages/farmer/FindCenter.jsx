import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Search, MapPin, Building2, Wheat, Users, Calendar, ArrowRight } from 'lucide-react';
import { centreApi } from '../../api/centre.api';
import { useNavigate } from 'react-router-dom';

export const FindCenter = () => {
  const navigate = useNavigate();
  const [centres, setCentres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    centreApi
      .getAllCentres()
      .then((res) => {
        setCentres(res.centres || res.data?.centres || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const states = ['all', ...new Set(centres.map((c) => c.state).filter(Boolean))];

  const filteredCentres = centres.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || c.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <DashboardLayout
      title="Find Procurement Centre"
      subtitle="Locate government grain mandis, view operating capacity, and book procurement slots"
    >
      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gov-border grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-gov-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by centre name, district, or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            />
          </div>
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            >
              <option value="all">All States</option>
              {states.map((st) => (
                st !== 'all' && (
                  <option key={st} value={st}>
                    {st}
                  </option>
                )
              ))}
            </select>
          </div>
        </div>

        {/* Centre Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-gov-muted">Loading procurement centres...</div>
        ) : filteredCentres.length === 0 ? (
          <Card accent="red" hover={false} className="text-center py-12">
            <Building2 className="w-10 h-10 text-gov-red mx-auto opacity-40 mb-2" />
            <div className="text-sm font-bold font-heading text-gov-text">No centres found</div>
            <p className="text-xs text-gov-muted">Try adjusting your search query or state filter.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCentres.map((c) => (
              <Card key={c._id} accent="red" className="flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between border-b border-gov-border pb-3">
                    <span className="bg-red-50 text-gov-red text-[10px] font-bold px-2 py-0.5 rounded font-mono border border-red-200">
                      CODE: {c.code}
                    </span>
                    <span className="badge-green-light text-[10px] px-2 py-0.5 rounded font-bold font-heading">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-gov-text mt-3">
                    {c.name}
                  </h3>

                  <div className="text-xs text-gov-muted flex items-center space-x-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gov-red flex-shrink-0" />
                    <span>{c.district}, {c.state}</span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-gov-text">
                    <div className="flex items-center space-x-2">
                      <Wheat className="w-4 h-4 text-gov-red flex-shrink-0" />
                      <span>
                        <strong className="font-heading">Supported Crops:</strong>{' '}
                        {c.supportedCrops?.join(', ') || 'Wheat, Paddy'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gov-muted flex-shrink-0" />
                      <span>
                        <strong className="font-heading">Daily Capacity:</strong>{' '}
                        {c.dailyCapacityQuintals || 500} Quintals/day
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gov-muted flex-shrink-0" />
                      <span>
                        <strong className="font-heading">Operating Hours:</strong> 08:00 AM - 05:00 PM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gov-border">
                  <Button
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => navigate('/book-slot', { state: { centreId: c._id } })}
                  >
                    Book Here <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindCenter;
