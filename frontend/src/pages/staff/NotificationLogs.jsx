import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';
import { Bell, Search, CheckCircle2, MessageSquare } from 'lucide-react';

export const NotificationLogs = () => {
  const [search, setSearch] = useState('');

  const mockLogs = [
    {
      id: 'NOTIF-901',
      recipient: 'Rameshwar Farmer (+91 9876543210)',
      token: 'TOK-KNL01-20260910-001',
      type: 'SMS Gateway',
      message: 'Aapka token TOK-KNL01-20260910-001 Karnal Mandi me tayar hai. Kripya counter 1 par aayein.',
      status: 'delivered',
      time: '10:05 AM'
    },
    {
      id: 'NOTIF-902',
      recipient: 'Suresh Kumar (+91 9876543211)',
      token: 'TOK-KNL01-20260910-002',
      type: 'SMS Gateway',
      message: 'Slot Booking Confirmed for Karnal Mandi on 2026-09-10 at 08:00 AM.',
      status: 'delivered',
      time: '08:00 AM'
    },
    {
      id: 'NOTIF-903',
      recipient: 'Harpreet Singh (+91 9876543212)',
      token: 'TOK-KNL01-20260910-003',
      type: 'In-App Alert',
      message: 'Weighment Completed: 52 Quintals Grade A Wheat. Payment sent for DBT approval.',
      status: 'delivered',
      time: '09:30 AM'
    }
  ];

  const filteredLogs = mockLogs.filter(
    (l) =>
      l.recipient.toLowerCase().includes(search.toLowerCase()) ||
      l.token.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="SMS & Notification Dispatch Logs"
      subtitle="Audit log of SMS gateways and push notifications dispatched from this procurement centre"
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-gov-border max-w-md relative">
          <Search className="w-4 h-4 text-gov-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by phone, token, or farmer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-xs font-semibold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
          />
        </div>

        {/* Logs Table */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs uppercase font-bold font-heading text-gov-red tracking-wider flex items-center space-x-1">
              <Bell className="w-4 h-4 text-gov-red mr-1" />
              <span>Gateway Delivery Logs ({filteredLogs.length})</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Log ID & Channel</th>
                  <th className="p-3">Recipient & Token</th>
                  <th className="p-3">Message Content</th>
                  <th className="p-3">Dispatch Time</th>
                  <th className="p-3">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-gov-gray transition-colors">
                    <td className="p-3 font-mono">
                      <div className="font-bold text-gov-red">{l.id}</div>
                      <div className="text-[10px] font-sans text-gov-muted">{l.type}</div>
                    </td>
                    <td className="p-3 font-semibold">
                      <div>{l.recipient}</div>
                      <div className="text-[10px] font-mono text-gov-muted">{l.token}</div>
                    </td>
                    <td className="p-3 max-w-xs text-gov-muted">{l.message}</td>
                    <td className="p-3 font-mono text-[11px]">{l.time}</td>
                    <td className="p-3">
                      <span className="badge-green-light text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                        DELIVERED
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

export default NotificationLogs;
