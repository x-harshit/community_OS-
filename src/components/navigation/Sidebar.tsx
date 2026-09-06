import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  MessageSquare,
  Map,
  FileText,
  User,
  Shield,
  Settings,
  PlusCircle,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsReportWizardOpen,
    reports,
    selectedCommunity,
    isAdminAuthenticated
  } = useApp();

  const activeReportsCount = reports.filter(r => r.status !== 'RESOLVED').length;
  const resolvedCount = reports.filter(r => r.status === 'RESOLVED').length;

  const residentLinks = [
    { id: 'home', label: 'Command Hub', icon: Home },
    { id: 'community', label: 'Community Feed', icon: MessageSquare },
    { id: 'map', label: 'Live Grid Map', icon: Map },
    { id: 'reports', label: 'Civic Cases', icon: FileText, badge: activeReportsCount },
    { id: 'profile', label: 'Citizen Profile', icon: User }
  ];

  const adminLinks = [
    { id: 'authority', label: 'Authority Portal', icon: Shield, highlight: true },
    {
      id: 'admin',
      label: 'Admin & Routing',
      icon: isAdminAuthenticated ? Settings : Lock,
      badge: isAdminAuthenticated ? 'ACTIVE' : 'LOCKED',
      isLocked: !isAdminAuthenticated
    }
  ];

  return (
    <aside className="w-68 hidden md:flex flex-col shrink-0 py-6 pr-4 select-none justify-between h-[calc(100vh-65px)] sticky top-[65px]">
      <div className="space-y-5">
        {/* Prominent Bento CTA Button */}
        <div>
          <button
            onClick={() => setIsReportWizardOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            id="sidebar-report-btn"
          >
            <PlusCircle className="w-4 h-4 stroke-[3]" />
            <span>Report a Problem</span>
          </button>
        </div>

        {/* Community Navigation Bento Container */}
        <div className="bg-white border-2 border-black rounded-[24px] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Workspace
            </span>
            <span className="w-2 h-2 rounded-full bg-black"></span>
          </div>

          {residentLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E2FF4D] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-black border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border border-black ${
                    isActive ? 'bg-black text-white' : 'bg-zinc-100 text-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Authority & Admin Section */}
        <div className="bg-white border-2 border-black rounded-[24px] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Operations
            </span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-black text-white">GOV</span>
          </div>

          {adminLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tight transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-zinc-700 hover:bg-zinc-100 hover:text-black border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 stroke-[2.5]" />
                  <span>{item.label}</span>
                </div>
                {'badge' in item && item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border border-black ${
                    item.isLocked
                      ? 'bg-zinc-100 text-zinc-700'
                      : 'bg-[#E2FF4D] text-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mini Bento Card Footer */}
      <div className="bg-[#E2FF4D] border-2 border-black rounded-[24px] p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-black">
            Ward Pulse
          </span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-white border border-black">
            {selectedCommunity.wardNumber}
          </span>
        </div>
        <div className="text-xl font-black text-black">
          {resolvedCount}/{reports.length}
        </div>
        <p className="text-[10px] font-bold text-black/70">
          Cases resolved with photo proof
        </p>
      </div>
    </aside>
  );
};
