import React from 'react';
import { CommunityOSLogo } from './CommunityOSLogo';
import { Shield, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { selectedCommunity, reports, setActiveTab } = useApp();
  const currentYear = new Date().getFullYear();
  const resolvedReports = reports.filter((r) => r.status === 'RESOLVED').length;

  return (
    <footer className="w-full bg-white border-t-2 border-black mt-auto pt-8 pb-28 sm:pb-32 md:pb-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Section: Logo & Brand Pitch + Quick Meta Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
          {/* Left: Brand & Tagline */}
          <div className="space-y-2.5 max-w-xl">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="cursor-pointer text-left focus:outline-none block"
            >
              <CommunityOSLogo size="md" variant="image" showBadge={true} />
            </button>
            <p className="text-xs sm:text-sm text-zinc-600 font-semibold leading-relaxed">
              Decentralized municipal dispatch system connecting residents, local ward councils, and civic authorities with deterministic routing and photo-verified resolution.
            </p>
          </div>

          {/* Right: Live Community Meta Badges */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-zinc-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-black flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#FF5C00] stroke-[2.5]" />
              <span>{selectedCommunity.name} • Ward {selectedCommunity.wardNumber}</span>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-[#E2FF4D] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-black flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{reports.length} Total Cases</span>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>{resolvedReports} Resolved</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Copyright & Creator Attribution */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Copyright & Team Branding */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-xs sm:text-sm font-black text-black">
                © {currentYear} community_OS.
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-black text-white text-[11px] font-black uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                All rights reserved "Ctrl Alt Defeat"
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-bold">
              Civic Infrastructure Operating System for Modern Smart Cities
            </p>
          </div>

          {/* Author / Creator Pill */}
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF5C00] text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wider hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
              <Sparkles className="w-4 h-4 text-[#E2FF4D] stroke-[2.5] shrink-0" />
              <span>Made by Harshit Kumar Nigam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
