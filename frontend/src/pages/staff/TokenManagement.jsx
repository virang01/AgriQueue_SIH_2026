import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Ticket, QrCode, Search, UserCheck, ArrowUp, ArrowDown } from 'lucide-react';
import { queueApi } from '../../api/queue.api';

export const TokenManagement = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await queueApi.checkInFarmer(tokenInput.trim());
      setMsg({ type: 'success', text: `Success! Farmer verified & checked in. Token: ${res.booking?.tokenNumber || tokenInput}` });
      setTokenInput('');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to verify token number' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      title="Token Management & Gate Check-In"
      subtitle="Verify farmer digital token tickets upon arrival at centre gate and manage priority ordering"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Check-In Card */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-5">
          <div className="border-b border-gov-border pb-3">
            <span className="text-[10px] uppercase font-bold text-gov-red tracking-wider font-heading">
              Gate Entry Scanner
            </span>
            <h2 className="text-lg font-bold font-heading text-gov-text mt-0.5">
              Verify Token & Perform Farmer Check-In
            </h2>
            <p className="text-xs text-gov-muted">
              Enter the token serial number from the farmer's mobile screen or paper ticket pass.
            </p>
          </div>

          {msg.text && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                msg.type === 'success'
                  ? 'badge-green-light text-gov-green border border-green-300'
                  : 'bg-red-50 text-gov-red border border-red-200'
              }`}
            >
              {msg.text}
            </div>
          )}

          <form onSubmit={handleCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gov-text mb-1">
                Token Serial Number (e.g., TOK-KNL01-20260910-001) *
              </label>
              <div className="relative">
                <Ticket className="w-4 h-4 text-gov-red absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Type or paste token number..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gov-gray border border-gov-border rounded-xl text-sm font-mono font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="submit" disabled={submitting} variant="primary">
                <UserCheck className="w-4 h-4 mr-1.5" />
                {submitting ? 'Checking In...' : 'Verify & Gate Check-In'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Priority Override & Edge Cases */}
        <Card accent="red" hover={false} className="space-y-4">
          <h3 className="text-sm font-bold font-heading text-gov-text border-b border-gov-border pb-2">
            Priority Queue Order Override (Senior Citizens / Special Cases)
          </h3>
          <p className="text-xs text-gov-muted">
            Staff can bump checked-in tokens to the top of the counter line for emergency or priority circumstances.
          </p>

          <div className="bg-gov-gray p-3.5 rounded-xl border border-gov-border flex items-center justify-between text-xs font-heading">
            <div>
              <span className="font-bold text-gov-text">TOK-KNL01-20260910-003 (Rameshwar Farmer)</span>
              <div className="text-[10px] text-gov-muted">Checked in at 08:15 AM • Wheat (50 Qtl)</div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="text-xs py-1 px-2.5">
                <ArrowUp className="w-3 h-3 mr-1 text-gov-green" /> Priority Bump
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TokenManagement;
