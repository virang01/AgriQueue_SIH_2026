import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { History, Filter, Search } from 'lucide-react';
import { paymentApi } from '../../api/payment.api';

export const FarmerHistory = () => {
  const [payments, setPayments] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchToken, setSearchToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentApi
      .getPayments()
      .then((res) => {
        setPayments(res.payments || res.data?.payments || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filteredPayments = payments.filter((p) => {
    const crop = p.procurementRecordId?.cropType || 'Wheat';
    const token = p.procurementRecordId?.bookingId?.tokenNumber || '';
    const matchesCrop = selectedCrop === 'all' || crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesToken = token.toLowerCase().includes(searchToken.toLowerCase());
    return matchesCrop && matchesToken;
  });

  return (
    <DashboardLayout
      title="Procurement History Logs"
      subtitle="Complete ledger of historical crop weighments, quality inspection grades, and bank transfers"
    >
      <div className="space-y-6">
        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-gov-border flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-gov-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter by token number..."
              value={searchToken}
              onChange={(e) => setSearchToken(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
            />
          </div>
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
              <option value="Mustard">Mustard</option>
              <option value="Chana">Chana</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <Card accent="green" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-green tracking-wider">
              Verified Records ({filteredPayments.length})
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gov-muted">Loading procurement records...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-12 text-center text-gov-muted text-xs">No matching procurement history found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                  <tr>
                    <th className="p-3">Token & Centre</th>
                    <th className="p-3">Crop Type</th>
                    <th className="p-3">Actual Quantity</th>
                    <th className="p-3">Quality Grade</th>
                    <th className="p-3">Moisture</th>
                    <th className="p-3">MSP Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {filteredPayments.map((p) => (
                    <tr key={p._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3 font-mono font-semibold">
                        <div>{p.procurementRecordId?.bookingId?.tokenNumber || 'TOK-GEN'}</div>
                        <div className="text-[10px] text-gov-muted font-sans font-normal">
                          {p.centreId?.name || 'Karnal Centre'}
                        </div>
                      </td>
                      <td className="p-3 font-semibold">{p.procurementRecordId?.cropType || 'Wheat'}</td>
                      <td className="p-3 font-bold">{p.procurementRecordId?.actualQuantityQuintals || 50} Qtl</td>
                      <td className="p-3">{p.procurementRecordId?.qualityGrade || 'Grade A'}</td>
                      <td className="p-3">{p.procurementRecordId?.moisturePercentage || 11.5}%</td>
                      <td className="p-3 font-bold text-gov-green text-sm">
                        ₹{p.amount?.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FarmerHistory;
