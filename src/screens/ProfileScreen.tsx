import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Shield,
  Settings,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  FileText,
  Clock,
  EyeOff,
  Bell,
  Sparkles,
  Building2,
  Lock,
  Navigation,
  Crosshair,
  Loader2
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    identity,
    updateDisplayName,
    toggleAnonymous,
    switchRole,
    selectedCommunity,
    allCommunities,
    switchCommunity,
    reports,
    setActiveTab,
    isAdminAuthenticated,
    adminUsername,
    useCurrentLocation,
    isDetectingLocation,
    isUsingCurrentLocation,
    locationStatusMessage
  } = useApp();

  const [nameInput, setNameInput] = useState(identity.displayName);
  const [isEditingName, setIsEditingName] = useState(false);

  const myReports = reports.filter((r) => r.createdBy === identity.id);
  const supportedCount = identity.supportedReportIds.length;
  const followedCount = identity.followedReportIds.length;
  const resolvedInCommunity = reports.filter((r) => r.status === 'RESOLVED').length;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    updateDisplayName(nameInput);
    setIsEditingName(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 select-none">
      {/* Profile Header Bento Card */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-[22px] bg-[#E2FF4D] text-black border-2 border-black flex items-center justify-center font-black text-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              {identity.isAnonymous ? 'A' : identity.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                  {identity.isAnonymous ? 'Anonymous Resident' : identity.displayName}
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black text-white font-black uppercase tracking-wider border border-black">
                  Guest-First
                </span>
              </div>
              <p className="text-xs text-zinc-600 font-bold mt-1">
                Ward: <strong>{selectedCommunity.name}</strong> • {selectedCommunity.wardNumber}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingName(!isEditingName)}
            className="px-4 py-2 rounded-xl border-2 border-black text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-zinc-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            {isEditingName ? 'Cancel' : 'Edit Name'}
          </button>
        </div>

        {/* Edit Name Form */}
        {isEditingName && (
          <form onSubmit={handleSaveName} className="p-4 bg-zinc-50 rounded-[20px] border-2 border-black space-y-2">
            <label className="text-xs font-black uppercase text-black block">Update Citizen Handle</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Harshit"
                className="flex-1 px-3 py-2 rounded-xl border-2 border-black bg-white text-xs font-bold focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF5C00] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        )}

        {/* Anonymous Mode Toggle */}
        <div className="p-4 rounded-[20px] bg-[#E2FF4D]/25 border-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-black text-white">
              <EyeOff className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-tight text-black">
                Incognito Civic Reporting
              </div>
              <div className="text-[11px] text-zinc-600 font-semibold">
                Submit complaints anonymously while still tracking resolutions.
              </div>
            </div>
          </div>

          <button
            onClick={toggleAnonymous}
            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition ${
              identity.isAnonymous
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            {identity.isAnonymous ? 'ON (Anonymous)' : 'OFF (Named)'}
          </button>
        </div>
      </div>

      {/* Civic Karma Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Filed by You</div>
          <div className="text-3xl font-black text-black">{myReports.length}</div>
          <div className="text-[10px] font-black uppercase tracking-tight text-black">Civic tickets</div>
        </div>

        <div className="p-5 rounded-[28px] bg-[#E2FF4D] border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-black">Supported</div>
          <div className="text-3xl font-black text-black">{supportedCount}</div>
          <div className="text-[10px] font-black uppercase tracking-tight text-black">Neighbor issues backed</div>
        </div>

        <div className="p-5 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Following</div>
          <div className="text-3xl font-black text-black">{followedCount}</div>
          <div className="text-[10px] font-black uppercase tracking-tight text-black">Live updates tracking</div>
        </div>

        <div className="p-5 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Ward Resolved</div>
          <div className="text-3xl font-black text-[#22c55e]">{resolvedInCommunity}</div>
          <div className="text-[10px] font-black uppercase tracking-tight text-[#22c55e]">With photo proof</div>
        </div>
      </div>

      {/* Role Switcher Bento Container */}
      <div className="p-6 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div>
          <h2 className="text-base font-black uppercase tracking-tight text-black">
            Platform Persona Simulator
          </h2>
          <p className="text-xs text-zinc-500 font-semibold">
            Test the entire multi-stakeholder civic cycle across roles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              role: 'RESIDENT' as const,
              title: 'Resident / Citizen',
              desc: 'Report issues, mark affected, join discussions'
            },
            {
              role: 'AUTHORITY_OFFICER' as const,
              title: 'Municipal Officer',
              desc: 'Dispatch crews, update status, upload proof'
            },
            {
              role: 'PLATFORM_ADMIN' as const,
              title: 'Platform Governor',
              desc: isAdminAuthenticated
                ? `Active Session (${adminUsername || 'Admin'})`
                : 'Restricted Access • Admin login required',
              isLocked: !isAdminAuthenticated
            }
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => {
                if (item.role === 'PLATFORM_ADMIN' && !isAdminAuthenticated) {
                  setActiveTab('admin');
                } else {
                  switchRole(item.role);
                  if (item.role === 'PLATFORM_ADMIN') setActiveTab('admin');
                  if (item.role === 'AUTHORITY_OFFICER') setActiveTab('authority');
                  if (item.role === 'RESIDENT') setActiveTab('home');
                }
              }}
              className={`p-4 rounded-[22px] border-2 border-black text-left transition cursor-pointer ${
                identity.role === item.role
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white hover:bg-zinc-50 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs uppercase tracking-tight">{item.title}</span>
                {identity.role === item.role ? (
                  <span className="w-2 h-2 rounded-full bg-[#E2FF4D]" />
                ) : (item as any).isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-[#FF5C00]" />
                ) : null}
              </div>
              <p className={`text-[11px] mt-1 font-medium leading-tight ${identity.role === item.role ? 'text-zinc-300' : 'text-zinc-500'}`}>
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Ward Switcher Bento Container */}
      <div className="p-6 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-black">
              Active Community Ward & Location
            </h2>
            <p className="text-xs text-zinc-500 font-semibold">
              Use live GPS detection or select a specific municipal ward.
            </p>
          </div>

          <button
            type="button"
            disabled={isDetectingLocation}
            onClick={() => useCurrentLocation()}
            className="px-4 py-2 rounded-xl bg-[#E2FF4D] hover:bg-[#d4f23b] text-black font-black text-xs uppercase tracking-tight border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Acquiring GPS...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isUsingCurrentLocation ? 'Re-sync GPS' : 'Auto-Detect Location'}</span>
              </>
            )}
          </button>
        </div>

        {/* Current Location Highlight Banner */}
        <div
          onClick={() => switchCommunity('current-location')}
          className={`p-4 rounded-[22px] border-2 border-black transition cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isUsingCurrentLocation
              ? 'bg-[#E2FF4D] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-zinc-50 hover:bg-zinc-100 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#22c55e] text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Navigation className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tight">
                <span>Your Current Location</span>
                {isUsingCurrentLocation && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-black text-white font-black">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-zinc-600 mt-0.5">
                {locationStatusMessage || 'Automatic GPS coordinates & nearby municipal jurisdiction'}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-black text-black">
            GPS Auto-Detect
          </span>
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
            Preset Municipal Wards & Sectors
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allCommunities
              .filter((c) => c.id !== 'current-location')
              .map((c) => {
                const isSelected = c.id === selectedCommunity.id && !isUsingCurrentLocation;
                return (
                  <button
                    key={c.id}
                    onClick={() => switchCommunity(c.id)}
                    className={`p-4 rounded-[22px] border-2 border-black text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold'
                        : 'bg-white hover:bg-zinc-50 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs uppercase tracking-tight">{c.name}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-black ${
                        isSelected ? 'bg-[#E2FF4D] text-black' : 'bg-black text-white'
                      }`}>
                        {c.wardNumber}
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium mt-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {c.city}, {c.state} • {c.memberCount.toLocaleString()} residents
                    </p>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
