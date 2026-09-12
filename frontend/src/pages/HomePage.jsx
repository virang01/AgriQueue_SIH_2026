import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck, MessageSquare, ArrowRight, Building2, MapPin, Volume2, RefreshCw, CheckCircle2, User, Calendar, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Pagination for Active Government Procurement Centres
  const [currentPage, setCurrentPage] = useState(1);
  const CENTRES_PER_PAGE = 6;
  const centresSectionRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [centres]);

  const totalPages = Math.ceil(centres.length / CENTRES_PER_PAGE) || 1;
  const paginatedCentres = centres.slice(
    (currentPage - 1) * CENTRES_PER_PAGE,
    currentPage * CENTRES_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    if (centresSectionRef.current) {
      centresSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to generate windowed page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  // Royalty-free background images representing Indian agriculture, mandi grain mandis, harvest, and weighing
  const heroImages = [
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1400&q=80', // Golden wheat harvest field & grains
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80', // Rural farming landscape & crops
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1400&q=80', // Indian agricultural fields & golden crops
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1400&q=80', // Grains, harvest procurement & agriculture
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

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
      {/* 1. Hero Section: Vivid Photography, Dark Gradient Scrim, High Contrast Typography */}
      <section className="relative rounded-2xl p-8 sm:p-12 md:p-16 hero-container-shadow max-w-7xl mx-auto mt-3 sm:mt-4 mb-8 overflow-hidden animate-fade-in-up border border-slate-300/40">
        {/* Full-Bleed Auto-Rotating Vivid Background Images */}
        <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden pointer-events-none">
          {heroImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="Mandi Procurement"
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            />
          ))}
          {/* Dark Gradient Scrim: Deep contrast on the left & bottom where text sits, allowing photography to shine through */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Department Badge: Frosted Glass / Translucent White pill with bright red pulse */}
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-bold font-heading px-3.5 py-1.5 rounded-full shadow-md">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            <span className="tracking-wide">Department of Consumer Affairs • Official Procurement Portal</span>
          </div>

          {/* Hero Title: Crisp White Font with Subtle Drop Shadow */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
            {t('home.hero_title')}
          </h1>

          {/* Hero Subtitle: High Legibility White/Slate Tint */}
          <p className="text-base sm:text-lg text-slate-100/95 leading-relaxed font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
            {t('home.hero_subtitle')}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 font-heading">
            {/* 2. Primary Red CTA: Vivid Solid Red with Shadow Elevation */}
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-sm rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>{t('home.book_slot_now')}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            {/* 2. Secondary CTA: Frosted Glass / Translucent Backdrop */}
            <Link
              to="/live-queue"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white font-semibold text-sm rounded-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Clock className="w-4 h-4 text-white" />
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
          <div className="group bg-white p-6 rounded-xl border border-gov-border border-l-4 border-l-gov-red space-y-4 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="w-13 h-13 rounded-xl badge-red-light ring-2 ring-red-100/80 shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Clock className="w-6 h-6 text-gov-red" />
            </div>
            <h3 className="text-lg font-bold font-heading text-gov-text">{t('home.feat1_title')}</h3>
            <p className="text-sm text-gov-muted leading-relaxed">{t('home.feat1_desc')}</p>
          </div>

          {/* Card 2: SMS & Live Alerts */}
          <div className="group bg-white p-6 rounded-xl border border-gov-border border-l-4 border-l-gov-red space-y-4 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="w-13 h-13 rounded-xl badge-red-light ring-2 ring-red-100/80 shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <MessageSquare className="w-6 h-6 text-gov-red" />
            </div>
            <h3 className="text-lg font-bold font-heading text-gov-text">{t('home.feat2_title')}</h3>
            <p className="text-sm text-gov-muted leading-relaxed">{t('home.feat2_desc')}</p>
          </div>

          {/* Card 3: Transparent Direct Payment (Success State Card) */}
          <div className="group bg-white p-6 rounded-xl border border-gov-border border-l-4 border-l-gov-green space-y-4 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="w-13 h-13 rounded-xl badge-green-light ring-2 ring-green-100/80 shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-gov-green" />
            </div>
            <h3 className="text-lg font-bold font-heading text-gov-text">{t('home.feat3_title')}</h3>
            <p className="text-sm text-gov-muted leading-relaxed">{t('home.feat3_desc')}</p>
          </div>
        </div>
      </section>

      {/* 4. Live Queuing Status Section: Real-time Synchronized with Centre Staff */}
      <section className="max-w-7xl mx-auto px-4 animate-fade-in-up">
        <div className="bg-white rounded-2xl border border-gov-border hero-container-shadow p-6 sm:p-8 space-y-6 overflow-hidden relative">
          {/* Decorative Corner Glow */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-200/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Section Header & Centre Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-gov-border pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 badge-red-light px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-heading text-gov-red mb-1.5 shadow-2xs">
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

            {/* Mandi Centre Control Cluster */}
            <div className="flex items-center space-x-2.5 font-heading bg-gov-gray/70 border border-gov-border/80 rounded-xl px-3 py-2 shadow-2xs">
              <label className="text-xs font-semibold text-gov-text whitespace-nowrap">
                Mandi Centre:
              </label>
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="px-3 py-1.5 bg-white border border-gov-border rounded-lg text-xs font-bold text-gov-text focus:ring-2 focus:ring-gov-red focus:outline-none shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors"
              >
                {centres.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code}) - {c.district}, {c.state}
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchQueue(selectedCentreId)}
                className="p-1.5 btn-primary-red rounded-lg shadow-xs transition-all flex items-center justify-center text-white"
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
              <div className="relative bg-gradient-to-br from-white via-red-50/35 to-[#FDF6F6] border border-red-200 rounded-2xl p-6 sm:p-7 text-center space-y-3 overflow-hidden shadow-2xs">
                {/* Subtle Live Glow behind Token Number */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-red-400/15 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 inline-flex items-center space-x-2 bg-gov-red text-white font-bold font-heading text-[10px] px-3.5 py-1 rounded-full tracking-wider uppercase shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]"></span>
                  <span>Currently Serving Token at Counter</span>
                </div>

                {queueData.currentlyServing ? (
                  <div className="relative z-10 space-y-3">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading tracking-wider text-gov-red font-mono py-1 drop-shadow-xs">
                      {queueData.currentlyServing.tokenNumber}
                    </div>
                    {/* Subtle Divider Line */}
                    <div className="border-t border-red-200/80 pt-3 max-w-xl mx-auto space-y-1">
                      <div className="text-base font-bold font-heading text-gov-text">
                        {queueData.currentlyServing.farmerId?.name} • Crop: <span className="text-gov-red">{queueData.currentlyServing.cropType}</span> ({queueData.currentlyServing.estimatedQuantityQuintals} Qtl)
                      </div>
                      <div className="text-xs text-gov-muted font-medium">
                        Inspection Counter 1 • Synchronized with Centre Staff
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 py-5 space-y-1">
                    <div className="text-xl font-bold font-heading text-gov-muted">NO TOKEN CURRENTLY SERVING</div>
                    <p className="text-xs text-gov-muted">Counter is ready for next farmer check-in</p>
                  </div>
                )}
              </div>

              {/* 4 Quick Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-heading">
                {/* 1. Total Booked Today */}
                <div className="cursor-default bg-gov-gray hover:bg-slate-100/90 p-4 rounded-xl border border-gov-border hover:border-gov-red/40 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center justify-center space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-gov-muted">
                    <Clock className="w-3.5 h-3.5 text-gov-muted" />
                    <span>Total Booked Today</span>
                  </div>
                  <div className="text-2xl font-black text-gov-text">{queueData.summary?.totalTotalBooked || 0}</div>
                </div>

                {/* 2. Checked-In & Waiting */}
                <div
                  onClick={() => {
                    const el = document.getElementById('checked-in-waiting-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className="cursor-pointer bg-amber-50/70 hover:bg-amber-100/80 p-4 rounded-xl border border-amber-200 hover:border-amber-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center justify-center space-y-1"
                  title="Click to view waiting list"
                >
                  <div className="flex items-center space-x-1.5 text-xs text-amber-900 font-semibold group-hover:text-amber-950 transition-colors">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition-transform" />
                    <span>Checked-In & Waiting</span>
                  </div>
                  <div className="text-2xl font-black text-amber-900">{queueData.summary?.checkedInWaitingCount || 0}</div>
                </div>

                {/* 3. Completed Today */}
                <div
                  onClick={() => {
                    const el = document.getElementById('completed-today-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className="cursor-pointer bg-green-50/70 hover:bg-green-100/80 p-4 rounded-xl border border-green-300 hover:border-green-400 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center justify-center space-y-1"
                  title="Click to view completed list"
                >
                  <div className="flex items-center space-x-1.5 text-xs text-green-900 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 group-hover:scale-110 transition-transform" />
                    <span>Completed Today</span>
                  </div>
                  <div className="text-2xl font-black text-gov-green">
                    {queueData.summary?.completedCount || 0}
                  </div>
                </div>

                {/* 4. Queue Date */}
                <div className="cursor-default bg-gov-gray hover:bg-slate-100/90 p-4 rounded-xl border border-gov-border hover:border-gov-red/40 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center justify-center space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-gov-muted">
                    <Calendar className="w-3.5 h-3.5 text-gov-muted" />
                    <span>Queue Date</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-gov-text pt-0.5">{queueData.date}</div>
                </div>
              </div>

              {/* Waiting & Completed Lists Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Checked-In Waiting List */}
                <div id="checked-in-waiting-list" className="p-4 rounded-xl border border-gov-border bg-slate-50/60 space-y-3">
                  <div className="flex justify-between items-center border-b border-gov-border pb-2.5 font-heading">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-bold text-amber-950">
                        Checked-In Waiting in Line
                      </span>
                    </div>
                    <span className="text-[11px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold border border-amber-300">
                      {queueData.checkedInWaiting?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {queueData.checkedInWaiting?.length === 0 ? (
                      <p className="text-xs text-gov-muted text-center py-4">No checked-in farmers waiting in line.</p>
                    ) : (
                      queueData.checkedInWaiting?.slice(0, 4).map((item) => (
                        <div key={item._id} className="p-3 bg-white even:bg-slate-50/60 hover:bg-amber-50/50 rounded-xl border border-amber-200 flex justify-between items-center text-xs transition-colors shadow-2xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-slate-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 text-[11px]">
                              {item.tokenNumber}
                            </span>
                            <span className="font-semibold text-slate-800">{item.farmerId?.name}</span>
                          </div>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                            Ready
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Completed Today List */}
                <div id="completed-today-list" className="p-4 rounded-xl border border-gov-border bg-slate-50/60 space-y-3">
                  <div className="flex justify-between items-center border-b border-gov-border pb-2.5 font-heading">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-bold text-green-950">
                        Completed Today (Procured)
                      </span>
                    </div>
                    <span className="text-[11px] bg-green-100 text-green-900 px-2.5 py-0.5 rounded-full font-bold border border-green-300">
                      {queueData.completedToday?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {queueData.completedToday?.length === 0 ? (
                      <p className="text-xs text-gov-muted text-center py-4">No completed tickets yet today.</p>
                    ) : (
                      queueData.completedToday?.slice(0, 4).map((item) => (
                        <div key={item._id} className="p-3 bg-white even:bg-slate-50/60 hover:bg-green-50/50 rounded-xl border border-green-200 flex justify-between items-center text-xs transition-colors shadow-2xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-gov-green bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 text-[11px]">
                              {item.tokenNumber}
                            </span>
                            <span className="font-semibold text-slate-800">{item.farmerId?.name}</span>
                          </div>
                          <span className="text-[10px] bg-gov-green text-white px-2.5 py-0.5 rounded-full font-bold">
                            Weighment Done
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Prominent Secondary CTA Link */}
              <div className="flex justify-end pt-2">
                <Link
                  to="/live-queue"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-gov-red/30 text-gov-red bg-white hover:bg-red-50 font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all"
                >
                  <span>Open Full Screen Live Display Board</span>
                  <ArrowRight className="w-4 h-4 text-gov-red" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Active Procurement Centres List */}
      <section ref={centresSectionRef} className="max-w-7xl mx-auto px-4 animate-fade-in-up scroll-mt-24">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCentres.map((c) => (
              <div
                key={c._id}
                className="group p-5 rounded-xl bg-gov-gray border border-gov-border space-y-3 shadow-2xs hover:shadow-md hover:border-gov-red/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-heading badge-red-light px-2.5 py-0.5 rounded-md border border-red-200 shadow-2xs">
                    {c.code}
                  </span>
                  <span className="text-xs text-gov-muted font-medium">{c.district}, {c.state}</span>
                </div>
                <h4 className="font-bold font-heading text-sm text-gov-text group-hover:text-gov-red transition-colors">{c.name}</h4>
                
                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-0.5">
                  <div className="flex justify-between items-center text-xs text-gov-muted">
                    <span>Daily Capacity:</span>
                    <span className="font-bold text-gov-text">{c.dailyCapacityQuintals} Qtl/day</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gov-red h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(25, (c.dailyCapacityQuintals / 3000) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Crop Tags */}
                <div className="pt-2 flex flex-wrap gap-1.5 border-t border-gov-border/60">
                  {c.supportedCrops?.map((crop) => (
                    <span key={crop} className="text-[11px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-medium shadow-2xs">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {centres.length > 0 && (
            <div className="pt-4 border-t border-gov-border flex flex-col sm:flex-row items-center justify-between gap-4 font-heading text-xs">
              <div className="text-gov-muted">
                Showing{' '}
                <span className="font-semibold text-gov-text">
                  {centres.length === 0 ? 0 : (currentPage - 1) * CENTRES_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-gov-text">
                  {Math.min(currentPage * CENTRES_PER_PAGE, centres.length)}
                </span>{' '}
                of <span className="font-semibold text-gov-text">{centres.length}</span> centres
              </div>

              {totalPages > 1 && (
                <div className="flex items-center space-x-1.5">
                  {/* Previous Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all ${
                      currentPage === 1
                        ? 'opacity-40 pointer-events-none bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-gov-border text-gov-text hover:bg-red-50 hover:text-gov-red hover:border-gov-red/40'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  {/* Numbered Page Buttons */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, idx) =>
                      page === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gov-muted">
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${page}`}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                            currentPage === page
                              ? 'bg-gov-red text-white shadow-xs'
                              : 'bg-gov-gray text-gov-text hover:bg-red-50 hover:text-gov-red'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border transition-all ${
                      currentPage === totalPages
                        ? 'opacity-40 pointer-events-none bg-slate-50 border-slate-200 text-slate-400'
                        : 'bg-white border-gov-border text-gov-text hover:bg-red-50 hover:text-gov-red hover:border-gov-red/40'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
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
