import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CategoryIcon, getCategoryColor, getStatusConfig } from '../components/CategoryIcon';
import { CivicReport, ReportStatus, PriorityLevel } from '../types';
import { CommunityOSLogo } from '../components/CommunityOSLogo';
import {
  Settings,
  Building2,
  Layers,
  Clock,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Compass,
  MapPin,
  Lock,
  Unlock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  LogOut,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Trash2,
  Search,
  Filter,
  CheckSquare,
  Square,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  X,
  RefreshCw,
  FileText
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const {
    categories,
    mappingRules,
    allCommunities,
    authorities,
    selectedCommunity,
    isAdminAuthenticated,
    adminUsername,
    loginAdmin,
    logoutAdmin,
    setActiveTab: setAppActiveTab,
    resolveAuthorityForReport,
    reports,
    deleteReport,
    bulkDeleteReports,
    updateReportByAdmin,
    setSelectedReportId
  } = useApp();

  // Login form states
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authenticated screen active tab
  const [activeTab, setActiveTab] = useState<'cases' | 'routing' | 'categories' | 'communities' | 'simulator'>('cases');

  // Case Management states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReportStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | PriorityLevel>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedReportIds, setSelectedReportIds] = useState<Set<string>>(new Set());

  // Deletion modals state
  const [reportToDelete, setReportToDelete] = useState<CivicReport | null>(null);
  const [singleDeleteReason, setSingleDeleteReason] = useState('Spam / Duplicate report');
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleteReason, setBulkDeleteReason] = useState('Administrative bulk cleanup / spam moderation');

  // Simulator state
  const [simCategory, setSimCategory] = useState(categories[0]?.id || 'cat-pothole');
  const [simCity, setSimCity] = useState(selectedCommunity.city || 'Delhi');

  // Filtered reports calculation - must be declared before any conditional return for Rules of Hooks
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      // Search query: ID, Title, Description, Reporter Name, Address, Area, Ward
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = r.id.toLowerCase().includes(q);
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesDesc = (r.description || '').toLowerCase().includes(q);
        const matchesReporter = (r.reporterName || '').toLowerCase().includes(q);
        const matchesAddress = (r.address || '').toLowerCase().includes(q);
        const matchesArea = (r.area || '').toLowerCase().includes(q);
        const matchesWard = (r.wardNumber || '').toLowerCase().includes(q);
        if (
          !matchesId &&
          !matchesTitle &&
          !matchesDesc &&
          !matchesReporter &&
          !matchesAddress &&
          !matchesArea &&
          !matchesWard
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'ALL' && r.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'ALL' && r.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL' && r.categoryId !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const toggleSelectReport = (id: string) => {
    setSelectedReportIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    if (selectedReportIds.size === filteredReports.length && filteredReports.length > 0) {
      setSelectedReportIds(new Set());
    } else {
      setSelectedReportIds(new Set(filteredReports.map((r) => r.id)));
    }
  };

  const handleConfirmSingleDelete = () => {
    if (!reportToDelete) return;
    deleteReport(reportToDelete.id, singleDeleteReason);
    setSelectedReportIds((prev) => {
      const next = new Set(prev);
      next.delete(reportToDelete.id);
      return next;
    });
    setReportToDelete(null);
    setSingleDeleteReason('Spam / Duplicate report');
  };

  const handleConfirmBulkDelete = () => {
    if (selectedReportIds.size === 0) return;
    bulkDeleteReports(Array.from(selectedReportIds), bulkDeleteReason);
    setSelectedReportIds(new Set());
    setIsBulkDeleteModalOpen(false);
    setBulkDeleteReason('Administrative bulk cleanup / spam moderation');
  };

  const handleBulkStatusUpdate = (status: ReportStatus) => {
    selectedReportIds.forEach((id) => {
      updateReportByAdmin(id, { status, adminNote: `Bulk updated status to ${status}` });
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginAdmin(usernameInput, passwordInput);
      setIsSubmitting(false);

      if (!result.success) {
        setLoginError(result.error || 'Invalid credentials. Please verify username and password.');
      } else {
        // Clear inputs upon successful login
        setUsernameInput('');
        setPasswordInput('');
      }
    }, 250);
  };

  // If not authenticated, render the dedicated Neo-Brutalist Admin Login Gate
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-12 px-2 select-none">
        <div className="bg-white rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10 space-y-8">
          {/* Header Banner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CommunityOSLogo size="sm" variant="image" showBadge={false} />
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest border border-black">
                  <Lock className="w-3.5 h-3.5 text-[#E2FF4D] stroke-[2.5]" />
                  RESTRICTED GOVERNANCE GATE
                </span>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E2FF4D] text-black border border-black">
                  Platform Admin
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black flex items-center gap-2.5">
              <span>Admin Console Login</span>
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 font-medium leading-relaxed">
              Authenticate with authorized municipal administrator credentials to configure deterministic authority routing, service-level agreements, and ward infrastructure.
            </p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 stroke-[2.5]" />
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-tight text-rose-900">
                  Authentication Failed
                </p>
                <p className="text-xs text-rose-800 font-semibold">
                  {loginError}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-username"
                className="block text-xs font-black uppercase tracking-wider text-black"
              >
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4 stroke-[2.5]" />
                </div>
                <input
                  id="admin-username"
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter admin username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-black text-sm font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:bg-[#E2FF4D]/15 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-black uppercase tracking-wider text-black"
                >
                  Admin Password
                </label>
                <span className="text-[10px] font-mono text-zinc-500">Case-sensitive</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white border-2 border-black text-sm font-bold text-black placeholder:text-zinc-400 focus:outline-none focus:bg-[#E2FF4D]/15 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-black cursor-pointer"
                  tabIndex={-1}
                  id="toggle-password-visibility-btn"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Eye className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || !usernameInput || !passwordInput}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#FF5C00] hover:bg-[#e65300] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="admin-login-submit-btn"
              >
                {isSubmitting ? (
                  <span>Verifying Credentials...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 stroke-[3]" />
                    <span>Unlock Admin Console</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAppActiveTab('home')}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-center cursor-pointer"
                id="admin-back-to-home-btn"
              >
                ← Return to Citizen Command Hub
              </button>
            </div>
          </form>

          {/* Security Guarantee Details */}
          <div className="pt-4 border-t-2 border-black/10 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                Role-Based Access Control (RBAC)
              </span>
              <span className="font-mono">Security Tier 1</span>
            </div>

            <div className="pt-2 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-1 text-[10px] text-zinc-500 font-semibold">
              <div className="flex items-center gap-1">
                <span>All rights reserved</span>
                <span className="bg-black text-white px-1.5 py-0.2 rounded font-black text-[9px]">
                  "Ctrl Alt Defeat"
                </span>
              </div>
              <span className="font-black text-[#FF5C00]">Made by Harshit Kumar Nigam</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render full Bento Governance Suite
  const simResult = resolveAuthorityForReport(simCategory, simCity);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 select-none">
      {/* Top Bento Header Tile with Logged In Admin Profile */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest border border-black w-fit mb-1">
            <Settings className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>CIVIC ROUTING ENGINE & GOVERNANCE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-black">
            Authority Mapping Matrix & SLAs
          </h1>
          <p className="text-xs text-zinc-500 font-semibold max-w-xl">
            Configure automated category-to-department routing, municipal escalation timeframes, and ward boundaries.
          </p>
        </div>

        {/* Admin Session Badge & Sign Out Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#E2FF4D] text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 border border-black animate-pulse" />
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-wider block leading-none">
                Logged in as
              </span>
              <span className="text-xs font-black uppercase tracking-tight">
                {adminUsername || 'Harshitxdev'}
              </span>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-900 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer font-black text-xs uppercase tracking-tight"
            id="admin-logout-btn"
            title="Lock and Log Out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Quick Governance Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">Total Cases</span>
          <div className="text-2xl font-black text-black">{reports.length}</div>
          <span className="text-[10px] font-bold text-zinc-600">Active Civic Reports</span>
        </div>

        <div className="p-4 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">Pending / In-Work</span>
          <div className="text-2xl font-black text-[#FF5C00]">
            {reports.filter((r) => r.status !== 'RESOLVED').length}
          </div>
          <span className="text-[10px] font-bold text-zinc-600">Needs Authority Action</span>
        </div>

        <div className="p-4 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <span className="text-[10px] font-black uppercase text-zinc-400">Emergency & High</span>
          <div className="text-2xl font-black text-rose-600">
            {reports.filter((r) => r.priority === 'EMERGENCY' || r.priority === 'HIGH').length}
          </div>
          <span className="text-[10px] font-bold text-zinc-600">Escalated Priority</span>
        </div>

        <div className="p-4 rounded-[24px] bg-[#E2FF4D] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <span className="text-[10px] font-black uppercase text-black/70">Master Privileges</span>
          <div className="text-2xl font-black text-black">SUPER ADMIN</div>
          <span className="text-[10px] font-black text-black">Full Deletion & Overrides</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('cases')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-2 border-black flex items-center gap-1.5 shrink-0 ${
            activeTab === 'cases'
              ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="tab-admin-cases"
        >
          <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Manage Cases ({reports.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('routing')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-2 border-black shrink-0 ${
            activeTab === 'routing'
              ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="tab-admin-routing"
        >
          Routing Rules ({mappingRules.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-2 border-black shrink-0 ${
            activeTab === 'categories'
              ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="tab-admin-categories"
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-2 border-black shrink-0 ${
            activeTab === 'communities'
              ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="tab-admin-communities"
        >
          Managed Wards ({allCommunities.length})
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer border-2 border-black shrink-0 ${
            activeTab === 'simulator'
              ? 'bg-[#E2FF4D] text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-zinc-600 hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          }`}
          id="tab-admin-simulator"
        >
          Routing Simulator
        </button>
      </div>

      {/* ALL CASES & REPORTS MANAGEMENT TAB */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          {/* Search, Filter & Quick Stats Toolbar */}
          <div className="p-5 sm:p-6 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black uppercase tracking-tight text-black">
                    Master Cases & Reports Console
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                    Full Admin Authority
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-semibold mt-0.5">
                  Inspect, override lifecycle stages, escalate priorities, or permanently delete spam/fraudulent reports.
                </p>
              </div>

              {/* Reset Filters Shortcut */}
              {(searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL' || categoryFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setPriorityFilter('ALL');
                    setCategoryFilter('ALL');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-black text-xs uppercase tracking-wider border-2 border-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Filter Bar Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search ID, title, address, reporter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-white border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-[#E2FF4D]/15"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'ALL' | ReportStatus)}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses ({reports.length})</option>
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="SENT_TO_AUTHORITY">SENT TO AUTHORITY</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | PriorityLevel)}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Priorities</option>
                  <option value="EMERGENCY">EMERGENCY</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count & Select All */}
            <div className="flex items-center justify-between text-xs font-black text-zinc-600 border-t-2 border-black/10 pt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAllFiltered}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-2 border-black bg-zinc-100 hover:bg-zinc-200 text-black cursor-pointer font-black text-[11px] uppercase tracking-tight"
                >
                  {selectedReportIds.size === filteredReports.length && filteredReports.length > 0 ? (
                    <CheckSquare className="w-3.5 h-3.5 text-black stroke-[3]" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-zinc-600 stroke-[2.5]" />
                  )}
                  <span>
                    {selectedReportIds.size === filteredReports.length && filteredReports.length > 0
                      ? 'Deselect All'
                      : 'Select All Filtered'}
                  </span>
                </button>
                <span>
                  Showing {filteredReports.length} of {reports.length} cases
                </span>
              </div>

              {selectedReportIds.size > 0 && (
                <span className="text-rose-600 uppercase font-black tracking-wider">
                  {selectedReportIds.size} Selected for Admin Action
                </span>
              )}
            </div>
          </div>

          {/* Bulk Action Sticky Bar (Visible when 1+ selected) */}
          {selectedReportIds.size > 0 && (
            <div className="p-4 rounded-[24px] bg-rose-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-tight text-rose-950">
                  {selectedReportIds.size} Reports Selected
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer"
                  id="admin-bulk-delete-btn"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Delete Selected ({selectedReportIds.size})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkStatusUpdate('IN_PROGRESS')}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  Set In Progress
                </button>

                <button
                  type="button"
                  onClick={() => handleBulkStatusUpdate('RESOLVED')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                >
                  Set Resolved
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReportIds(new Set())}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-zinc-100 text-black font-black text-xs uppercase tracking-wider border-2 border-black cursor-pointer"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {/* Cases List */}
          {filteredReports.length === 0 ? (
            <div className="p-12 rounded-[32px] bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 border-2 border-black flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-zinc-400 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-black uppercase text-black">No cases match your filters</h3>
              <p className="text-xs text-zinc-500 font-semibold max-w-sm mx-auto">
                Try searching by a different term or reset your active filters to display all municipal reports.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setPriorityFilter('ALL');
                  setCategoryFilter('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-[#E2FF4D] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const category = categories.find((c) => c.id === report.categoryId);
                const colors = getCategoryColor(report.categoryId);
                const isSelected = selectedReportIds.has(report.id);

                return (
                  <div
                    key={report.id}
                    className={`p-4 sm:p-5 rounded-[28px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected ? 'bg-rose-50/50 border-rose-600' : 'bg-white'
                    }`}
                    id={`admin-case-item-${report.id}`}
                  >
                    {/* Left: Checkbox + Category + Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelectReport(report.id)}
                        className="mt-1 cursor-pointer"
                        title={isSelected ? 'Deselect report' : 'Select report for bulk action'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-rose-600 stroke-[3]" />
                        ) : (
                          <Square className="w-5 h-5 text-zinc-400 hover:text-black stroke-[2.5]" />
                        )}
                      </button>

                      {/* Category Icon */}
                      <div className={`p-2.5 rounded-2xl ${colors.bg} shrink-0 mt-0.5`}>
                        <CategoryIcon
                          iconName={category?.icon || 'AlertCircle'}
                          className="w-4 h-4 stroke-[2.5]"
                        />
                      </div>

                      {/* Main Details */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReportId(report.id)}
                            className="font-mono text-[11px] font-black uppercase text-black hover:underline cursor-pointer bg-zinc-100 px-2 py-0.5 rounded border border-black"
                            title="Inspect full case file"
                          >
                            #{report.id}
                          </button>
                          <span className="text-xs font-black uppercase tracking-tight text-zinc-500">
                            {category?.name || 'Civic Issue'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono font-bold">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h4
                          onClick={() => setSelectedReportId(report.id)}
                          className="text-sm font-black text-black uppercase tracking-tight hover:text-[#FF5C00] cursor-pointer truncate"
                        >
                          {report.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 font-semibold">
                          <span className="flex items-center gap-1 truncate max-w-xs">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 stroke-[2.5]" />
                            <span className="truncate">{report.address || 'Location on file'}</span>
                          </span>

                          <span className="flex items-center gap-1 text-zinc-500">
                            <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>{report.reporterName || 'Anonymous Resident'}</span>
                          </span>

                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 border border-black font-black text-zinc-700">
                            Ward {report.wardNumber || '01'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle / Right: Interactive Status & Priority Controls + Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 justify-end pt-2 md:pt-0 border-t-2 md:border-t-0 border-black/10">
                      {/* Priority Selector Override */}
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-zinc-400">Priority:</span>
                        <select
                          value={report.priority}
                          onChange={(e) =>
                            updateReportByAdmin(report.id, {
                              priority: e.target.value as PriorityLevel,
                              adminNote: `Admin updated priority to ${e.target.value}`
                            })
                          }
                          className={`px-2.5 py-1.5 rounded-xl border-2 border-black font-black text-[10px] uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                            report.priority === 'EMERGENCY'
                              ? 'bg-rose-500 text-white'
                              : report.priority === 'HIGH'
                              ? 'bg-[#FF5C00] text-white'
                              : report.priority === 'MEDIUM'
                              ? 'bg-[#E2FF4D] text-black'
                              : 'bg-zinc-100 text-black'
                          }`}
                          title="Change Case Priority on the fly"
                        >
                          <option value="LOW" className="bg-white text-black font-bold">LOW</option>
                          <option value="MEDIUM" className="bg-white text-black font-bold">MEDIUM</option>
                          <option value="HIGH" className="bg-white text-black font-bold">HIGH</option>
                          <option value="EMERGENCY" className="bg-white text-black font-bold">EMERGENCY</option>
                        </select>
                      </div>

                      {/* Status Selector Override */}
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-black uppercase text-zinc-400">Status:</span>
                        <select
                          value={report.status}
                          onChange={(e) =>
                            updateReportByAdmin(report.id, {
                              status: e.target.value as ReportStatus,
                              adminNote: `Admin changed status to ${e.target.value}`
                            })
                          }
                          className={`px-2.5 py-1.5 rounded-xl border-2 border-black font-black text-[10px] uppercase tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${
                            report.status === 'RESOLVED'
                              ? 'bg-emerald-500 text-white'
                              : report.status === 'IN_PROGRESS'
                              ? 'bg-[#E2FF4D] text-black'
                              : report.status === 'ASSIGNED'
                              ? 'bg-amber-300 text-black'
                              : 'bg-white text-black'
                          }`}
                          title="Direct Lifecycle Status Override"
                        >
                          <option value="SUBMITTED" className="bg-white text-black font-bold">SUBMITTED</option>
                          <option value="SENT_TO_AUTHORITY" className="bg-white text-black font-bold">ROUTED</option>
                          <option value="ASSIGNED" className="bg-white text-black font-bold">ASSIGNED</option>
                          <option value="IN_PROGRESS" className="bg-white text-black font-bold">IN PROGRESS</option>
                          <option value="RESOLVED" className="bg-white text-black font-bold">RESOLVED</option>
                        </select>
                      </div>

                      {/* Inspect Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedReportId(report.id)}
                        className="p-2 rounded-xl bg-white hover:bg-zinc-100 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
                        title="Inspect full report dossier"
                      >
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>

                      {/* Delete Case Button */}
                      <button
                        type="button"
                        onClick={() => setReportToDelete(report)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1 cursor-pointer"
                        id={`delete-case-btn-${report.id}`}
                        title="Permanently Delete Case"
                      >
                        <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ROUTING ENGINE RULES TABLE */}
      {activeTab === 'routing' && (
        <div className="bg-white rounded-[32px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden space-y-4 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight text-black">
                Deterministic Authority Routing Matrix
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">
                When a citizen files a report, the engine resolves Category + City + Jurisdiction to direct cases without requiring citizens to guess departments.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase bg-[#E2FF4D] text-black border border-black px-2.5 py-1 rounded-full">
              Zero Citizen Guesswork Policy
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black bg-zinc-100 text-black font-black uppercase tracking-wider text-[10px]">
                  <th className="p-3">Category</th>
                  <th className="p-3">Jurisdiction</th>
                  <th className="p-3">Resolved Authority</th>
                  <th className="p-3">Assigned Department</th>
                  <th className="p-3 text-right">Escalation SLA</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black/10">
                {mappingRules.map((rule) => {
                  const cat = categories.find((c) => c.id === rule.categoryId);
                  const auth = authorities.find((a) => a.id === rule.authorityId);
                  return (
                    <tr key={rule.id} className="hover:bg-zinc-50 font-bold">
                      <td className="p-3 font-black text-black">
                        {cat?.name || rule.categoryId}
                      </td>
                      <td className="p-3">
                        <span className="bg-zinc-100 border border-black px-2 py-0.5 rounded text-[10px] font-black uppercase">
                          {rule.jurisdiction}
                        </span>
                      </td>
                      <td className="p-3 text-black font-black">
                        {auth?.name || rule.authorityId}
                      </td>
                      <td className="p-3 text-zinc-600 font-semibold">
                        {auth?.department}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-[#FF5C00]">
                        {rule.escalationHours} hours
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES GRID */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const colors = getCategoryColor(cat.id);
            return (
              <div
                key={cat.id}
                className="p-5 rounded-[24px] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${colors.bg}`}>
                    <CategoryIcon iconName={cat.icon} className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-[#E2FF4D] text-black border border-black px-2 py-0.5 rounded-full">
                    SLA: {cat.defaultEscalationHours}h
                  </span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-black">{cat.name}</h3>
                <p className="text-xs text-zinc-600 font-medium leading-relaxed">{cat.description}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* COMMUNITIES GRID */}
      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allCommunities.map((c) => (
            <div
              key={c.id}
              className={`p-5 rounded-[24px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2.5 ${
                c.id === selectedCommunity.id ? 'bg-[#E2FF4D]/25' : 'bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase bg-black text-white px-2.5 py-0.5 rounded-full border border-black">
                  Ward {c.wardNumber}
                </span>
                {c.id === selectedCommunity.id && (
                  <span className="text-[9px] font-black uppercase bg-[#FF5C00] text-white px-2 py-0.5 rounded-full border border-black">
                    Selected
                  </span>
                )}
              </div>
              <h3 className="text-base font-black uppercase tracking-tight text-black">{c.name}</h3>
              <p className="text-xs text-zinc-600 font-semibold">{c.city}, {c.state}</p>
              <div className="pt-1 text-[11px] font-black text-black flex items-center justify-between">
                <span>{c.memberCount.toLocaleString()} Connected</span>
                <span className="font-mono text-zinc-400">{c.postalCode}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ROUTING SIMULATOR TAB */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-[32px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-black">
              Interactive Civic Routing Engine Sandbox
            </h2>
            <p className="text-xs text-zinc-500 font-semibold">
              Test how candidate reports are automatically resolved to exact municipal departments and SLAs based on category and jurisdiction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Select Category
              </label>
              <select
                value={simCategory}
                onChange={(e) => setSimCategory(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white border-2 border-black text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Default {c.defaultEscalationHours}h)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-black">
                Select Jurisdiction / City
              </label>
              <select
                value={simCity}
                onChange={(e) => setSimCity(e.target.value)}
                className="w-full p-3 rounded-2xl bg-white border-2 border-black text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              >
                <option value="Delhi">Delhi (NCR Master)</option>
                <option value="East Delhi">East Delhi</option>
                <option value="South Delhi">South Delhi</option>
                <option value="North Delhi">North Delhi</option>
              </select>
            </div>
          </div>

          {/* Live Resolution Output Bento Card */}
          <div className="p-6 rounded-[24px] bg-[#E2FF4D]/30 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-full border border-black inline-block">
              Calculated Deterministic Dispatch
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Target Agency</span>
                <p className="text-sm font-black text-black">{simResult.authorityName}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Assigned Division</span>
                <p className="text-sm font-black text-black">{simResult.department}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Resolution Escalation SLA</span>
                <p className="text-sm font-black text-[#FF5C00]">{simResult.escalationHours} hours max</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SINGLE REPORT DELETION CONFIRMATION MODAL */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 border-2 border-black text-rose-600">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Delete Civic Report
                  </h3>
                  <span className="text-xs font-mono font-bold text-rose-600">
                    #{reportToDelete.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Callout */}
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-xs font-bold text-rose-900 space-y-1">
              <p className="font-black uppercase tracking-tight">⚠️ Permanent Master Deletion</p>
              <p>
                You are about to permanently purge this report from the public registry. All attached status milestones, comments, and public records will be removed.
              </p>
            </div>

            {/* Case Snapshot */}
            <div className="p-4 rounded-2xl bg-zinc-50 border-2 border-black space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-400">Issue Title:</span>
                <p className="font-black text-black text-sm uppercase">{reportToDelete.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-zinc-600 font-semibold pt-1">
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400">Reporter:</span>
                  <p className="font-bold text-black truncate">{reportToDelete.reporterName || 'Anonymous'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-zinc-400">Location:</span>
                  <p className="font-bold text-black truncate">{reportToDelete.address || 'Ward on file'}</p>
                </div>
              </div>
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Administrative Reason for Removal
              </label>
              <select
                value={singleDeleteReason}
                onChange={(e) => setSingleDeleteReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
              >
                <option value="Spam / Duplicate report">Spam / Duplicate report</option>
                <option value="Inappropriate / Abusive content">Inappropriate / Abusive content</option>
                <option value="False or non-existent issue">False or non-existent issue</option>
                <option value="Resolved via offline municipal intervention">Resolved via offline municipal intervention</option>
                <option value="Administrative maintenance">Administrative maintenance</option>
                <option value="Other administrative grounds">Other administrative grounds</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                id="confirm-delete-report-btn"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>Confirm Permanent Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK REPORT DELETION CONFIRMATION MODAL */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[32px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-7 space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-100 border-2 border-black text-rose-600">
                  <Trash2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-black">
                    Bulk Delete {selectedReportIds.size} Reports
                  </h3>
                  <span className="text-xs font-bold text-zinc-500">
                    Irreversible administrative operation
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Warning Callout */}
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-black text-xs font-bold text-rose-950 space-y-1">
              <p className="font-black uppercase tracking-tight text-rose-900">
                ⚠️ Danger: Purging {selectedReportIds.size} Civic Cases
              </p>
              <p>
                All {selectedReportIds.size} selected reports will be permanently deleted from the municipal directory and local cache. Their tracking numbers will no longer resolve.
              </p>
            </div>

            {/* Reason input */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-black block">
                Administrative Reason for Bulk Purge
              </label>
              <input
                type="text"
                value={bulkDeleteReason}
                onChange={(e) => setBulkDeleteReason(e.target.value)}
                placeholder="e.g. Bulk cleanup of test entries or resolved duplicates"
                className="w-full p-2.5 rounded-xl bg-white border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-black text-xs uppercase tracking-wider border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer flex items-center gap-1.5"
                id="confirm-bulk-delete-btn"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>Delete All {selectedReportIds.size} Cases</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
