import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  MapPin,
  ChevronDown,
  Shield,
  User,
  Settings,
  PlusCircle,
  CheckCircle2,
  Radio,
  Zap,
  Lock,
  Navigation,
  Crosshair,
  Loader2
} from 'lucide-react';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

export const Navbar: React.FC = () => {
  const {
    selectedCommunity,
    allCommunities,
    switchCommunity,
    identity,
    switchRole,
    unreadNotificationsCount,
    setIsReportWizardOpen,
    setActiveTab,
    isAdminAuthenticated,
    adminUsername,
    isDetectingLocation,
    useCurrentLocation,
    isUsingCurrentLocation,
    locationStatusMessage
  } = useApp();

  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#f8f9fa] border-b-2 border-black px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand & Community Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 sm:flex-initial">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 sm:gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
              id="nav-brand-btn"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border-2 border-black p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-all shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="community_OS logo"
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tighter text-black block leading-none">
                    community<span className="text-[#2563EB]">_OS</span>
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-[#E2FF4D] text-black font-black text-[9px] sm:text-[10px] uppercase tracking-wider border border-black">
                    v2.4
                  </span>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mt-0.5">
                  Civic Action & Authority Command
                </span>
              </div>
            </button>

            <div className="h-6 w-0.5 bg-black/20 hidden sm:block shrink-0" />

            {/* Community Selector Bento Pill */}
            <div className="relative min-w-0 max-w-[140px] xs:max-w-[190px] sm:max-w-[260px] md:max-w-none">
              <button
                onClick={() => setIsCommunityDropdownOpen(!isCommunityDropdownOpen)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl border-2 border-black text-xs sm:text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer w-full min-w-0 ${
                  isUsingCurrentLocation
                    ? 'bg-white text-black'
                    : 'bg-white hover:bg-zinc-50 text-black'
                }`}
                id="community-selector-btn"
                title="Change location or auto-detect GPS"
              >
                {isUsingCurrentLocation ? (
                  <Navigation className="w-3.5 h-3.5 text-[#22c55e] stroke-[3] shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-[#FF5C00] stroke-[2.5] shrink-0" />
                )}
                <span className="truncate uppercase tracking-tight text-[11px] sm:text-xs">
                  {selectedCommunity.name}
                </span>
                {isUsingCurrentLocation ? (
                  <>
                    <span className="sm:hidden relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]" />
                    </span>
                    <span className="hidden sm:inline-flex text-[9px] px-2 py-0.5 rounded-full bg-[#E2FF4D] text-black border border-black font-black items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                      GPS ACTIVE
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E2FF4D] text-black border border-black font-black hidden md:inline-block shrink-0">
                    {selectedCommunity.memberCount.toLocaleString()}
                  </span>
                )}
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black stroke-[3] shrink-0 ml-auto" />
              </button>

              {isCommunityDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCommunityDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-[24px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-2 z-50 overflow-hidden">
                    {/* Primary Option: Your Current Location with Auto-Detect */}
                    <div className="p-3 mb-2 rounded-[18px] bg-gradient-to-br from-[#E2FF4D]/25 to-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-[#22c55e] text-white flex items-center justify-center border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            <Navigation className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-tight text-black flex items-center gap-1.5">
                              <span>Your Current Location</span>
                              {isUsingCurrentLocation && (
                                <span className="w-2 h-2 rounded-full bg-[#22c55e] border border-black animate-ping" />
                              )}
                            </p>
                            <p className="text-[10px] text-zinc-600 font-bold">
                              {isUsingCurrentLocation ? 'Live GPS Active' : 'Automatic GPS / local detection'}
                            </p>
                          </div>
                        </div>

                        {isUsingCurrentLocation && (
                          <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full font-black uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          disabled={isDetectingLocation}
                          onClick={async () => {
                            await useCurrentLocation();
                            setIsCommunityDropdownOpen(false);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#E2FF4D] hover:bg-[#d4f23b] active:translate-y-[1px] text-black font-black text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          id="auto-detect-gps-btn"
                        >
                          {isDetectingLocation ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Detecting...</span>
                            </>
                          ) : (
                            <>
                              <Crosshair className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>{isUsingCurrentLocation ? 'Refresh GPS' : 'Use Current Location'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {locationStatusMessage && (
                        <p className="text-[10px] text-zinc-700 font-semibold mt-2 px-1">
                          📍 {locationStatusMessage}
                        </p>
                      )}
                    </div>

                    {/* Preset Municipal Wards header */}
                    <div className="px-3 py-1.5 border-b border-black/10">
                      <p className="text-[10px] uppercase tracking-widest font-black text-zinc-500">
                        Or Browse Other Wards
                      </p>
                    </div>

                    {/* List other communities */}
                    <div className="max-h-56 overflow-y-auto space-y-1 pt-1">
                      {allCommunities
                        .filter(c => c.id !== 'current-location')
                        .map((c) => {
                          const isSelected = c.id === selectedCommunity.id && !isUsingCurrentLocation;
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                switchCommunity(c.id);
                                setIsCommunityDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 text-xs font-bold transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-black text-white border-black font-black'
                                  : 'hover:bg-zinc-100 text-black border-transparent'
                              }`}
                            >
                              <MapPin className={`w-3.5 h-3.5 shrink-0 mt-0.5 stroke-[2.5] ${isSelected ? 'text-[#E2FF4D]' : 'text-zinc-500'}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between uppercase tracking-tight">
                                  <span className="truncate">{c.name}</span>
                                  {isSelected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E2FF4D] stroke-[3]" />
                                  )}
                                </div>
                                <p className={`text-[10px] truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-500'} font-semibold normal-case`}>
                                  {c.wardNumber} • {c.memberCount.toLocaleString()} residents
                                </p>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Actions: Role Switcher, Notifications, Quick Report */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Live Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] border border-black animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider">MUNICIPAL GRID ONLINE</span>
            </div>

            {/* Role Switcher Pill (Bento style) */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer shrink-0 ${
                  identity.role === 'AUTHORITY_OFFICER'
                    ? 'bg-[#E2FF4D] text-black'
                    : identity.role === 'PLATFORM_ADMIN'
                    ? 'bg-[#FF5C00] text-white'
                    : 'bg-white text-black hover:bg-zinc-50'
                }`}
                id="role-switcher-btn"
                title="Switch role to test Authority Dashboard or Resident perspective"
              >
                {identity.role === 'AUTHORITY_OFFICER' ? (
                  <Shield className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                ) : identity.role === 'PLATFORM_ADMIN' ? (
                  <Settings className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                ) : (
                  <User className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
                )}
                <span className="hidden sm:inline uppercase tracking-tight text-[11px]">
                  {identity.role === 'AUTHORITY_OFFICER'
                    ? 'Officer'
                    : identity.role === 'PLATFORM_ADMIN'
                    ? 'Admin'
                    : 'Resident'}
                </span>
                <ChevronDown className="w-3 h-3 stroke-[2.5] shrink-0" />
              </button>

              {isRoleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-24px)] bg-white rounded-[24px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b-2 border-black/10 bg-zinc-50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Switch Perspective
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        switchRole('RESIDENT');
                        setIsRoleDropdownOpen(false);
                        setActiveTab('home');
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 text-xs font-bold text-black cursor-pointer border-b border-black/5"
                    >
                      <User className="w-4 h-4 stroke-[2.5]" />
                      <div>
                        <p className="font-black text-black uppercase tracking-tight">Resident (Citizen)</p>
                        <p className="text-[10px] text-zinc-500">Report problems & community feed</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('AUTHORITY_OFFICER');
                        setIsRoleDropdownOpen(false);
                        setActiveTab('authority');
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-zinc-100 text-xs font-bold text-black cursor-pointer border-b border-black/5"
                    >
                      <Shield className="w-4 h-4 stroke-[2.5]" />
                      <div>
                        <p className="font-black text-black uppercase tracking-tight">Authority Officer</p>
                        <p className="text-[10px] text-zinc-500">MCD / DJB / PWD Resolution desk</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setActiveTab('admin');
                      }}
                      className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-zinc-100 text-xs font-bold text-black cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {isAdminAuthenticated ? (
                          <Settings className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Lock className="w-4 h-4 stroke-[2.5] text-[#FF5C00]" />
                        )}
                        <div>
                          <p className="font-black text-black uppercase tracking-tight">
                            Platform Admin {isAdminAuthenticated ? `(${adminUsername || 'Harshitxdev'})` : ''}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {isAdminAuthenticated ? 'Routing rules & categories' : 'Protected • Login required'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-black border border-black ${
                        isAdminAuthenticated ? 'bg-[#E2FF4D] text-black' : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {isAdminAuthenticated ? 'ACTIVE' : 'LOCK'}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell Bento Button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-2xl bg-white hover:bg-zinc-50 border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer shrink-0 flex items-center justify-center"
              id="notifications-btn"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[2.5] shrink-0" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#FF5C00] text-white border sm:border-2 border-black rounded-full text-[9px] sm:text-[10px] font-black flex items-center justify-center leading-none z-10">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Desktop Report CTA - Bold Bento Button */}
            <button
              onClick={() => setIsReportWizardOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer shrink-0"
              id="desktop-report-problem-btn"
            >
              <PlusCircle className="w-4 h-4 stroke-[3] shrink-0" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
};
