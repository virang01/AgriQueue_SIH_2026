import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { CreditCard, AlertTriangle, CheckCircle2, Building2 } from 'lucide-react';

export const PaymentMonitoring = () => {
  const centrePayments = [
    { code: 'KNL01', name: 'Karnal Anaj Mandi', state: 'Haryana', totalPaid: '₹2,450,000', pendingCount: 2, backlogAmount: '₹232,050', status: 'HEALTHY' },
    { code: 'LDH01', name: 'Ludhiana Central Hub', state: 'Punjab', totalPaid: '₹3,820,000', pendingCount: 1, backlogAmount: '₹118,300', status: 'HEALTHY' },
    { code: 'IND01', name: 'Indore Mandi Hub', state: 'Madhya Pradesh', totalPaid: '₹1,950,000', pendingCount: 7, backlogAmount: '₹840,000', status: 'BACKLOG_ALERT' },
  ];

  return (
    <DashboardLayout
      title="National DBT Payment Backlog Monitor"
      subtitle="Cross-centre payment tracking matrix flagging centers with approval bottlenecks"
    >
      <div className="space-y-6">
        {/* Flagged Alert Banner */}
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-amber-800">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold font-heading">1 Centre Flagged for Payment Bottleneck</div>
              <div className="text-[11px] opacity-90">Indore Mandi Hub has 7 pending payment approvals exceeding 48 hours.</div>
            </div>
          </div>
        </div>

        {/* Centre Matrix Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-red tracking-wider">
              Cross-Centre Payment Performance Ledger
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Centre Code & Name</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Total Disbursed (PFMS)</th>
                  <th className="p-3">Pending Count</th>
                  <th className="p-3">Backlog Value</th>
                  <th className="p-3">Monitoring Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {centrePayments.map((c) => (
                  <tr key={c.code} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-semibold">
                      <div className="font-mono font-bold text-gov-red">{c.code}</div>
                      <div>{c.name}</div>
                    </td>
                    <td className="p-3">{c.state}</td>
                    <td className="p-3 font-bold text-gov-green">{c.totalPaid}</td>
                    <td className="p-3 font-bold">{c.pendingCount} Pending</td>
                    <td className="p-3 font-mono font-bold text-amber-700">{c.backlogAmount}</td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold font-heading ${
                          c.status === 'HEALTHY'
                            ? 'badge-green-light text-gov-green'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {c.status === 'HEALTHY' ? 'NORMAL' : '⚠️ BACKLOG ALERT'}
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

export default PaymentMonitoring;
