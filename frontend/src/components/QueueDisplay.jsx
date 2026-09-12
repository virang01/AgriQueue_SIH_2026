import React, { useState } from 'react';

export const QueueDisplay = ({
  currentlyServing,
  summary,
  centreName,
  checkedInWaiting = [],
  upcomingBooked = [],
  completedToday = [],
  highlightToken = null,
}) => {
  const [activeTab, setActiveTab] = useState('waiting'); // waiting | upcoming | completed

  return (
    <div className="space-y-6">
      {/* Main Now Serving Card */}
      <div className="bg-white border-2 border-gov-red text-gov-text rounded-2xl p-6 sm:p-8 hero-container-shadow relative overflow-hidden text-center space-y-4">
        <div className="inline-block bg-gov-red text-white font-bold font-heading text-xs px-4 py-1.5 rounded-full tracking-wider uppercase shadow-xs">
          NOW SERVING COUNTER
        </div>

        {currentlyServing ? (
          <div className="space-y-2">
            <div className="text-5xl sm:text-6xl font-black font-heading tracking-wider text-gov-red font-mono py-2">
              {currentlyServing.tokenNumber}
            </div>
            <div className="text-xl font-bold font-heading text-gov-text">
              {currentlyServing.farmerId?.name || 'Farmer'} • Crop:{' '}
              <span className="text-gov-red">{currentlyServing.cropType}</span> ({currentlyServing.estimatedQuantityQuintals} Qtl)
            </div>
            <div className="text-xs text-gov-muted font-medium">
              Inspection Counter 1 • {centreName || 'Procurement Centre'}
            </div>
          </div>
        ) : (
          <div className="py-6 space-y-1">
            <div className="text-2xl font-bold font-heading text-gov-muted">NO TOKEN CURRENTLY SERVING</div>
            <p className="text-xs text-gov-muted">Weighbridge counter is ready for next farmer check-in</p>
          </div>
        )}

        {summary && (
          <div className="pt-6 border-t border-gov-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-center font-heading">
            <div className="bg-gov-gray p-3.5 rounded-xl border border-gov-border shadow-xs">
              <div className="text-xs text-gov-muted">Total Booked Today</div>
              <div className="text-xl font-bold text-gov-text mt-0.5">{summary.totalTotalBooked || 0}</div>
            </div>
            <div className="bg-gov-amber-light p-3.5 rounded-xl border border-amber-200 shadow-xs">
              <div className="text-xs text-amber-900 font-semibold">Checked-In & Waiting</div>
              <div className="text-xl font-bold text-amber-900 mt-0.5">{summary.checkedInWaitingCount || 0}</div>
            </div>
            <div className="bg-gov-green-light p-3.5 rounded-xl border border-green-200 shadow-xs col-span-2 sm:col-span-1">
              <div className="text-xs text-gov-green font-semibold">Completed Today</div>
              <div className="text-xl font-bold text-gov-green mt-0.5">{summary.completedCount || 0}</div>
            </div>
          </div>
        )}
      </div>

      {/* Filterable Roster Tables */}
      {(checkedInWaiting.length > 0 || upcomingBooked.length > 0 || completedToday.length > 0) && (
        <div className="bg-white border border-gov-border rounded-2xl p-4 sm:p-6 hero-container-shadow space-y-4">
          <div className="flex items-center space-x-2 border-b border-gov-border pb-3">
            <button
              onClick={() => setActiveTab('waiting')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading transition-all duration-150 focus:outline-none ${
                activeTab === 'waiting'
                  ? 'bg-red-100/90 border border-red-300 text-gov-red font-bold shadow-2xs'
                  : 'bg-gov-gray text-slate-900 font-semibold hover:bg-slate-200'
              }`}
            >
              Checked-In & Waiting ({checkedInWaiting.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading transition-all duration-150 focus:outline-none ${
                activeTab === 'upcoming'
                  ? 'bg-red-100/90 border border-red-300 text-gov-red font-bold shadow-2xs'
                  : 'bg-gov-gray text-slate-900 font-semibold hover:bg-slate-200'
              }`}
            >
              Scheduled Today ({upcomingBooked.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading transition-all duration-150 focus:outline-none ${
                activeTab === 'completed'
                  ? 'bg-red-100/90 border border-red-300 text-gov-red font-bold shadow-2xs'
                  : 'bg-gov-gray text-slate-900 font-semibold hover:bg-slate-200'
              }`}
            >
              Completed ({completedToday.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gov-text">
              <thead className="bg-gov-gray font-bold font-heading uppercase text-[10px] text-gov-text border-b border-gov-border">
                <tr>
                  <th className="p-3">Token No.</th>
                  <th className="p-3">Farmer Name</th>
                  <th className="p-3">Crop & Qty</th>
                  <th className="p-3">Slot Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gov-border">
                {(activeTab === 'waiting'
                  ? checkedInWaiting
                  : activeTab === 'upcoming'
                  ? upcomingBooked
                  : completedToday
                ).map((t) => {
                  const isHighlighted = highlightToken && t.tokenNumber === highlightToken;
                  return (
                    <tr
                      key={t._id}
                      className={`transition-colors ${
                        isHighlighted ? 'bg-red-50 font-bold border-l-4 border-l-gov-red' : 'hover:bg-gov-gray'
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-slate-900 text-sm">
                        <span className="px-2.5 py-1 rounded-md bg-red-100/90 text-gov-red font-black border border-red-300 font-mono inline-block shadow-2xs">
                          {t.tokenNumber}
                        </span>
                        {isHighlighted && (
                          <span className="ml-2 text-[10px] bg-gov-red text-white px-2 py-0.5 rounded font-sans font-bold">
                            YOUR TOKEN
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold">{t.farmerId?.name || 'Farmer'}</td>
                      <td className="p-3">
                        {t.cropType} ({t.estimatedQuantityQuintals} Qtl)
                      </td>
                      <td className="p-3 font-mono">
                        {t.slotId?.startTime || '08:00'} - {t.slotId?.endTime || '10:00'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueDisplay;
