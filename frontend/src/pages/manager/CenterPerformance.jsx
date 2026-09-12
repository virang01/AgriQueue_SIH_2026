import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Scale } from 'lucide-react';

export const CenterPerformance = () => {
  const throughputData = [
    { day: 'Mon', wheat: 420, paddy: 150 },
    { day: 'Tue', wheat: 480, paddy: 180 },
    { day: 'Wed', wheat: 510, paddy: 210 },
    { day: 'Thu', wheat: 460, paddy: 190 },
    { day: 'Fri', wheat: 580, paddy: 240 },
    { day: 'Sat', wheat: 620, paddy: 280 },
    { day: 'Sun', wheat: 390, paddy: 110 },
  ];

  const waitTimeData = [
    { day: 'Mon', avgWait: 22, maxWait: 45 },
    { day: 'Tue', avgWait: 18, maxWait: 38 },
    { day: 'Wed', avgWait: 15, maxWait: 30 },
    { day: 'Thu', avgWait: 14, maxWait: 28 },
    { day: 'Fri', avgWait: 12, maxWait: 25 },
    { day: 'Sat', avgWait: 16, maxWait: 35 },
    { day: 'Sun', avgWait: 10, maxWait: 20 },
  ];

  const capacityData = [
    { day: 'Mon', utilization: 72 },
    { day: 'Tue', utilization: 82 },
    { day: 'Wed', utilization: 90 },
    { day: 'Thu', utilization: 81 },
    { day: 'Fri', utilization: 96 },
    { day: 'Sat', utilization: 98 },
    { day: 'Sun', utilization: 62 },
  ];

  return (
    <DashboardLayout
      title="Centre Performance Analytics"
      subtitle="Recharts visualizations of daily procurement throughput, average wait times, and capacity utilization"
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card accent="red" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-muted block font-heading">Weekly Throughput</span>
            <div className="text-2xl font-bold font-heading text-gov-text mt-1">3,660 Quintals</div>
            <div className="text-[10px] text-gov-green font-semibold mt-1">↑ 14% vs last week</div>
          </Card>

          <Card accent="green" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-green block font-heading">Average Wait Time</span>
            <div className="text-2xl font-bold font-heading text-gov-green mt-1">15.4 Minutes</div>
            <div className="text-[10px] text-gov-green font-semibold mt-1">↓ 35% reduction after queueing</div>
          </Card>

          <Card accent="red" hover={false}>
            <span className="text-[10px] uppercase font-bold text-gov-muted block font-heading">Capacity Utilization</span>
            <div className="text-2xl font-bold font-heading text-gov-red mt-1">84.5%</div>
            <div className="text-[10px] text-gov-muted mt-1">Peak on Friday/Saturday</div>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Throughput Chart */}
          <Card accent="red" hover={false} className="space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <span className="text-xs font-bold font-heading text-gov-text flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-gov-red" />
                <span>Daily Procurement Volume (Quintals)</span>
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={throughputData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                  <YAxis style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Poppins' }} />
                  <Bar dataKey="wheat" name="Wheat (Qtl)" fill="#C62828" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="paddy" name="Paddy (Qtl)" fill="#2E7D32" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Average Wait Time Chart */}
          <Card accent="green" hover={false} className="space-y-4">
            <div className="flex items-center justify-between border-b border-gov-border pb-3">
              <span className="text-xs font-bold font-heading text-gov-text flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-gov-green" />
                <span>Average Wait Time Trend (Minutes)</span>
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waitTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                  <YAxis style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Poppins' }} />
                  <Line type="monotone" dataKey="avgWait" name="Avg Wait (Mins)" stroke="#2E7D32" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="maxWait" name="Max Wait (Mins)" stroke="#C62828" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Capacity Utilization Area Chart */}
        <Card accent="red" hover={false} className="space-y-4">
          <div className="flex items-center justify-between border-b border-gov-border pb-3">
            <span className="text-xs font-bold font-heading text-gov-text flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-gov-red" />
              <span>Slot Capacity Utilization Rate (%)</span>
            </span>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={capacityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="day" style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                <YAxis domain={[0, 100]} style={{ fontSize: '11px', fontFamily: 'Noto Sans' }} />
                <Tooltip />
                <Area type="monotone" dataKey="utilization" name="Capacity Utilization %" stroke="#C62828" fill="#FDECEA" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CenterPerformance;
