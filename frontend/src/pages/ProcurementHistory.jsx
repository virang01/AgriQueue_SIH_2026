import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Landmark, ArrowLeft, ShieldCheck } from 'lucide-react';
import { paymentApi } from '../api/payment.api';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';

export const ProcurementHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
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

  return (
    <div className="max-w-7xl mx-auto px-4 my-10 font-body text-gov-text bg-white pb-16 animate-fade-in-up">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 inline-flex items-center space-x-1.5 text-xs font-bold font-heading text-gov-red hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <Card accent="green" hover={false} className="hero-container-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gov-border pb-4 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-gov-green font-bold font-heading flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-gov-green" />
              <span>Direct Benefit Transfer (DBT)</span>
            </span>
            <h1 className="text-2xl font-bold font-heading text-gov-text mt-0.5">
              Procurement & Payment History Logs
            </h1>
            <p className="text-xs text-gov-muted">
              Complete record of MSP crop weighments, quality grades, and direct bank transfer references.
            </p>
          </div>
          <div className="bg-gov-green-light border border-green-300 px-4 py-2 rounded-xl text-right">
            <div className="text-[10px] text-gov-green uppercase font-semibold font-heading">Total Transactions</div>
            <div className="text-xl font-bold text-gov-green font-heading">{payments.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gov-muted">Loading procurement records...</div>
        ) : payments.length === 0 ? (
          <div className="py-12 text-center space-y-2 text-gov-muted">
            <p className="text-sm">No past procurement payment records found.</p>
            <p className="text-xs">Once your crop weighment is recorded at the centre, payment entries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray text-gov-text font-bold font-heading uppercase text-[10px] border-b border-gov-border">
                <tr>
                  <th className="p-3">Token & Centre</th>
                  <th className="p-3">Crop & Quantity</th>
                  <th className="p-3">Grade & Moisture</th>
                  <th className="p-3">Total MSP Amount</th>
                  <th className="p-3">DBT Payment Status</th>
                  <th className="p-3">Txn Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-mono font-semibold">
                      <div>{p.procurementRecordId?.bookingId?.tokenNumber || 'TOK-GEN'}</div>
                      <div className="text-[10px] font-sans text-gov-muted font-normal">
                        {p.centreId?.name}
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      {p.procurementRecordId?.cropType} ({p.procurementRecordId?.actualQuantityQuintals} Qtl)
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{p.procurementRecordId?.qualityGrade || 'Grade A'}</span>
                      <div className="text-[10px] text-gov-muted">
                        Moisture: {p.procurementRecordId?.moisturePercentage}%
                      </div>
                    </td>
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
                              ? 'Approved for Bank Transfer'
                              : 'Awaiting Approval'
                        }
                      />
                    </td>
                    <td className="p-3 font-mono text-[11px] text-gov-muted">
                      {p.transactionRef || p.paymentReference || 'Pending Sign-off'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProcurementHistory;
