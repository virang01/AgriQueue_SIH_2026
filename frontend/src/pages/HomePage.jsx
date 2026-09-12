import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck, MessageSquare, ArrowRight, Building2, MapPin, Volume2, RefreshCw, CheckCircle2, User } from 'lucide-react';
import axios from 'axios';
import CentreLocationMap from '../components/CentreLocationMap';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { joinCentreRoom, leaveCentreRoom, lastNotification } = useSocket();

  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [queueData, setQueueData] = useState(null);
  const [loadingQueue, setLoadingQueue] = useState(false);

  useEffect(() => {
    axios
      .get('/api/centres')
      .then((res) => {
        const list = res.data.centres || [];
        setCentres(list);
        if (list.length > 0) {
          const userCentreId = user?.centreId?._id || user?.centreId;
          const knlCentre = list.find((c) => c.code === 'KNL01');
          const defaultCentre = userCentreId || (knlCentre ? knlCentre._id : list[0]._id);
          setSelectedCentreId(defaultCentre);
        }
      })
      .catch(() => {});
  }, [user]);

  const fetchQueue = (centreId) => {
    if (!centreId) return;
    setLoadingQueue(true);
    axios
      .get(`/api/queue/live?centreId=${centreId}`)
      .then((res) => setQueueData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingQueue(false));
  };

  useEffect(() => {
    if (selectedCentreId) {
      fetchQueue(selectedCentreId);
      joinCentreRoom(selectedCentreId);
      return () => {
        leaveCentreRoom(selectedCentreId);
      };
    }
  }, [selectedCentreId]);

  useEffect(() => {
    if (lastNotification && selectedCentreId) {
      fetchQueue(selectedCentreId);
    }
  }, [lastNotification, selectedCentreId]);

  return (
    <div className="space-y-16 sm:space-y-20 font-body text-gov-text bg-white pb-16">
      {/* 1. Hero Section: Depth, Subtle Gradient, Decorative Blurred Red Corner, Hero Container Drop Shadow */}
      <section className="relative bg-gradient-to-br from-white via-red-50/20 to-[#FDF6F6] border border-gov-border rounded-2xl p-8 sm:p-12 hero-container-shadow max-w-7xl mx-auto my-8 overflow-hidden animate-fade-in-up">
        {/* Soft Decorative Blurred Red Circle Corner Shape */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-200/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-3xl space-y-6">
          {/* Department Badge: Light Red Tint #FDECEA background, Red Text, Red Border */}
          <div className="inline-flex items-center space-x-2 badge-red-light border border-red-200/70 text-gov-red text-xs font-bold font-heading px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="w-2 h-2 rounded-full bg-gov-red animate-pulse"></span>
            <span>Department of Consumer Affairs • Official Procurement Portal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-gov-text leading-tight tracking-tight">
            {t('home.hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-gov-muted leading-relaxed">
            {t('home.hero_subtitle')}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 font-heading">
            {/* 2. Primary Red CTA: solid #C62828 red, text #FFFFFF, shadow + hover lift */}
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 btn-primary-red font-bold text-sm rounded-lg flex items-center justify-center space-x-2 transition-all"
            >
              <span>{t('home.book_slot_now')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* 2. Secondary Red Outline CTA: white bg, border 1.5px solid #C62828, text #C62828 */}
            <Link
              to="/live-queue"
              className="w-full sm:w-auto px-7 py-3.5 btn-secondary-red font-semibold text-sm rounded-lg flex items-center justify-center space-x-2 transition-all"
            >
              <Clock className="w-4 h-4 text-gov-red" />
              <span>{t('home.view_live_queue')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Feature Cards Grid: card-hover-elevate, Ringed Icon Containers, Integrated Left Border Accents */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-gov-text">
            {t('home.features_title')}
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted mt-1">
            Simple, high-contrast, accessible design tailored for mobile phones in rural connectivity zones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Zero Queue Wait Times */}
          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate border-l-4 border-l-gov-red space-y-4 overflow-hidden">
            <div className="w-13 h-13 rounded-xl badge-red-light ring-2 ring-red-100/80 shadow-xs flex items-center justify-center">
              <Clock className="w-6 h-6 text-gov-red" />
            </div>
            <h3 className="text-lg font-bold font-heading text-gov-text">{t('home.feat1_title')}</h3>
            <p className="text-sm text-gov-muted leading-relaxed">{t('home.feat1_desc')}</p>
          </div>

          {/* Card 2: SMS & Live Alerts */}
          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate border-l-4 border-l-gov-red space-y-4 overflow-hidden">
            <div className="w-13 h-13 rounded-xl badge-red-light ring-2 ring-red-100/80 shadow-xs flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gov-red" />
            </div>
            <h3 className="text-lg font-bold font-heading text-gov-text">{t('home.feat2_title')}</h3>
            <p className="text-sm text-gov-muted leading-relaxed">{t('home.feat2_desc')}</p>
          </div>

          {/* Card 3: Transparent Direct Payment (Success State Card) */}
          <div className="bg-white p-6 rounded-xl border border-gov-border card-hover-elevate border-l-4 border-l-gov-green space-y-4 overflow-hidden">
            <div className="w-13 h-13 rounded-xl badge-green-light ring-2 ring-green-100/80 shadow-xs flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-gov-green" />
            </div>
            <h3 className="text-lg font-bold font-heading text-gov-text">{t('home.feat3_title')}</h3>
            <p className="text-sm text-gov-muted leading-relaxed">{t('home.feat3_desc')}</p>
          </div>
        </div>
      </section>

      {/* 4. Live Queuing Status Section: Real-time Synchronized with Centre Staff */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl border-2 border-gov-red hero-container-shadow p-6 sm:p-8 space-y-6 overflow-hidden relative">
          {/* Decorative Corner Glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-200/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header & Centre Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gov-border pb-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 badge-red-light px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-heading text-gov-red mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gov-red animate-pulse"></span>
                <span>Real-Time Mandi Live Feed</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-gov-text flex items-center space-x-2">
                <Volume2 className="w-6 h-6 text-gov-red animate-pulse" />
                <span>Live Queuing Status Board</span>
              </h3>
              <p className="text-xs text-gov-muted mt-0.5">
                Real-time token display synchronized directly with Centre Staff counter & weighbridge
              </p>
            </div>

            <div className="flex items-center space-x-3 font-heading">
              <label className="text-xs font-semibold text-gov-text whitespace-nowrap">
                Mandi Centre:
              </label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="px-3 py-2 bg-gov-gray border border-gov-border rounded-lg text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none shadow-2xs"
              >
                {centres.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code}) - {c.district}, {c.state}
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchQueue(selectedCentreId)}
                className="p-2 btn-primary-red rounded-lg shadow-xs transition-all flex items-center justify-center text-white"
                title="Refresh Live Queue"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-white ${loadingQueue ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Queue Data Display */}
          {queueData && (
            <div className="space-y-6">
              {/* Currently Serving Box */}
              <div className="bg-gradient-to-br from-white via-red-50/30 to-[#FDF6F6] border border-red-200 rounded-xl p-6 text-center space-y-2">
                <div className="inline-block bg-gov-red text-white font-bold font-heading text-[10px] px-3.5 py-1 rounded-full tracking-wider uppercase shadow-2xs">
                  Currently Serving Token at Counter
                </div>

                {queueData.currentlyServing ? (
                  <div className="space-y-1">
                    <div className="text-4xl sm:text-5xl font-black font-heading tracking-wider text-gov-red font-mono py-1">
                      {queueData.currentlyServing.tokenNumber}
                    </div>
                    <div className="text-base font-bold font-heading text-gov-text">
                      {queueData.currentlyServing.farmerId?.name} • Crop: <span className="text-gov-red">{queueData.currentlyServing.cropType}</span> ({queueData.currentlyServing.estimatedQuantityQuintals} Qtl)
                    </div>
                    <div className="text-xs text-gov-muted font-medium">
                      Inspection Counter 1 • Synchronized with Centre Staff
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-1">
                    <div className="text-xl font-bold font-heading text-gov-muted">NO TOKEN CURRENTLY SERVING</div>
                    <p className="text-xs text-gov-muted">Counter is ready for next farmer check-in</p>
                  </div>
                )}
              </div>

              {/* 4 Quick Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-heading">
                <div className="bg-gov-gray p-3.5 rounded-xl border border-gov-border shadow-2xs">
                  <div className="text-xs text-gov-muted">Total Booked Today</div>
                  <div className="text-xl font-bold text-gov-text mt-0.5">{queueData.summary?.totalTotalBooked || 0}</div>
                </div>
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                  <div className="text-xs text-amber-900 font-semibold">Checked-In & Waiting</div>
                  <div className="text-xl font-bold text-amber-900 mt-0.5">{queueData.summary?.checkedInWaitingCount || 0}</div>
                </div>
                <div className="bg-green-50 p-3.5 rounded-xl border border-green-300 shadow-2xs">
                  <div className="text-xs text-green-900 font-bold flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                    <span>Completed Today</span>
                  </div>
                  <div className="text-xl font-black text-gov-green mt-0.5">
                    {queueData.summary?.completedCount || 0}
                  </div>
                </div>
                <div className="bg-gov-gray p-3.5 rounded-xl border border-gov-border shadow-2xs">
                  <div className="text-xs text-gov-muted">Queue Date</div>
                  <div className="text-xs font-bold text-gov-text mt-1">{queueData.date}</div>
                </div>
              </div>

              {/* Waiting & Completed Lists Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Checked-In Waiting List */}
                <div className="p-4 rounded-xl border border-gov-border bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center border-b border-gov-border pb-2 font-heading">
                    <span className="text-xs font-bold text-amber-900 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Checked-In Waiting in Line</span>
                    </span>
                    <span className="text-[11px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                      {queueData.checkedInWaiting?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {queueData.checkedInWaiting?.length === 0 ? (
                      <p className="text-xs text-gov-muted text-center py-3">No checked-in farmers waiting in line.</p>
                    ) : (
                      queueData.checkedInWaiting?.slice(0, 4).map((item) => (
                        <div key={item._id} className="p-2.5 bg-white rounded-lg border border-amber-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-mono font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {item.tokenNumber}
                            </span>
                            <span className="font-semibold text-slate-800 ml-2">{item.farmerId?.name}</span>
                          </div>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                            Ready
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Completed Today List */}
                <div className="p-4 rounded-xl border border-gov-border bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-center border-b border-gov-border pb-2 font-heading">
                    <span className="text-xs font-bold text-gov-green flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                      <span>Completed Today (Procured)</span>
                    </span>
                    <span className="text-[11px] bg-green-100 text-green-900 px-2 py-0.5 rounded-full font-bold border border-green-300">
                      {queueData.completedToday?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {queueData.completedToday?.length === 0 ? (
                      <p className="text-xs text-gov-muted text-center py-3">No completed tickets yet today.</p>
                    ) : (
                      queueData.completedToday?.slice(0, 4).map((item) => (
                        <div key={item._id} className="p-2.5 bg-white rounded-lg border border-green-200 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-mono font-bold text-gov-green bg-green-50 px-2 py-0.5 rounded border border-green-200">
                              {item.tokenNumber}
                            </span>
                            <span className="font-semibold text-slate-800 ml-2">{item.farmerId?.name}</span>
                          </div>
                          <span className="text-[10px] bg-gov-green text-white px-2 py-0.5 rounded-full font-bold">
                            Weighment Done
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* View Full Board Link */}
              <div className="text-right pt-1">
                <Link
                  to="/live-queue"
                  className="inline-flex items-center space-x-1 text-xs font-bold font-heading text-gov-red hover:underline"
                >
                  <span>Open Full Screen Live Display Board</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gov-red" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Active Procurement Centres List */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-gov-border hero-container-shadow p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-gov-text flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gov-red" />
                <span>Active Government Procurement Centres</span>
              </h3>
              <p className="text-xs text-gov-muted mt-0.5">
                Government grain collection centers accepting online queue reservations today
              </p>
            </div>
            <Link
              to="/live-queue"
              className="text-xs font-bold font-heading text-gov-red hover:underline flex items-center space-x-1"
            >
              <span>View All Live Boards</span>
              <ArrowRight className="w-4 h-4 text-gov-red" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {centres.map((c) => (
              <div
                key={c._id}
                className="p-5 rounded-xl bg-gov-gray border border-gov-border space-y-2.5 card-hover-elevate hover:border-gov-red transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-heading badge-red-light px-2.5 py-0.5 rounded border border-red-200">
                    {c.code}
                  </span>
                  <span className="text-xs text-gov-muted">{c.district}, {c.state}</span>
                </div>
                <h4 className="font-bold font-heading text-sm text-gov-text">{c.name}</h4>
                <p className="text-xs text-gov-muted">Capacity: <span className="font-semibold text-gov-text">{c.dailyCapacityQuintals} Qtl/day</span></p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {c.supportedCrops?.map((crop) => (
                    <span key={crop} className="text-[11px] bg-white border border-gov-border text-gov-text px-2 py-0.5 rounded font-medium">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mandi Centres Across India Interactive Map */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-gov-border hero-container-shadow p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gov-border pb-4">
            <div>
              <h3 className="text-xl font-bold font-heading text-gov-text flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gov-red" />
                <span>{t('home.map_heading')}</span>
              </h3>
              <p className="text-xs text-gov-muted mt-0.5">
                {t('home.map_subtitle', { count: centres.length })}
              </p>
            </div>
            <Link
              to="/book-slot"
              className="text-xs font-bold font-heading text-gov-red hover:underline flex items-center space-x-1"
            >
              <span>{t('home.book_slot_now')}</span>
              <ArrowRight className="w-4 h-4 text-gov-red" />
            </Link>
          </div>

          <CentreLocationMap centres={centres} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
