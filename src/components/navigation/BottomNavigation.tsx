import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  MessageSquare,
  Map,
  FileText,
  User,
  Plus
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsReportWizardOpen } = useApp();

  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-30 bg-white border-2 border-black rounded-[24px] px-2 py-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-around max-w-lg mx-auto relative">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-[#E2FF4D] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-zinc-600 hover:text-black border-2 border-transparent'
          }`}
          id="tab-home-btn"
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5">Hub</span>
        </button>

        {/* Community */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
            activeTab === 'community'
              ? 'bg-[#E2FF4D] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-zinc-600 hover:text-black border-2 border-transparent'
          }`}
          id="tab-community-btn"
        >
          <MessageSquare className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5">Feed</span>
        </button>

        {/* Center Report Problem CTA */}
        <div className="relative -top-6 flex flex-col items-center">
          <button
            onClick={() => setIsReportWizardOpen(true)}
            className="w-13 h-13 rounded-full bg-[#FF5C00] text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            id="mobile-report-fab-btn"
            title="Report a Civic Problem"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
          <span className="text-[9px] font-black text-black uppercase tracking-wider mt-0.5">Report</span>
        </div>

        {/* Map */}
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-[#E2FF4D] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-zinc-600 hover:text-black border-2 border-transparent'
          }`}
          id="tab-map-btn"
        >
          <Map className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5">Grid</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#E2FF4D] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'text-zinc-600 hover:text-black border-2 border-transparent'
          }`}
          id="tab-profile-btn"
        >
          <User className="w-4 h-4 stroke-[2.5]" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
