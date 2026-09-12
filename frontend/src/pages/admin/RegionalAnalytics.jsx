import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Globe, Map } from 'lucide-react';

export const RegionalAnalytics = () => {
  const stateData = [
    { state: 'Punjab', wheat: 45000, paddy: 28000 },
    { state: 'Haryana', wheat: 38000, paddy: 22000 },
    { state: 'Madhya Pradesh', wheat: 29000, paddy: 12000 },
    { state: 'Uttar Pradesh', wheat: 24000, paddy: 16000 },
    { state: 'Rajasthan', wheat: 18000, paddy: 5000 },
  ];

  return (
    <DashboardLayout
      title="State & Regional Procurement Breakdown"
      subtitle="Geographic analytics comparing procurement volumes across major agricultural states"
    >
      <div className="space-y-6">
        {/* Main State Comparison Chart */}
        <Card accent="red" hover={false} className="hero-container-shadow space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs font-bold font-heading text-gov-text flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-gov-red" />
              <span>State-Wise Grain Procurement Volume (Quintals)</span>
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="state" style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                <YAxis style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} Qtl`} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Poppins' }} />
                <Bar dataKey="wheat" name="Wheat (गेहूँ)" fill="#C62828" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paddy" name="Paddy (धान)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RegionalAnalytics;
