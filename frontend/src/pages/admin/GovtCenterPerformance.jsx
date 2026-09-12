import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/Card';
import { Award, TrendingUp, Clock, Scale } from 'lucide-react';

export const GovtCenterPerformance = () => {
  const leaderboard = [
    { rank: 1, name: 'Ludhiana Central Hub', state: 'Punjab', score: '98.4/100', throughput: '1,200 Qtl/day', avgWait: '11 Mins', dbtSpeed: '24 Hours' },
    { rank: 2, name: 'Karnal Anaj Mandi', state: 'Haryana', score: '95.2/100', throughput: '800 Qtl/day', avgWait: '14 Mins', dbtSpeed: '36 Hours' },
    { rank: 3, name: 'Indore Mandi Hub', state: 'Madhya Pradesh', score: '84.8/100', throughput: '650 Qtl/day', avgWait: '22 Mins', dbtSpeed: '60 Hours' },
  ];

  return (
    <DashboardLayout
      title="National Centre Performance Benchmarking Leaderboard"
      subtitle="Ranked performance index benchmarking procurement throughput, wait times, and DBT speeds"
    >
      <div className="space-y-6">
        {/* Top 3 Leaderboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboard.map((item) => (
            <Card key={item.rank} accent="red" className="space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-gov-border pb-2">
                <span className="w-7 h-7 rounded-full bg-gov-red text-white flex items-center justify-center font-bold text-xs font-heading">
                  #{item.rank}
                </span>
                <span className="badge-green-light text-[10px] font-bold px-2 py-0.5 rounded font-heading">
                  SCORE: {item.score}
                </span>
              </div>

              <h3 className="text-sm font-bold font-heading text-gov-text">{item.name}</h3>
              <div className="text-xs text-gov-muted font-medium">{item.state}</div>

              <div className="bg-gov-gray p-2.5 rounded-xl space-y-1 text-xs font-heading border border-gov-border">
                <div className="flex justify-between">
                  <span className="text-gov-muted text-[10px]">Daily Capacity:</span>
                  <span className="font-bold text-gov-text">{item.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-muted text-[10px]">Avg Wait Time:</span>
                  <span className="font-bold text-gov-green">{item.avgWait}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-muted text-[10px]">DBT Credit Speed:</span>
                  <span className="font-semibold text-gov-text">{item.dbtSpeed}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GovtCenterPerformance;
