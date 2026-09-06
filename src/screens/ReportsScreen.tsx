import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReportCard } from '../components/reports/ReportCard';
import {
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const {
    reports,
    identity,
    categories,
    selectedCommunity,
    setIsReportWizardOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'mine' | 'supported' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'impact' | 'recent'>('impact');

  const filteredReports = reports.filter((r) => {
    if (activeTab === 'mine' && r.createdBy !== identity.id) return false;
    if (activeTab === 'supported' && !identity.supportedReportIds.includes(r.id)) return false;
    if (activeTab === 'resolved' && r.status !== 'RESOLVED') return false;

    if (selectedCategory !== 'ALL' && r.categoryId !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description.toLowerCase().includes(q);
      const matchLoc = r.approximateLocation.toLowerCase().includes(q);
      const matchId = r.id.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchId) return false;
    }

    return true;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'impact') {
      return b.affectedCount - a.affectedCount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Bento Header Tile */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-0.5 rounded-full border border-black">
              MUNICIPAL LOGS
            </span>
            <span className="text-xs font-mono font-bold text-zinc-400">
              CENTRAL DATABASE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">
            {selectedCommunity.name} Civic Cases
          </h1>
          <p className="text-xs text-zinc-500 font-semibold">
            Track official authority delivery, resident impact counts, and photographic resolution proofs.
          </p>
        </div>

        <button
          onClick={() => setIsReportWizardOpen(true)}
          className="px-5 py-3 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer transition"
        >
          <PlusCircle className="w-4 h-4 stroke-[3]" />
          <span>Report New Problem</span>
        </button>
      </div>

      {/* Tabs & Search Controls Bento Container */}
      <div className="bg-white p-5 rounded-[28px] border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b-2 border-black/10">
          {[
            { id: 'all', label: `All Cases (${reports.length})` },
            {
              id: 'mine',
              label: `My Reports (${reports.filter((r) => r.createdBy === identity.id).length})`
            },
            {
              id: 'supported',
              label: `Supported (${identity.supportedReportIds.length})`
            },
            {
              id: 'resolved',
              label: `Resolved (${reports.filter((r) => r.status === 'RESOLVED').length})`
            }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all cursor-pointer border-2 border-black ${
                activeTab === t.id
                  ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search and Filters row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-black stroke-[2.5] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, street, or case ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-black text-xs font-bold focus:bg-white bg-zinc-50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-tight bg-white text-black focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border-2 border-black text-xs font-black uppercase tracking-tight bg-white text-black focus:outline-none cursor-pointer"
            >
              <option value="impact">Most Affected</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {sortedReports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-[32px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#E2FF4D] text-black border-2 border-black flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-black">
            Zero Active Issues Found
          </h3>
          <p className="text-xs text-zinc-500 font-semibold max-w-sm mx-auto">
            Your neighborhood filter is clean. See something broken on your street? Pin it in 30 seconds.
          </p>
          <button
            onClick={() => setIsReportWizardOpen(true)}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#FF5C00] text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
          >
            Report Problem Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sortedReports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
};
