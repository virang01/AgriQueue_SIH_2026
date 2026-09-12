import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CreditCard, ShieldCheck, Landmark, ArrowUpRight } from 'lucide-react';
import { paymentApi } from '../../api/payment.api';

export const FarmerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentApi
      .getPayments()
      .then((res) => setPayments(res.payments || res.data?.payments || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const totalDisbursed = payments
    .filter((p) => p.status === 'processed' || p.status === 'paid')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'pending' || p.status === 'approved')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <DashboardLayout
      title="Direct Benefit Transfer (DBT) Payments"
      subtitle="Track MSP procurement payments, bank account transfer status, and PFMS transaction IDs"
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accent="green" hover={false} className="bg-emerald-50/50 border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-gov-green font-heading block">Total Disbursed</span>
            <div className="text-2xl font-bold font-heading text-gov-green mt-1">₹{totalDisbursed.toLocaleString()}</div>
            <div className="text-[10px] text-gov-muted mt-1">Direct Bank Account Credit</div>
          </Card>

          <Card accent="red" hover={false} className="bg-amber-50/50 border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-700 font-heading block">Pending Approval</span>
            <div className="text-2xl font-bold font-heading text-amber-800 mt-1">₹{pendingAmount.toLocaleString()}</div>
            <div className="text-[10px] text-gov-muted mt-1">Awaiting Manager Sign-Off</div>
          </Card>

          <Card accent="red" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-muted font-heading block">Total Transactions</span>
            <div className="text-2xl font-bold font-heading text-gov-text mt-1">{payments.length}</div>
            <div className="text-[10px] text-gov-muted mt-1">MSP Verified Procurements</div>
          </Card>
        </div>

        {/* Payments Table */}
        <Card accent="green" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-green tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-gov-green mr-1" />
              <span>DBT Bank Transfer Ledger</span>
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gov-muted">Loading DBT ledger...</div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-gov-muted text-xs">No payment records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gov-text">
                <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                  <tr>
                    <th className="p-3">Token & Centre</th>
                    <th className="p-3">Crop</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">DBT Status</th>
                    <th className="p-3">PFMS Txn Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gov-border">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gov-gray transition-colors">
                      <td className="p-3 font-mono font-semibold">
                        <div>{p.procurementRecordId?.bookingId?.tokenNumber || 'TOK-KNL-001'}</div>
                        <div className="text-[10px] font-sans font-normal text-gov-muted">
                          {p.centreId?.name || 'Karnal Mandi'}
                        </div>
                      </td>
                      <td className="p-3 font-semibold">{p.procurementRecordId?.cropType || 'Wheat'}</td>
                      <td className="p-3 font-bold">{p.procurementRecordId?.actualQuantityQuintals || 50} Qtl</td>
                      <td className="p-3 font-bold text-gov-green text-sm">
                        ₹{p.amount?.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <StatusBadge
                          status={p.status}
                          text={
                            p.status === 'processed' || p.status === 'paid'
                              ? 'DBT Disbursed'
                              : p.status === 'approved'
                                ? 'Approved for Transfer'
                                : 'Pending Manager Sign-off'
                          }
                        />
                      </td>
                      <td className="p-3 font-mono text-[11px] text-gov-muted">
                        {p.transactionRef || p.paymentReference || 'DBT-PFMS-62565241'}
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

export default FarmerPayments;
