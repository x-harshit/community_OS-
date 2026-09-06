import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCategoryColor, getStatusConfig } from '../components/CategoryIcon';
import {
  Shield,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Search,
  ExternalLink,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  Send,
  Camera
} from 'lucide-react';

export const AuthorityDashboardScreen: React.FC = () => {
  const {
    reports,
    selectedCommunity,
    authorities,
    assignTeam,
    updateReportStatus,
    setSelectedReportId
  } = useApp();

  const [selectedAuthorityId, setSelectedAuthorityId] = useState<string>(authorities[0]?.id || 'auth-mcd-sanitation');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const currentAuthority = authorities.find((a) => a.id === selectedAuthorityId) || authorities[0];

  // Reports routed to this authority
  const authorityReports = reports.filter((r) => r.authorityId === currentAuthority.id);

  const newReportsCount = authorityReports.filter((r) => r.status === 'SUBMITTED' || r.status === 'SENT_TO_AUTHORITY').length;
  const assignedCount = authorityReports.filter((r) => r.status === 'ASSIGNED').length;
  const inProgressCount = authorityReports.filter((r) => r.status === 'IN_PROGRESS').length;
  const resolvedCount = authorityReports.filter((r) => r.status === 'RESOLVED').length;

  const filteredReports = authorityReports.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q) && !r.exactAddress.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 select-none">
      {/* Authority Control Bento Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest border border-black">
            <Shield className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>MUNICIPAL RESOLUTION COMMAND</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-black">
              Assigned Desk:
            </span>
            <select
              value={selectedAuthorityId}
              onChange={(e) => setSelectedAuthorityId(e.target.value)}
              className="bg-zinc-100 text-black text-xs font-black px-3 py-1.5 rounded-xl border-2 border-black focus:outline-none cursor-pointer"
            >
              {authorities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} - {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-black">
                {currentAuthority.name}
              </h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E2FF4D] text-black border-2 border-black font-black uppercase tracking-wider">
                Official Squad ✓
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-semibold mt-1">
              Department: <strong>{currentAuthority.department}</strong> • Sector Jurisdiction: {currentAuthority.jurisdiction}
            </p>
          </div>

          <div className="text-xs font-bold text-black bg-[#E2FF4D]/30 border-2 border-black p-3.5 rounded-[20px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-0.5">
            <div>Helpline: <span className="font-mono font-black">{currentAuthority.phone}</span></div>
            <div>Central Dispatch: <span className="font-mono">{currentAuthority.email}</span></div>
          </div>
        </div>
      </div>

      {/* Operational Metrics Bento Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400">
            <span>New Unassigned</span>
            <AlertTriangle className="w-4 h-4 text-[#FF5C00] stroke-[2.5]" />
          </div>
          <div className="text-3xl font-black text-black">{newReportsCount}</div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5C00]">Needs crew</span>
        </div>

        <div className="p-5 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400">
            <span>Assigned</span>
            <UserCheck className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div className="text-3xl font-black text-black">{assignedCount}</div>
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Unit dispatched</span>
        </div>

        <div className="p-5 rounded-[28px] bg-[#E2FF4D] border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-black">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div className="text-3xl font-black text-black">{inProgressCount}</div>
          <span className="text-[10px] font-black uppercase tracking-wider text-black">Active field work</span>
        </div>

        <div className="p-5 rounded-[28px] bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400">
            <span>Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] stroke-[2.5]" />
          </div>
          <div className="text-3xl font-black text-[#22c55e]">{resolvedCount}</div>
          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Verified with photo</span>
        </div>
      </div>

      {/* Case Management Desk Bento Container */}
      <div className="bg-white rounded-[32px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Table Filter Topbar */}
        <div className="p-5 border-b-2 border-black flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-50">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-black stroke-[2.5] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search cases by ID or street..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border-2 border-black text-xs font-bold bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'ALL', label: 'All Cases' },
              { id: 'SUBMITTED', label: 'New' },
              { id: 'ASSIGNED', label: 'Assigned' },
              { id: 'IN_PROGRESS', label: 'In Progress' },
              { id: 'RESOLVED', label: 'Resolved' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition cursor-pointer border-2 border-black ${
                  statusFilter === f.id
                    ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Operational Cases List */}
        <div className="divide-y-2 divide-black/10">
          {filteredReports.length === 0 ? (
            <div className="text-center py-16 px-4">
              <CheckCircle2 className="w-12 h-12 text-zinc-300 mx-auto mb-2" />
              <p className="text-base font-black uppercase tracking-tight text-black">
                No active municipal cases in queue
              </p>
              <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                All community issues are dispatched to field squads.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const statusCfg = getStatusConfig(report.status);

              return (
                <div
                  key={report.id}
                  className="p-5 hover:bg-zinc-50 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-xs bg-black text-white px-2.5 py-1 rounded-lg border border-black">
                        #{report.id}
                      </span>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border-2 border-black ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <span className="text-[10px] text-black font-black uppercase bg-[#E2FF4D] px-2.5 py-0.5 rounded-full border-2 border-black">
                        👥 {report.affectedCount} Affected
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-400 font-mono font-black uppercase">
                        SLA: {report.escalationHours}H
                      </span>
                      <button
                        onClick={() => setSelectedReportId(report.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Manage Case</span>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-black">{report.title}</h3>
                    <p className="text-xs text-zinc-600 font-medium mt-0.5 leading-relaxed">
                      "{report.description}"
                    </p>
                  </div>

                  {/* Operational GPS Location */}
                  <div className="p-3 rounded-2xl bg-zinc-100 border-2 border-black text-xs text-black flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold">
                      <MapPin className="w-4 h-4 text-[#FF5C00] stroke-[2.5] shrink-0" />
                      <div>
                        <span className="font-black uppercase tracking-tight">Exact Address:</span>{' '}
                        <span>{report.exactAddress}</span>
                      </div>
                    </div>
                    <div className="font-mono text-[11px] font-black text-zinc-500">
                      GPS: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </div>
                  </div>

                  {/* Quick Action Buttons for Authority Officers */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-zinc-400">
                        Assigned Unit:
                      </span>
                      <span className="text-xs font-black text-black bg-[#E2FF4D] px-2.5 py-1 rounded-lg border border-black">
                        {report.assignedTeam || 'None yet'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status !== 'IN_PROGRESS' && report.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            assignTeam(report.id, currentAuthority.teams[0] || 'Unit 1');
                            updateReportStatus(report.id, 'IN_PROGRESS', 'Field squad active on site');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#FF5C00] hover:bg-[#e65300] text-white text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                        >
                          Dispatch Crew
                        </button>
                      )}

                      {report.status !== 'RESOLVED' && (
                        <button
                          onClick={() => {
                            setSelectedReportId(report.id);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#4ade80] hover:bg-[#22c55e] text-black text-xs font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Upload Proof & Close</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
