import React from 'react';
import { CivicReport } from '../../types';
import { useApp } from '../../context/AppContext';
import { CategoryIcon, getCategoryColor, getStatusConfig } from '../CategoryIcon';
import {
  MapPin,
  Users,
  ThumbsUp,
  MessageSquare,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ReportCardProps {
  report: CivicReport;
  onSelect?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onSelect }) => {
  const {
    identity,
    supportReport,
    markAffected,
    followReport,
    categories,
    setSelectedReportId
  } = useApp();

  const category = categories.find((c) => c.id === report.categoryId);
  const colors = getCategoryColor(report.categoryId);
  const statusCfg = getStatusConfig(report.status);

  const isAffected = identity.affectedReportIds.includes(report.id);
  const isSupported = identity.supportedReportIds.includes(report.id);
  const isFollowed = identity.followedReportIds.includes(report.id);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      setSelectedReportId(report.id);
    }
  };

  return (
    <div
      className={`rounded-[28px] border-2 border-black p-4 sm:p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 flex flex-col justify-between select-none overflow-hidden relative ${
        report.status === 'RESOLVED' ? 'bg-[#f4fcf6]' : 'bg-white'
      }`}
      id={`report-card-${report.id}`}
    >
      <div className="space-y-3">
        {/* Top Bar: Category + Status Badge + ID */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${colors.bg}`}>
              <CategoryIcon iconName={category?.icon || 'AlertCircle'} className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-tight text-black block leading-tight">
                {category?.name || 'Civic Issue'}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono font-bold">
                #{report.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border-2 border-black flex items-center gap-1.5 ${statusCfg.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              <span>{statusCfg.label}</span>
            </span>
          </div>
        </div>

        {/* Main Content (Clickable to open details) */}
        <div onClick={handleCardClick} className="cursor-pointer group space-y-1.5">
          <h3 className="text-base font-black text-black group-hover:text-[#FF5C00] transition-colors leading-snug uppercase tracking-tight">
            {report.title}
          </h3>

          <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-medium">
            {report.description}
          </p>

          {/* Location & Authority Tag */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 pt-1 text-[11px] font-bold text-black">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF5C00] stroke-[2.5] shrink-0" />
              <span className="truncate max-w-[190px]">{report.approximateLocation}</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-600">
              <Building2 className="w-3.5 h-3.5 text-black stroke-[2] shrink-0" />
              <span className="truncate max-w-[170px]">{report.authorityName}</span>
            </div>
          </div>
        </div>

        {/* Evidence Thumbnail Strip (Before vs After if resolved) */}
        {report.status === 'RESOLVED' && report.resolutionEvidence && report.resolutionEvidence.length > 0 ? (
          <div
            onClick={handleCardClick}
            className="p-2.5 rounded-2xl bg-[#E2FF4D]/30 border-2 border-black cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-black">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-black stroke-[2.5]" />
                <span>Resolution Proof Verified</span>
              </span>
              <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px] font-black">
                BEFORE & AFTER
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative rounded-xl border-2 border-black overflow-hidden aspect-video bg-zinc-200">
                <img
                  src={report.evidence[0]?.url}
                  alt="Before"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black text-white text-[9px] font-black rounded uppercase">
                  BEFORE
                </span>
              </div>
              <div className="relative rounded-xl border-2 border-black overflow-hidden aspect-video bg-zinc-200">
                <img
                  src={report.resolutionEvidence[0]?.url}
                  alt="After"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-[#22c55e] text-black border border-black text-[9px] font-black rounded uppercase">
                  FIXED ✓
                </span>
              </div>
            </div>
          </div>
        ) : report.evidence.length > 0 ? (
          <div onClick={handleCardClick} className="cursor-pointer">
            <div className="relative rounded-2xl border-2 border-black overflow-hidden aspect-video max-h-48 bg-zinc-900">
              <img
                src={report.evidence[0].url}
                alt="Report evidence"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {report.evidence.length > 1 && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black text-white text-[10px] font-black border border-white">
                  +{report.evidence.length - 1} PHOTOS
                </span>
              )}
              <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-black uppercase tracking-wider">
                By {report.isAnonymous ? 'Anonymous' : report.authorName}
              </div>
            </div>
          </div>
        ) : null}

        {/* Official Update Callout if present */}
        {report.officialUpdates && report.officialUpdates.length > 0 && (
          <div
            onClick={handleCardClick}
            className="p-2.5 rounded-xl bg-zinc-100 border-2 border-black text-xs flex items-start gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-black stroke-[2.5] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="font-black text-black text-[11px] uppercase truncate max-w-full">
                  🏛️ {report.officialUpdates[report.officialUpdates.length - 1].officerName}
                </span>
                <span className="text-[10px] font-bold text-zinc-600 truncate">
                  • {report.officialUpdates[report.officialUpdates.length - 1].officerRole}
                </span>
              </div>
              <p className="text-black text-xs line-clamp-1 mt-0.5 font-medium">
                "{report.officialUpdates[report.officialUpdates.length - 1].message}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Details and Actions */}
      <div className="mt-4 pt-3 border-t-2 border-black/10 space-y-3">
        {/* Community Impact Metrics Strip */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 text-xs text-black font-bold">
          <div className="flex items-center gap-2.5 flex-wrap min-w-0">
            <span className="flex items-center gap-1 font-black text-[#FF5C00] whitespace-nowrap text-[11px]">
              <Users className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
              <span>{report.affectedCount} Affected</span>
            </span>
            <span className="flex items-center gap-1 text-zinc-600 whitespace-nowrap text-[11px]">
              <ThumbsUp className="w-3.5 h-3.5 stroke-[2] shrink-0" />
              <span>{report.supportedCount}</span>
            </span>
            <span className="flex items-center gap-1 text-zinc-600 whitespace-nowrap text-[11px]">
              <MessageSquare className="w-3.5 h-3.5 stroke-[2] shrink-0" />
              <span>{report.commentsCount}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleCardClick}
            className="text-[11px] font-black uppercase tracking-wider text-black hover:text-[#FF5C00] flex items-center gap-0.5 cursor-pointer shrink-0 ml-auto whitespace-nowrap"
          >
            <span>Timeline</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
          </button>
        </div>

        {/* Action Footer: "I'm Also Affected" + Support + Follow Bento Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full min-w-0">
          {/* Core Product Differentiator: I'm Also Affected */}
          <button
            type="button"
            onClick={() => markAffected(report.id)}
            disabled={isAffected}
            className={`flex-1 min-w-0 py-2 px-2.5 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-tight flex items-center justify-center gap-1 border-2 border-black transition-all cursor-pointer truncate ${
              isAffected
                ? 'bg-[#E2FF4D] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
            title="Attach yourself to this civic report so authorities see real resident impact"
          >
            <Users className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            <span className="truncate">{isAffected ? "✓ Affected" : "🙋 I'm Affected"}</span>
          </button>

          {/* Support Button */}
          <button
            type="button"
            onClick={() => supportReport(report.id)}
            className={`py-2 px-2.5 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs uppercase tracking-tight border-2 border-black transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
              isSupported
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
            title="Support this civic report"
          >
            <ThumbsUp className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />
            <span>{isSupported ? 'Voted' : 'Vote'}</span>
          </button>

          {/* Follow Button */}
          <button
            type="button"
            onClick={() => followReport(report.id)}
            className={`p-2 rounded-xl border-2 border-black transition-all cursor-pointer shrink-0 flex items-center justify-center ${
              isFollowed
                ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white hover:bg-zinc-100 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
            }`}
            title="Receive notifications when status changes"
          >
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
