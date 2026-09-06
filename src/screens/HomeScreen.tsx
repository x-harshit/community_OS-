import React from 'react';
import { useApp } from '../context/AppContext';
import { ReportCard } from '../components/reports/ReportCard';
import { CategoryIcon, getCategoryColor } from '../components/CategoryIcon';
import {
  PlusCircle,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  Activity,
  Navigation,
  Crosshair,
  Loader2,
  Flame
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    selectedCommunity,
    reports,
    categories,
    communityPosts,
    setIsReportWizardOpen,
    setActiveTab,
    updateDraft,
    isUsingCurrentLocation,
    useCurrentLocation,
    isDetectingLocation
  } = useApp();

  const activeReports = reports.filter((r) => r.status !== 'RESOLVED');
  const resolvedReports = reports.filter((r) => r.status === 'RESOLVED');
  const trendingReports = [...reports].sort((a, b) => b.affectedCount - a.affectedCount).slice(0, 3);
  const totalAffected = reports.reduce((acc, r) => acc + r.affectedCount, 0);

  const quickCategories = categories.slice(0, 6);

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* =========================================================================
          STAGE 1: PRIMARY ACTION COMMAND HERO (AT FIRST SIGHT)
          Clearly highlights the main motive of this tool: Report an Issue!
         ========================================================================= */}
      <div className="bg-white border-2 border-black rounded-[32px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        {/* Top Eyebrow & Status Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-black text-white px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" />
              CIVIC DISPATCH COMMAND
            </span>

            {/* Current Location / Ward Quick Switcher */}
            <button
              onClick={() => useCurrentLocation()}
              disabled={isDetectingLocation}
              title="Click to detect GPS or synchronize current location"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 hover:bg-[#E2FF4D] text-black border border-black text-xs font-black transition cursor-pointer"
            >
              {isDetectingLocation ? (
                <Loader2 className="w-3 h-3 animate-spin text-black" />
              ) : isUsingCurrentLocation ? (
                <Navigation className="w-3 h-3 text-[#22c55e] stroke-[3]" />
              ) : (
                <MapPin className="w-3 h-3 text-[#FF5C00] stroke-[2.5]" />
              )}
              <span className="uppercase tracking-tight truncate max-w-[200px]">
                {selectedCommunity.name}
              </span>
              {isUsingCurrentLocation ? (
                <span className="text-[9px] bg-black text-[#E2FF4D] px-1.5 py-0.2 rounded font-mono font-bold">
                  GPS
                </span>
              ) : (
                <span className="text-[9px] text-zinc-500 font-mono font-bold">
                  {selectedCommunity.wardNumber}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono font-black uppercase bg-[#E2FF4D] text-black px-3 py-1 rounded-full border border-black">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] border border-black animate-ping" />
            <span>DISPATCH SQUADS ONLINE</span>
          </div>
        </div>

        {/* Main Hero Callout & Primary CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-black leading-none">
              Report a Civic Issue in Seconds
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 font-semibold leading-relaxed">
              Encountered a pothole, open garbage dump, broken streetlight, or burst water pipe in{' '}
              <strong className="text-black font-black">{selectedCommunity.name}</strong>? File it now with photo proof for direct municipal squad dispatch.
            </p>
          </div>

          {/* Unmissable Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsReportWizardOpen(true)}
              className="px-7 py-4 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-sm sm:text-base uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2.5 group"
              id="hero-report-btn"
            >
              <PlusCircle className="w-5 h-5 stroke-[3] group-hover:rotate-90 transition-transform" />
              <span>Report Issue Now</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-black font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Ward Map</span>
            </button>
          </div>
        </div>

        {/* Fast 1-Click Category Report Launchers */}
        <div className="pt-2 border-t-2 border-black/10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF5C00] fill-[#FF5C00]" />
              <span>Or click a category to file immediately:</span>
            </p>
            <button
              onClick={() => setIsReportWizardOpen(true)}
              className="text-xs font-black uppercase tracking-wider text-[#FF5C00] hover:text-black transition cursor-pointer hidden sm:block"
            >
              View all 15 categories →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {quickCategories.map((cat) => {
              const colors = getCategoryColor(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    updateDraft({ categoryId: cat.id });
                    setIsReportWizardOpen(true);
                  }}
                  className="p-3 sm:p-3.5 rounded-2xl bg-zinc-50 hover:bg-[#E2FF4D] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col items-center text-center gap-2 cursor-pointer group"
                >
                  <div className={`p-2 rounded-xl ${colors.bg} border border-black group-hover:scale-110 transition-transform`}>
                    <CategoryIcon iconName={cat.icon} className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight text-black line-clamp-1">
                    {cat.name.split('/')[0]}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                    SLA {cat.defaultEscalationHours}H
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 2: WARD INTELLIGENCE & CIVIC PULSE BENTO
          Cleanly arranged 4 bento cards providing neighborhood health data
         ========================================================================= */}
      <div className="grid grid-cols-12 gap-5 sm:gap-6">
        {/* BENTO CARD 1: Neon Lime Resolution Rate Metric (5 Cols on desktop) */}
        <div className="col-span-12 lg:col-span-5 bg-[#E2FF4D] border-2 border-black rounded-[32px] p-6 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start">
            <span className="font-black uppercase text-xs tracking-widest text-black">
              Ward Resolution Index
            </span>
            <span className="text-xs font-black bg-black text-white px-2.5 py-0.5 rounded-full border border-black uppercase tracking-wider">
              +14.2% Week
            </span>
          </div>

          {/* Neo-brutalist Bar Sparkline */}
          <div className="flex items-end gap-1.5 h-16 py-1">
            <div className="flex-1 h-6 bg-black/15 rounded-t-md border-t-2 border-black"></div>
            <div className="flex-1 h-9 bg-black/15 rounded-t-md border-t-2 border-black"></div>
            <div className="flex-1 h-12 bg-black/25 rounded-t-md border-t-2 border-black"></div>
            <div className="flex-1 h-8 bg-black/15 rounded-t-md border-t-2 border-black"></div>
            <div className="flex-1 h-11 bg-black/25 rounded-t-md border-t-2 border-black"></div>
            <div className="flex-1 h-15 bg-black rounded-t-md border-t-2 border-black"></div>
            <div className="flex-1 h-14 bg-black rounded-t-md border-t-2 border-black"></div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-black leading-none block">
                {resolvedReports.length} Resolved
              </span>
              <p className="text-[11px] font-bold text-black/80 mt-1 uppercase tracking-tight">
                {activeReports.length} pending squad inspection
              </p>
            </div>
            <span className="text-2xl font-black text-black font-mono">
              {reports.length > 0 ? Math.round((resolvedReports.length / reports.length) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* BENTO CARD 2: Active Municipal Squad Alert (4 Cols on desktop) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 bg-[#FF5C00] border-2 border-black rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between text-white select-none gap-3">
          <div className="flex justify-between items-center">
            <span className="font-black uppercase text-[10px] tracking-widest opacity-90 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Active Municipal Squad
            </span>
            <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded-full border border-black">
              On Route
            </span>
          </div>

          <div>
            <span className="text-base font-black uppercase tracking-tight block text-white">
              PWD Squad Unit 2
            </span>
            <span className="text-xs font-bold text-white/90 block mt-0.5">
              Pothole Paving Road 4B
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-white/80">
              <span>SLA Target</span>
              <span>75% Dispatched</span>
            </div>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden border border-white/40">
              <div className="w-3/4 h-full bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* BENTO CARD 3: Weather & AQI + Community Voices (3 Cols on desktop) */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col gap-4">
          {/* Micro Card: AQI / Weather */}
          <div className="bg-white border-2 border-black rounded-[24px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3">
            <span className="text-3xl">🌦️</span>
            <div className="text-right">
              <span className="text-lg font-black text-black block leading-none">27°C / AQI 128</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1 block">
                {selectedCommunity.city}
              </span>
            </div>
          </div>

          {/* Micro Card: Resident Impact */}
          <div className="bg-white border-2 border-black rounded-[24px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Residents Joined
              </span>
              <span className="w-2 h-2 rounded-full bg-[#22c55e] border border-black animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-black">
                {totalAffected} Voices
              </span>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-black bg-zinc-200 flex items-center justify-center text-[9px] font-black">
                  AS
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-black bg-[#E2FF4D] flex items-center justify-center text-[9px] font-black">
                  PR
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-black bg-[#FF5C00] text-white flex items-center justify-center text-[9px] font-black">
                  +42
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE 3: NEARBY CIVIC HAZARDS SECTION
         ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
              <span>📍 Nearby Civic Hazards</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E2FF4D] text-black border border-black font-black uppercase">
                {activeReports.length} Active in Ward
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-semibold">
              Tap "I'm Also Affected" on issues near you to multiply community urgency.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="text-xs font-black uppercase tracking-wider text-black hover:text-[#FF5C00] flex items-center gap-1 cursor-pointer"
          >
            <span>View all cases</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeReports.slice(0, 2).map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </div>

      {/* =========================================================================
          STAGE 4: TRENDING CIVIC MOBILIZATIONS
         ========================================================================= */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-black flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF5C00] stroke-[2.5]" />
              <span>Trending Civic Mobilizations</span>
            </h2>
            <p className="text-xs text-zinc-500 font-semibold">
              Highest community solidarity and direct municipal authority tracking.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingReports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      </div>

      {/* =========================================================================
          STAGE 5: COMMUNITY NOTICES BENTO TILE
         ========================================================================= */}
      <div className="p-6 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#E2FF4D] text-black border-2 border-black">
              <MessageSquare className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-black">
                Ward Announcements & Discussions
              </h3>
              <p className="text-xs text-zinc-500 font-semibold">
                Neighborhood dialogue in {selectedCommunity.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-black uppercase tracking-wider text-black hover:text-[#FF5C00] cursor-pointer"
          >
            Open Community Feed →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {communityPosts.slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-[20px] bg-zinc-50 border-2 border-black text-xs text-black space-y-2"
            >
              <div className="flex items-center justify-between font-black">
                <span className="flex items-center gap-2">
                  <span className="uppercase tracking-tight">{p.authorName}</span>
                  {p.isNotice && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FF5C00] text-white font-black border border-black uppercase">
                      Notice
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">{p.timestamp}</span>
              </div>
              <p className="font-medium text-zinc-700 leading-relaxed">{p.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
