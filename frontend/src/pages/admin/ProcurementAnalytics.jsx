import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

export const ProcurementAnalytics = () => {
  const cropData = [
    { name: 'Wheat (गेहूँ)', value: 68500, color: '#C62828' },
    { name: 'Paddy (धान)', value: 42000, color: '#2E7D32' },
    { name: 'Mustard (सरसों)', value: 18500, color: '#F9A825' },
    { name: 'Chana (चना)', value: 12000, color: '#1565C0' },
  ];

  const monthlyTrendData = [
    { month: 'Apr', volume: 15200 },
    { month: 'May', volume: 28400 },
    { month: 'Jun', volume: 34100 },
    { month: 'Jul', volume: 19800 },
    { month: 'Aug', volume: 22400 },
    { month: 'Sep', volume: 21100 },
  ];

  return (
    <DashboardLayout
      title="National Crop Procurement Analytics"
      subtitle="Recharts analytics across all centres — crop distribution, regional volume, and monthly trends"
    >
      <div className="space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accent="red" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-muted block font-heading">Total Seasonal Volume</span>
            <div className="text-2xl font-bold font-heading text-gov-red mt-1">141,000 Quintals</div>
            <div className="text-[10px] text-gov-green font-semibold mt-1">↑ 18% YoY Growth</div>
          </Card>

          <Card accent="green" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-green block font-heading">Primary Crop Procured</span>
            <div className="text-2xl font-bold font-heading text-gov-green mt-1">Wheat (48.5%)</div>
            <div className="text-[10px] text-gov-muted mt-1">Followed by Paddy (29.8%)</div>
          </Card>

          <Card accent="red" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-muted block font-heading">Average Rate Disbursed</span>
            <div className="text-2xl font-bold font-heading text-gov-text mt-1">₹2,275 / Qtl</div>
            <div className="text-[10px] text-gov-muted mt-1">100% MSP Rate Compliant</div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crop Share Pie Chart */}
          <Card accent="red" hover={false} className="space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <span className="text-xs font-bold font-heading text-gov-text flex items-center space-x-1.5">
                <PieIcon className="w-4 h-4 text-gov-red" />
                <span>Procurement Volume Share by Crop</span>
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {cropData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} Qtl`} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Poppins' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Trend Line Chart */}
          <Card accent="green" hover={false} className="space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <span className="text-xs font-bold font-heading text-gov-text flex items-center space-x-1.5">
                <TrendingUp className="w-4 h-4 text-gov-green" />
                <span>Monthly Procurement Trend (Quintals)</span>
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                  <YAxis style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Poppins' }} />
                  <Line type="monotone" dataKey="volume" name="Volume (Qtl)" stroke="#C62828" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProcurementAnalytics;
