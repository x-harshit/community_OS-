import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon, getCategoryColor, getStatusConfig } from '../CategoryIcon';
import {
  X,
  MapPin,
  Building2,
  Users,
  ThumbsUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Shield,
  ShieldCheck,
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ReportStatus } from '../../types';

export const ReportDetailModal: React.FC = () => {
  const {
    selectedReportId,
    setSelectedReportId,
    reports,
    identity,
    supportReport,
    markAffected,
    followReport,
    addCommentToReport,
    addEvidenceToReport,
    comments,
    categories,
    assignTeam,
    updateReportStatus,
    postOfficialUpdate,
    resolveReportWithProof,
    authorities,
    deleteReport
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [evidenceCaption, setEvidenceCaption] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Authority Quick Action state
  const [isOfficerPanelOpen, setIsOfficerPanelOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [officialUpdateMsg, setOfficialUpdateMsg] = useState('');
  const [resolutionProofNote, setResolutionProofNote] = useState('');
  const [resolutionProofUrl, setResolutionProofUrl] = useState('');

  if (!selectedReportId) return null;

  const report = reports.find((r) => r.id === selectedReportId);
  if (!report) return null;

  const category = categories.find((c) => c.id === report.categoryId);
  const colors = getCategoryColor(report.categoryId);
  const statusCfg = getStatusConfig(report.status);
  const reportComments = comments[report.id] || [];

  const isAffected = identity.affectedReportIds.includes(report.id);
  const isSupported = identity.supportedReportIds.includes(report.id);
  const isFollowed = identity.followedReportIds.includes(report.id);

  const authorityData = authorities.find((a) => a.id === report.authorityId);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentToReport(report.id, commentText);
    setCommentText('');
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const url =
      evidenceUrl.trim() ||
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80';
    addEvidenceToReport(report.id, {
      url,
      mediaType: 'image',
      caption: evidenceCaption || 'Additional photo evidence from community'
    });
    setEvidenceUrl('');
    setEvidenceCaption('');
    setIsAddingEvidence(false);
  };

  const handleAssignTeamAction = () => {
    const team = selectedTeam || 'Emergency Field Unit 1';
    assignTeam(report.id, team);
    setSelectedTeam('');
  };

  const handleStatusChangeAction = (newStatus: ReportStatus) => {
    updateReportStatus(report.id, newStatus, statusNote || `Status changed to ${newStatus}`);
    setStatusNote('');
  };

  const handleOfficialUpdateAction = () => {
    if (!officialUpdateMsg.trim()) return;
    postOfficialUpdate(report.id, officialUpdateMsg, 'Site verification logged');
    setOfficialUpdateMsg('');
  };

  const handleResolveAction = () => {
    const url =
      resolutionProofUrl.trim() ||
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80';
    const note =
      resolutionProofNote.trim() ||
      'Field crew completed repair and verified site clearance. Signed off by Municipal Inspector.';

    resolveReportWithProof(report.id, url, note);
    setResolutionProofUrl('');
    setResolutionProofNote('');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Lifecycle steps
  const lifecycleSteps: { status: ReportStatus; label: string }[] = [
    { status: 'SUBMITTED', label: 'Submitted' },
    { status: 'SENT_TO_AUTHORITY', label: 'Routed' },
    { status: 'ASSIGNED', label: 'Assigned' },
    { status: 'IN_PROGRESS', label: 'In Work' },
    { status: 'RESOLVED', label: 'Resolved' }
  ];

  const currentStepIndex = lifecycleSteps.findIndex((s) => s.status === report.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] border-2 border-black overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Bar */}
        <div className="p-5 border-b-2 border-black flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${colors.bg} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
              <CategoryIcon iconName={category?.icon || 'AlertCircle'} className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-black bg-black text-white px-2 py-0.5 rounded-md">
                  {report.id}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase border-2 border-black ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black line-clamp-1 mt-1">
                {report.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setSelectedReportId(null)}
            className="p-1.5 rounded-xl border-2 border-black text-black hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* VISUAL STATUS LIFECYCLE TIMELINE (Bento) */}
          <div className="p-5 rounded-[26px] bg-zinc-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-tight text-black">
                Official Case Lifecycle
              </span>
              <span className="text-[11px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded-md border border-black">
                Target SLA: {report.escalationHours}h
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="relative flex items-center justify-between pt-2">
              <div className="absolute left-4 right-4 top-5 h-[2px] bg-zinc-300 -z-0" />
              <div
                className="absolute left-4 top-5 h-[2px] bg-black -z-0 transition-all duration-500"
                style={{
                  width: `${Math.max(0, (currentStepIndex / (lifecycleSteps.length - 1)) * 100)}%`
                }}
              />

              {lifecycleSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.status} className="flex flex-col items-center gap-1 z-10">
                    <div
                      className={`w-7 h-7 rounded-lg border-2 border-black flex items-center justify-center text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-[#E2FF4D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-110'
                          : isPassed
                          ? 'bg-black text-white'
                          : 'bg-white text-zinc-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] text-center font-black uppercase max-w-[65px] leading-tight ${
                        isCurrent ? 'text-black' : isPassed ? 'text-zinc-700' : 'text-zinc-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Latest timeline note */}
            {report.statusHistory.length > 0 && (
              <div className="pt-3 border-t-2 border-black flex items-center justify-between text-[11px] text-zinc-600 font-bold">
                <span>
                  Latest event: <strong>{report.statusHistory[report.statusHistory.length - 1].note}</strong>
                </span>
                <span className="font-mono">
                  {new Date(report.statusHistory[report.statusHistory.length - 1].timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>

          {/* DUAL DESTINATION BANNER: COMMUNITY + AUTHORITY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Community Destination */}
            <div className="p-4 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center gap-2 text-black text-xs font-black uppercase">
                <Users className="w-4 h-4 text-[#FF5C00] stroke-[2.5]" />
                <span>👥 Community Destination</span>
              </div>
              <div className="text-xs text-zinc-700 space-y-1 font-medium">
                <p>
                  Reported by: <strong>{report.isAnonymous ? 'Anonymous Resident' : report.authorName}</strong>
                </p>
                <p>
                  Approximate: <strong>{report.approximateLocation}</strong>
                </p>
                <div className="flex items-center gap-3 pt-1 text-black font-black uppercase text-[10px]">
                  <span>{report.affectedCount} Affected</span>
                  <span>•</span>
                  <span>{report.supportedCount} Backed</span>
                </div>
              </div>
            </div>

            {/* Authority Destination */}
            <div className="p-4 rounded-[24px] bg-[#E2FF4D]/30 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black text-xs font-black uppercase">
                  <Building2 className="w-4 h-4 stroke-[2.5]" />
                  <span>🏛️ Authority Destination</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-black text-white font-black uppercase">
                  Delivered ✓
                </span>
              </div>
              <div className="text-xs text-black space-y-1">
                <p className="font-black uppercase tracking-tight">{report.authorityName}</p>
                <p className="text-[11px] text-zinc-700 font-semibold">Dept: {report.department}</p>
                <p className="text-[11px] text-zinc-700 font-semibold">
                  Field unit: <strong>{report.assignedTeam || 'Awaiting assignment'}</strong>
                </p>
                <div className="pt-1 border-t border-zinc-200 text-[10px] text-zinc-700 font-mono space-y-0.5">
                  <div className="font-bold">
                    GPS: {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                    {report.accuracy ? ` (±${Math.round(report.accuracy)}m)` : ''}
                  </div>
                  <div>
                    Source: {report.locationSource === 'device_gps' ? 'Device Native GPS' : 'Manual Entry'}
                    {report.locationTimestamp ? ` • ${new Date(report.locationTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                  </div>
                  <div className="text-[10px] text-zinc-800 font-sans font-semibold">
                    Address: {report.exactAddress}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESOLUTION PROOF (IF RESOLVED) */}
          {report.status === 'RESOLVED' && (
            <div className="p-5 rounded-[26px] bg-[#E2FF4D]/40 border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-black font-black uppercase text-sm">
                  <Sparkles className="w-5 h-5 stroke-[2.5]" />
                  <span>Official Resolution Proof</span>
                </div>
                <span className="text-xs bg-black text-white px-3 py-1 rounded-full font-black uppercase border border-black">
                  Verified Closed 🟢
                </span>
              </div>

              {report.resolutionNote && (
                <p className="text-xs text-black leading-relaxed font-bold bg-white p-3.5 rounded-[18px] border-2 border-black">
                  "{report.resolutionNote}"
                </p>
              )}

              {/* Side-by-side Before and After */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">
                    Before (Citizen Report)
                  </span>
                  <div className="rounded-[18px] overflow-hidden aspect-video bg-zinc-900 border-2 border-black">
                    <img
                      src={report.evidence[0]?.url}
                      alt="Before"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">
                    After (Official Squad Proof)
                  </span>
                  <div className="rounded-[18px] overflow-hidden aspect-video bg-zinc-900 border-2 border-black ring-2 ring-black">
                    <img
                      src={report.resolutionEvidence?.[0]?.url || report.evidence[0]?.url}
                      alt="After"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DESCRIPTION & EVIDENCE GALLERY */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-tight text-black">
              Description & Evidence
            </h3>
            <p className="text-xs sm:text-sm text-black font-medium leading-relaxed bg-zinc-50 p-4 rounded-[20px] border-2 border-black">
              {report.description}
            </p>

            {/* Evidence Gallery */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-tight text-black">
                  Attached Field Evidence ({report.evidence.length})
                </span>
                <button
                  onClick={() => setIsAddingEvidence(!isAddingEvidence)}
                  className="text-xs font-black uppercase tracking-wider text-[#FF5C00] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Add More Evidence</span>
                </button>
              </div>

              {/* Add Evidence Form */}
              {isAddingEvidence && (
                <form
                  onSubmit={handleAddEvidenceSubmit}
                  className="p-4 rounded-[22px] bg-zinc-50 border-2 border-black space-y-3"
                >
                  <span className="text-xs font-black uppercase tracking-tight text-black block">
                    Upload Additional Resident Evidence
                  </span>
                  <input
                    type="text"
                    placeholder="Image URL (or leave blank to use sample photo)"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-black text-xs bg-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Evidence caption (e.g. Photo taken from Block B corner)"
                    value={evidenceCaption}
                    onChange={(e) => setEvidenceCaption(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-black text-xs bg-white font-bold"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsAddingEvidence(false)}
                      className="px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black uppercase text-black hover:bg-zinc-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#FF5C00] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      Upload Evidence
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {report.evidence.map((ev) => (
                  <div
                    key={ev.id}
                    className="relative group rounded-[18px] overflow-hidden aspect-video bg-zinc-900 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <img
                      src={ev.url}
                      alt={ev.caption || 'Evidence'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 text-[10px] text-white">
                      <p className="truncate font-black uppercase">{ev.caption}</p>
                      <p className="text-[9px] text-zinc-300 font-bold">By {ev.uploadedByName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OFFICIAL VERIFIED UPDATES */}
          {report.officialUpdates.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-black uppercase tracking-tight text-black flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Verified Authority Communications</span>
              </h3>

              <div className="space-y-2">
                {report.officialUpdates.map((up) => (
                  <div
                    key={up.id}
                    className="p-4 rounded-[22px] bg-[#E2FF4D]/25 border-2 border-black space-y-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black uppercase text-black">🏛️ {up.officerName}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-black text-white font-black uppercase">
                          {up.officerRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-600 font-mono font-bold">
                        {new Date(up.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-black leading-relaxed font-bold">
                      "{up.message}"
                    </p>
                    {up.actionTaken && (
                      <p className="text-[11px] text-zinc-700 font-bold pt-0.5">
                        Action Taken: {up.actionTaken}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUTHORITY CONTROL PANEL TOGGLE */}
          <div className="pt-2 border-t-2 border-black">
            <button
              onClick={() => setIsOfficerPanelOpen(!isOfficerPanelOpen)}
              className="w-full py-3 px-4 rounded-[20px] bg-[#E2FF4D] text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] text-xs font-black uppercase tracking-wider flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 stroke-[2.5]" />
                <span>Officer Command Desk (Assign, Status, Proof)</span>
              </div>
              <span className="text-[11px] font-black uppercase">
                {isOfficerPanelOpen ? 'Collapse ▲' : 'Expand Desk ▼'}
              </span>
            </button>

            {isOfficerPanelOpen && (
              <div className="mt-4 p-5 rounded-[26px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-tight text-black">
                    Municipal Operations Desk
                  </span>
                  <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-black text-white font-black uppercase">
                    Officer Simulation
                  </span>
                </div>

                {/* Assign Team */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-black">Assign Field Squad</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border-2 border-black bg-white text-xs font-bold"
                    >
                      <option value="">Choose dispatch unit...</option>
                      {authorityData?.teams.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      <option value="Rapid Response Squad 4">Rapid Response Squad 4</option>
                    </select>
                    <button
                      onClick={handleAssignTeamAction}
                      className="px-4 py-2 rounded-xl bg-black text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      Assign
                    </button>
                  </div>
                </div>

                {/* Transition Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-black">Update Stage</label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleStatusChangeAction('ASSIGNED')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#E2FF4D] text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      Mark Assigned
                    </button>
                    <button
                      onClick={() => handleStatusChangeAction('IN_PROGRESS')}
                      className="px-3.5 py-1.5 rounded-xl bg-white text-black border-2 border-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      Mark In Progress
                    </button>
                  </div>
                </div>

                {/* Post Official Update */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-black">
                    Post Verified Official Notice
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Squad on site. Water pump installed."
                      value={officialUpdateMsg}
                      onChange={(e) => setOfficialUpdateMsg(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border-2 border-black bg-white text-xs font-bold"
                    >
                    </input>
                    <button
                      onClick={handleOfficialUpdateAction}
                      className="px-4 py-2 rounded-xl bg-black text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      Broadcast
                    </button>
                  </div>
                </div>

                {/* Upload Resolution Proof & Resolve */}
                <div className="p-4 bg-[#E2FF4D]/25 rounded-[22px] border-2 border-black space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase text-black">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Resolve With Photographic Proof</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Resolution Photo URL (or leave blank to use sample)"
                    value={resolutionProofUrl}
                    onChange={(e) => setResolutionProofUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-black text-xs bg-white font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Official note (e.g. Cleared and road repaired by squad)"
                    value={resolutionProofNote}
                    onChange={(e) => setResolutionProofNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-black text-xs bg-white font-bold"
                  />
                  <button
                    onClick={handleResolveAction}
                    className="w-full py-2.5 rounded-xl bg-[#22c55e] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 stroke-[2.5]" />
                    <span>Upload Proof & Mark Resolved 🟢</span>
                  </button>
                </div>

                {/* Admin Deletion & Moderation Box */}
                <div className="p-4 bg-rose-50 rounded-[22px] border-2 border-black space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-rose-950 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-rose-600 stroke-[2.5]" />
                      <span>Admin Case Purge & Moderation</span>
                    </span>
                    <span className="text-[10px] font-black uppercase bg-rose-600 text-white px-2 py-0.5 rounded-full border border-black">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-rose-900 leading-snug">
                    Permanently delete this report if it is confirmed spam, abusive, or duplicate.
                  </p>
                  
                  {isConfirmingDelete ? (
                    <div className="p-3 bg-white rounded-xl border-2 border-black space-y-2 animate-fadeIn">
                      <p className="text-xs font-black text-rose-600 uppercase">
                        Confirm permanent deletion of #{report.id}?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            deleteReport(report.id, 'Purged by Admin from case inspector modal');
                            setSelectedReportId(null);
                          }}
                          className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                        >
                          Yes, Delete Case
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsConfirmingDelete(false)}
                          className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(true)}
                      className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Permanently Delete Report</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* COMMUNITY DISCUSSION / COMMENTS */}
          <div className="space-y-3 pt-2 border-t-2 border-black">
            <h3 className="text-xs font-black uppercase tracking-tight text-black">
              Community Discussion ({reportComments.length})
            </h3>

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add citizen observation or update..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:outline-none bg-zinc-50 focus:bg-white"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-black text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition cursor-pointer"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-2.5">
              {reportComments.length === 0 ? (
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider text-center py-4">
                  No comments yet. Share an observation!
                </p>
              ) : (
                reportComments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-[18px] border-2 border-black text-xs leading-relaxed ${
                      c.isOfficial
                        ? 'bg-[#E2FF4D]/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black uppercase tracking-tight text-black">{c.authorName}</span>
                        {c.isOfficial && (
                          <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full font-black uppercase">
                            Official {c.authorityRole}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono font-bold">{c.timestamp}</span>
                    </div>
                    <p className="font-medium text-black">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Bottom Bar */}
        <div className="p-4 border-t-2 border-black bg-white flex items-center justify-between gap-3">
          {/* I'm Also Affected */}
          <button
            onClick={() => markAffected(report.id)}
            disabled={isAffected}
            className={`py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-black transition cursor-pointer ${
              isAffected
                ? 'bg-zinc-200 text-zinc-600 border-zinc-400 cursor-not-allowed'
                : 'bg-[#FF5C00] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]'
            }`}
          >
            <Users className="w-4 h-4 stroke-[2.5]" />
            <span>{isAffected ? "✓ You're Affected" : "🙋 I'm Also Affected"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => supportReport(report.id)}
              className={`py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                isSupported
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isSupported ? 'Supported' : 'Support'}</span>
            </button>

            <button
              onClick={() => followReport(report.id)}
              className={`py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                isFollowed
                  ? 'bg-[#E2FF4D] text-black'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isFollowed ? 'Tracking' : 'Track'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
