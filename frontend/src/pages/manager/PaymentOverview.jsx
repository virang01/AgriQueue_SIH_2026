import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import Button from '../../components/Button';
import { CreditCard, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { paymentApi } from '../../api/payment.api';

export const PaymentOverview = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchPayments = () => {
    setLoading(true);
    paymentApi
      .getPayments()
      .then((res) => {
        setPayments(res.payments || res.data?.payments || []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await paymentApi.approvePayment(id);
      setActionMsg('Success! Payment approved for Direct Bank Transfer (PFMS).');
      fetchPayments();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to approve payment');
    }
  };

  const handleProcess = async (id) => {
    try {
      await paymentApi.processPayment(id);
      setActionMsg('Success! Payment processed & disbursed to farmer account.');
      fetchPayments();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Failed to disburse payment');
    }
  };

  return (
    <DashboardLayout
      title="Centre DBT Payment Approvals & Sign-Off"
      subtitle="Manager authority console to review, approve, and disburse direct MSP payments to farmers"
    >
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gov-border">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-gov-green" />
            <span className="text-sm font-bold font-heading text-gov-text">
              Direct Benefit Transfer (DBT) Sign-Off Console
            </span>
          </div>
          <Button variant="outline" onClick={fetchPayments}>
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Refresh
          </Button>
        </div>

        {actionMsg && (
          <div className="p-3 badge-green-light border border-green-300 text-gov-green text-xs rounded-xl font-bold">
            {actionMsg}
          </div>
        )}

        {/* Payments Table */}
        <Card accent="green" hover={false} className="hero-container-shadow space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-gov-muted">Loading payment approvals...</div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-gov-muted text-xs">No pending payment entries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                  <tr>
                    <th className="p-3">Token & Farmer</th>
                    <th className="p-3">Crop & Weighment</th>
                    <th className="p-3">Total Payable</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Txn Reference</th>
                    <th className="p-3">Manager Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3 font-mono font-semibold">
                        <div>{p.procurementRecordId?.bookingId?.tokenNumber || 'TOK-GEN'}</div>
                        <div className="text-[10px] font-sans font-normal text-gov-muted">
                          {p.farmerId?.name || 'Rameshwar Farmer'}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold">{p.procurementRecordId?.cropType || 'Wheat'}</span>
                        <div className="text-[10px] text-gov-muted">
                          {p.procurementRecordId?.actualQuantityQuintals || 50} Qtl (Grade A)
                        </div>
                      </td>
                      <td className="p-3 font-bold text-gov-green text-sm">
                        ₹{p.amount?.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gov-muted">
                        {p.transactionRef || p.paymentReference || 'Pending Approval'}
                      </td>
                      <td className="p-3">
                        {p.status === 'pending' ? (
                          <Button variant="primary" className="text-xs py-1 px-3" onClick={() => handleApprove(p._id)}>
                            Approve Payment
                          </Button>
                        ) : p.status === 'approved' ? (
                          <Button variant="success" className="text-xs py-1 px-3" onClick={() => handleProcess(p._id)}>
                            Disburse Bank DBT
                          </Button>
                        ) : (
                          <span className="text-[11px] font-bold text-gov-green font-heading">
                            ✓ Disbursed
                          </span>
                        )}
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

export default PaymentOverview;
