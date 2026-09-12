import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Building2, Plus, CheckCircle2, AlertCircle, RefreshCw, Landmark } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/layout/DashboardLayout';

const ManagerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Batch Slot Creation Modal
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotDate, setSlotDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [maxCapacity, setMaxCapacity] = useState(200);
  const [maxFarmers, setMaxFarmers] = useState(15);
  const [createMsg, setCreateMsg] = useState('');

  const fetchManagerData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/payments?centreId=${user.centreId?._id || ''}`);
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerData();
  }, [user]);

  const handleUpdatePayment = async (paymentId, status) => {
    setActionMsg('');
    try {
      const res = await axios.put(`/api/payments/${paymentId}/status`, {
        status,
        remarks: status === 'approved' ? 'Approved by Centre Manager' : 'DBT Payment Disbursed to Bank',
      });
      setActionMsg(`Payment status updated to ${status}! Localized SMS notification dispatched.`);
      fetchManagerData();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCreateBatchSlots = async (e) => {
    e.preventDefault();
    setCreateMsg('');
    try {
      const timeSlots = [
        { startTime: '08:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '12:00' },
        { startTime: '12:00', endTime: '14:00' },
        { startTime: '14:00', endTime: '16:00' },
      ];

      await axios.post('/api/slots/create-batch', {
        centreId: user.centreId?._id,
        date: slotDate,
        timeSlots,
        maxCapacityQuintals: Number(maxCapacity),
        maxFarmers: Number(maxFarmers),
      });

      setCreateMsg('Successfully generated 4 daily appointment slots for target date!');
      setTimeout(() => {
        setShowSlotModal(false);
        setCreateMsg('');
      }, 1500);
    } catch (err) {
      setCreateMsg(err.response?.data?.message || 'Failed to generate slots');
    }
  };

  const pendingPayments = payments.filter((p) => p.status === 'pending_approval');
  const approvedPayments = payments.filter((p) => p.status === 'approved');
  const processedPayments = payments.filter((p) => p.status === 'processed');

  return (
    <DashboardLayout title="Manager Dashboard Overview" subtitle="Centre Overview, Throughput & Payment Approvals">
      <div className="space-y-8 text-gov-text">
        {/* Manager Header */}
        <div className="relative bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] border-2 border-gov-red text-gov-text p-6 sm:p-8 rounded-2xl hero-container-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden">
          {/* Soft Decorative Blurred Red Circle */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-200/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative">
            <span className="text-xs uppercase tracking-wider text-gov-red font-bold font-heading">{t('roles.manager')} Portal</span>
            <h1 className="text-2xl font-bold font-heading text-gov-text mt-0.5">{user.name}</h1>
            <p className="text-xs text-gov-muted">
              Centre: <span className="font-semibold text-gov-text">{user.centreId?.name || 'Karnal Centre'}</span>
            </p>
          </div>

          <button
            onClick={() => setShowSlotModal(true)}
            className="relative px-5 py-3 btn-primary-red font-bold font-heading text-xs rounded-lg shadow-xs transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t('manager.capacity_mgmt')}</span>
          </button>
        </div>

        {actionMsg && (
          <div className="p-4 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
            {actionMsg}
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-heading">
          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-amber">
            <div className="text-xs text-gov-muted font-semibold">Pending Manager Approval</div>
            <div className="text-3xl font-bold text-gov-text">{pendingPayments.length}</div>
            <div className="text-[10px] text-gov-muted font-body">Procurement weighments awaiting sign-off</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-red">
            <div className="text-xs text-gov-muted font-semibold">Approved & Queued for DBT</div>
            <div className="text-3xl font-bold text-gov-red">{approvedPayments.length}</div>
            <div className="text-[10px] text-gov-muted font-body">Approved for bank transfer</div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate space-y-2 border-l-4 border-l-gov-green">
            <div className="text-xs text-gov-muted font-semibold">Total Payments Disbursed</div>
            <div className="text-3xl font-bold text-gov-green">{processedPayments.length}</div>
            <div className="text-[10px] text-gov-muted font-body">Direct benefit transfer sent</div>
          </div>
        </div>

        {/* Pending Payment Approval Table */}
        <div className="bg-white p-6 rounded-2xl border border-gov-border card-hover-elevate space-y-4">
          <h2 className="text-lg font-bold font-heading text-gov-text flex items-center space-x-2 border-b border-gov-border pb-3">
            <Landmark className="w-5 h-5 text-gov-red" />
            <span>{t('manager.payment_approvals')}</span>
          </h2>

          {payments.length === 0 ? (
            <p className="text-xs text-gov-muted text-center py-8">No payment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray text-gov-text font-bold font-heading uppercase text-[10px] border-b border-gov-border">
                  <tr>
                    <th className="p-3">Farmer & Token</th>
                    <th className="p-3">Crop & Qty</th>
                    <th className="p-3">Grade</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Bank Details</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Manager Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-gov-text">{p.farmerId?.name}</div>
                        <div className="font-mono text-[10px] text-gov-muted">{p.procurementRecordId?.bookingId?.tokenNumber}</div>
                      </td>
                      <td className="p-3">{p.procurementRecordId?.cropType} ({p.procurementRecordId?.actualQuantityQuintals} Qtl)</td>
                      <td className="p-3 font-semibold">{p.procurementRecordId?.qualityGrade}</td>
                      <td className="p-3 font-bold text-gov-green">₹{p.amount?.toLocaleString()}</td>
                      <td className="p-3 text-[10px] text-gov-muted">
                        <div>{p.bankDetails?.bankName}</div>
                        <div className="font-mono">{p.bankDetails?.accountNumber} ({p.bankDetails?.ifscCode})</div>
                      </td>
                      <td className="p-3">
                        {p.status === 'processed' ? (
                          <span className="badge-green-light border border-green-300 px-2.5 py-0.5 rounded-full font-bold">Processed</span>
                        ) : p.status === 'approved' ? (
                          <span className="badge-red-light border border-red-300 px-2.5 py-0.5 rounded-full font-bold">Approved</span>
                        ) : (
                          <span className="badge-amber-light border border-amber-300 px-2.5 py-0.5 rounded-full font-bold">Pending Approval</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2 font-heading">
                        {p.status === 'pending_approval' && (
                          <button
                            onClick={() => handleUpdatePayment(p._id, 'approved')}
                            className="px-3 py-1.5 btn-secondary-red text-xs font-bold rounded-lg shadow-xs transition-all"
                          >
                            {t('manager.approve_btn')}
                          </button>
                        )}
                        {(p.status === 'approved' || p.status === 'pending_approval') && (
                          <button
                            onClick={() => handleUpdatePayment(p._id, 'processed')}
                            className="px-3 py-1.5 bg-gov-green hover:bg-green-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all"
                          >
                            {t('manager.process_btn')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Batch Slot Generation Modal */}
        {showSlotModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gov-border animate-fade-in-up">
              <div className="bg-white border-b-2 border-gov-red p-5 flex justify-between items-center">
                <h3 className="font-bold font-heading text-base text-gov-text">{t('manager.capacity_mgmt')}</h3>
                <button onClick={() => setShowSlotModal(false)} className="text-gov-muted hover:text-gov-text text-lg">✕</button>
              </div>

              <form onSubmit={handleCreateBatchSlots} className="p-6 space-y-4">
                {createMsg && (
                  <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-lg font-bold">
                    {createMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Slot Capacity (Quintals per slot)</label>
                  <input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gov-text mb-1">Max Farmers per slot</label>
                  <input
                    type="number"
                    value={maxFarmers}
                    onChange={(e) => setMaxFarmers(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gov-gray border border-gov-border rounded-lg text-sm text-gov-text"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-3 font-heading">
                  <button
                    type="button"
                    onClick={() => setShowSlotModal(false)}
                    className="px-4 py-2.5 bg-white border border-gov-border text-gov-muted hover:text-gov-text text-xs font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 btn-primary-red font-bold text-xs rounded-lg shadow-xs transition-all"
                  >
                    Generate 4 Time Slots
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
