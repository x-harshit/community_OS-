import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CivicReport,
  CivicCategory,
  Community,
  UserIdentity,
  CommunityPost,
  ReportComment,
  AppNotification,
  Authority,
  AuthorityMappingRule,
  ReportStatus,
  PriorityLevel,
  ReportEvidence,
  OfficialUpdate
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_COMMUNITIES,
  INITIAL_AUTHORITIES,
  INITIAL_MAPPING_RULES,
  INITIAL_REPORTS,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';
import { acquireDevicePosition, getSupplementaryAddress } from '../services/deviceLocation';
import { generateAddressOffset } from '../utils/addressGeocoding';

export interface ReportDraft {
  categoryId: string;
  userName: string; // MANDATORY user name to submit report
  evidence: Array<{
    url: string;
    mediaType: 'image' | 'video';
    caption?: string;
  }>;
  location: {
    lat: number;
    lng: number;
    latitude?: number;
    longitude?: number;
    accuracy?: number;
    timestamp?: number;
    source?: 'device_gps' | 'manual';
    approximateLocation: string;
    exactAddress: string;
    ward: string;
    streetAddress?: string;
    area?: string;
    landmark?: string;
    city?: string;
    isGpsCaptured: boolean;
  } | null;
  description: string;
  title: string;
}

interface AppContextType {
  // Navigation & View
  activeTab: 'home' | 'community' | 'map' | 'reports' | 'profile' | 'authority' | 'admin';
  setActiveTab: (tab: 'home' | 'community' | 'map' | 'reports' | 'profile' | 'authority' | 'admin') => void;
  selectedReportId: string | null;
  setSelectedReportId: (id: string | null) => void;
  isReportWizardOpen: boolean;
  setIsReportWizardOpen: (open: boolean) => void;

  // Identity & Community
  identity: UserIdentity;
  updateDisplayName: (name: string) => void;
  toggleAnonymous: () => void;
  switchRole: (role: UserIdentity['role']) => void;
  selectedCommunity: Community;
  switchCommunity: (communityId: string) => void;
  allCommunities: Community[];

  // Data
  categories: CivicCategory[];
  reports: CivicReport[];
  communityPosts: CommunityPost[];
  comments: Record<string, ReportComment[]>;
  notifications: AppNotification[];
  authorities: Authority[];
  mappingRules: AuthorityMappingRule[];

  // Report Actions
  createReport: (draft: ReportDraft) => CivicReport;
  supportReport: (reportId: string) => void;
  markAffected: (reportId: string) => void;
  followReport: (reportId: string) => void;
  addEvidenceToReport: (reportId: string, evidence: { url: string; mediaType: 'image' | 'video'; caption?: string }) => void;
  addCommentToReport: (reportId: string, text: string, isOfficial?: boolean) => void;
  addCommunityPost: (content: string, isNotice?: boolean) => void;
  likeCommunityPost: (postId: string) => void;

  // Authority Actions
  assignTeam: (reportId: string, teamName: string) => void;
  updateReportStatus: (reportId: string, status: ReportStatus, note: string) => void;
  postOfficialUpdate: (reportId: string, message: string, actionTaken?: string) => void;
  resolveReportWithProof: (reportId: string, note: string, proofUrl: string) => void;

  // Draft Management
  reportDraft: ReportDraft;
  updateDraft: (updates: Partial<ReportDraft>) => void;
  clearDraft: () => void;
  hasDraft: boolean;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Routing preview helper
  resolveAuthorityForReport: (categoryId: string, city: string) => {
    authorityId: string;
    authorityName: string;
    department: string;
    escalationHours: number;
  };

  // Admin Authentication System
  isAdminAuthenticated: boolean;
  adminUsername: string | null;
  loginAdmin: (username: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;

  // Admin Power & Case Management
  deleteReport: (reportId: string, reason?: string) => boolean;
  bulkDeleteReports: (reportIds: string[], reason?: string) => void;
  updateReportByAdmin: (
    reportId: string,
    updates: {
      status?: ReportStatus;
      priority?: PriorityLevel;
      authorityId?: string;
      authorityName?: string;
      adminNote?: string;
    }
  ) => void;

  // Location & GPS Detection
  isDetectingLocation: boolean;
  useCurrentLocation: () => Promise<{ success: boolean; message: string }>;
  isUsingCurrentLocation: boolean;
  locationStatusMessage: string | null;
}

export const CURRENT_LOCATION_COMMUNITY: Community = {
  id: 'current-location',
  name: 'Your Current Location',
  city: 'Detected Ward',
  state: 'Delhi NCR',
  memberCount: 3840,
  activeReportsCount: 16,
  wardNumber: 'Live GPS Ward',
  coordinates: {
    lat: 28.6139,
    lng: 77.2090
  }
};

const DEFAULT_DRAFT: ReportDraft = {
  categoryId: '',
  userName: '',
  evidence: [],
  location: null,
  description: '',
  title: ''
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or defaults - default to current location so Yamuna Vihar isn't forced
  const [identity, setIdentity] = useState<UserIdentity>(() => {
    const saved = localStorage.getItem('cc_user_identity');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const explicitCommunity = localStorage.getItem('cc_explicit_community');
        // If user hasn't explicitly chosen a specific ward, or explicitly wants current location
        if (!explicitCommunity || localStorage.getItem('cc_use_current_location') === 'true') {
          return { ...parsed, communityId: 'current-location' };
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      displayName: 'Harshit',
      communityId: 'current-location',
      role: 'RESIDENT',
      isAnonymous: false,
      avatarSeed: 'harshit',
      supportedReportIds: ['CC-10284'],
      affectedReportIds: ['CC-10284'],
      followedReportIds: ['CC-10284', 'CC-10291']
    };
  });

  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'map' | 'reports' | 'profile' | 'authority' | 'admin'>('home');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isReportWizardOpen, setIsReportWizardOpen] = useState<boolean>(false);

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('cc_communities');
    const list: Community[] = saved ? JSON.parse(saved) : INITIAL_COMMUNITIES;
    if (!list.some(c => c.id === 'current-location')) {
      return [CURRENT_LOCATION_COMMUNITY, ...list];
    }
    return list;
  });

  // Geolocation state
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);

  const [categories, setCategories] = useState<CivicCategory[]>(() => {
    const saved = localStorage.getItem('cc_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [mappingRules] = useState<AuthorityMappingRule[]>(() => {
    const saved = localStorage.getItem('cc_mapping_rules');
    return saved ? JSON.parse(saved) : INITIAL_MAPPING_RULES;
  });

  const [authorities] = useState<Authority[]>(() => {
    const saved = localStorage.getItem('cc_authorities');
    return saved ? JSON.parse(saved) : INITIAL_AUTHORITIES;
  });

  const [reports, setReports] = useState<CivicReport[]>(() => {
    const saved = localStorage.getItem('cc_reports');
    let deletedIds = new Set<string>();
    try {
      const deletedRaw = localStorage.getItem('cc_deleted_report_ids');
      if (deletedRaw) {
        deletedIds = new Set<string>(JSON.parse(deletedRaw));
      }
    } catch {
      // ignore
    }

    if (saved) {
      try {
        const parsed: CivicReport[] = JSON.parse(saved);
        const filteredParsed = parsed.filter(r => !deletedIds.has(r.id));
        const existingIds = new Set(filteredParsed.map((r: CivicReport) => r.id));
        const missing = INITIAL_REPORTS.filter(r => !existingIds.has(r.id) && !deletedIds.has(r.id));
        return [...filteredParsed, ...missing];
      } catch {
        return INITIAL_REPORTS.filter(r => !deletedIds.has(r.id));
      }
    }
    return INITIAL_REPORTS.filter(r => !deletedIds.has(r.id));
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('cc_community_posts');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_POSTS;
  });

  const [comments, setComments] = useState<Record<string, ReportComment[]>>(() => {
    const saved = localStorage.getItem('cc_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cc_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reportDraft, setReportDraft] = useState<ReportDraft>(() => {
    const saved = localStorage.getItem('cc_report_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DRAFT,
          ...parsed,
          userName: parsed.userName || (identity?.displayName !== 'Anonymous Resident' ? identity?.displayName : '') || ''
        };
      } catch {
        // fallback
      }
    }
    return {
      ...DEFAULT_DRAFT,
      userName: (identity?.displayName !== 'Anonymous Resident' ? identity?.displayName : '') || ''
    };
  });

  // Admin Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cc_admin_authenticated') === 'true';
  });

  const [adminUsername, setAdminUsername] = useState<string | null>(() => {
    return localStorage.getItem('cc_admin_user') || (localStorage.getItem('cc_admin_authenticated') === 'true' ? 'Harshitxdev' : null);
  });

  const loginAdmin = (username: string, password: string): { success: boolean; error?: string } => {
    const cleanUser = username.trim();
    const cleanPass = password; // Keep exact password casing

    if (cleanUser.toLowerCase() === 'harshitxdev' && cleanPass === 'dev.harshx') {
      setIsAdminAuthenticated(true);
      setAdminUsername('Harshitxdev');
      setIdentity(prev => ({
        ...prev,
        role: 'PLATFORM_ADMIN',
        displayName: prev.displayName === 'Anonymous Resident' ? 'Harshitxdev' : prev.displayName
      }));
      localStorage.setItem('cc_admin_authenticated', 'true');
      localStorage.setItem('cc_admin_user', 'Harshitxdev');
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid administrator credentials. Access restricted to authorized personnel.'
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminUsername(null);
    setIdentity(prev => ({ ...prev, role: 'RESIDENT' }));
    localStorage.removeItem('cc_admin_authenticated');
    localStorage.removeItem('cc_admin_user');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cc_user_identity', JSON.stringify(identity));
  }, [identity]);

  useEffect(() => {
    localStorage.setItem('cc_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('cc_community_posts', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('cc_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('cc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cc_report_draft', JSON.stringify(reportDraft));
  }, [reportDraft]);

  const selectedCommunity = communities.find(c => c.id === identity.communityId) || communities[0];
  const isUsingCurrentLocation = identity.communityId === 'current-location';

  const useCurrentLocation = async (): Promise<{ success: boolean; message: string }> => {
    setIsDetectingLocation(true);
    setLocationStatusMessage('Locating your GPS coordinates...');

    try {
      const position = await acquireDevicePosition();
      const { latitude, longitude } = position;

      // Optional non-blocking supplementary address
      const supp = await getSupplementaryAddress(latitude, longitude);
      const wardName = supp.ward || `GPS: ${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E`;
      const cityName = supp.city || 'Detected Local Area';

      const updatedLocation: Community = {
        id: 'current-location',
        name: supp.locality ? `Near ${supp.locality}` : 'Your Current Location',
        city: cityName,
        state: 'Local Area',
        memberCount: 3840,
        activeReportsCount: 16,
        wardNumber: wardName,
        coordinates: {
          lat: latitude,
          lng: longitude
        }
      };

      setCommunities(prev => [
        updatedLocation,
        ...prev.filter(c => c.id !== 'current-location')
      ]);
      setIdentity(prev => ({ ...prev, communityId: 'current-location' }));
      localStorage.setItem('cc_use_current_location', 'true');
      localStorage.removeItem('cc_explicit_community');
      localStorage.setItem('cc_gps_coords', JSON.stringify({ lat: latitude, lng: longitude }));
      setIsDetectingLocation(false);
      const msg = `GPS Coordinates Locked (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
      setLocationStatusMessage(msg);
      return { success: true, message: msg };
    } catch (err: any) {
      setIsDetectingLocation(false);
      const msg = err.message || 'Unable to access device location.';
      setLocationStatusMessage(msg);
      console.error('useCurrentLocation error:', err);
      return { success: false, message: msg };
    }
  };

  const switchCommunity = (communityId: string) => {
    setIdentity(prev => ({ ...prev, communityId }));
    if (communityId === 'current-location') {
      localStorage.setItem('cc_use_current_location', 'true');
      localStorage.removeItem('cc_explicit_community');
    } else {
      localStorage.setItem('cc_use_current_location', 'false');
      localStorage.setItem('cc_explicit_community', communityId);
      setLocationStatusMessage(null);
    }
  };

  const updateDisplayName = (name: string) => {
    setIdentity(prev => ({
      ...prev,
      displayName: name.trim() || 'Anonymous Neighbor',
      isAnonymous: !name.trim()
    }));
  };

  const toggleAnonymous = () => {
    setIdentity(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }));
  };

  const switchRole = (role: UserIdentity['role']) => {
    setIdentity(prev => ({ ...prev, role }));
  };

  // Authority Routing Engine: Category + City + Jurisdiction → Authority
  const resolveAuthorityForReport = (categoryId: string, city: string) => {
    const rule = mappingRules.find(r => r.categoryId === categoryId && (r.jurisdiction.toLowerCase() === city.toLowerCase() || r.jurisdiction === 'Delhi'))
      || mappingRules.find(r => r.categoryId === categoryId)
      || mappingRules[0];

    return {
      authorityId: rule ? rule.authorityId : 'auth-mcd-sanitation',
      authorityName: rule ? rule.authorityName : 'Municipal Corporation',
      department: rule ? rule.department : 'General Redressal Cell',
      escalationHours: rule ? rule.escalationHours : 48
    };
  };

  const createReport = (draft: ReportDraft): CivicReport => {
    const rawName = (draft.userName || '').trim();
    const reporterName = rawName || (identity.displayName !== 'Anonymous Resident' && identity.displayName.trim() ? identity.displayName.trim() : '');
    if (!reporterName) {
      throw new Error('Adding user name is mandatory to make a report.');
    }

    const reportNum = Math.floor(10300 + Math.random() * 8999);
    const reportId = `CC-${reportNum}`;
    const category = categories.find(c => c.id === draft.categoryId) || categories[0];
    const routing = resolveAuthorityForReport(draft.categoryId, selectedCommunity.city);

    const now = new Date().toISOString();
    const approxLoc = draft.location?.approximateLocation || `${selectedCommunity.name}, ${selectedCommunity.city}`;
    const exactLoc = draft.location?.exactAddress || `${approxLoc}`;

    const generatedTitle = draft.title.trim() || `${category.name} issue reported at ${draft.location?.streetAddress || approxLoc}`;

    // Compute coordinate according to the report's address
    let reportLat = draft.location?.latitude ?? draft.location?.lat;
    let reportLng = draft.location?.longitude ?? draft.location?.lng;

    const addressSeed = [
      draft.location?.streetAddress,
      draft.location?.landmark,
      draft.location?.area,
      draft.location?.exactAddress
    ].filter(Boolean).join(' ');

    if (!reportLat || !reportLng || (reportLat === selectedCommunity.coordinates.lat && reportLng === selectedCommunity.coordinates.lng)) {
      if (addressSeed) {
        const offset = generateAddressOffset(addressSeed);
        reportLat = Number((selectedCommunity.coordinates.lat + offset.deltaLat).toFixed(6));
        reportLng = Number((selectedCommunity.coordinates.lng + offset.deltaLng).toFixed(6));
      } else {
        reportLat = selectedCommunity.coordinates.lat;
        reportLng = selectedCommunity.coordinates.lng;
      }
    }

    const newReport: CivicReport = {
      id: reportId,
      communityId: selectedCommunity.id,
      categoryId: category.id,
      title: generatedTitle,
      description: draft.description || `${category.name} reported in the neighborhood. Please investigate and clear.`,
      latitude: reportLat,
      longitude: reportLng,
      accuracy: draft.location?.accuracy,
      locationTimestamp: draft.location?.timestamp,
      locationSource: draft.location?.source || 'manual',
      approximateLocation: approxLoc,
      exactAddress: exactLoc,
      jurisdiction: draft.location?.ward || selectedCommunity.wardNumber,
      authorityId: routing.authorityId,
      authorityName: routing.authorityName,
      department: routing.department,
      status: 'SUBMITTED',
      deliveryState: 'DELIVERED', // Instant internal delivery confirmation
      priority: category.priority,
      createdBy: identity.id,
      authorName: reporterName,
      isAnonymous: false,
      createdAt: now,
      updatedAt: now,
      affectedCount: 1, // Author is affected
      supportedCount: 1, // Author supports
      commentsCount: 0,
      evidence: draft.evidence.map((ev, index) => ({
        id: `ev-${Date.now()}-${index}`,
        url: ev.url,
        mediaType: ev.mediaType,
        uploadedBy: identity.id,
        uploadedByName: reporterName,
        createdAt: now,
        caption: ev.caption || 'Primary evidence'
      })),
      statusHistory: [
        {
          status: 'SUBMITTED',
          timestamp: now,
          note: `Report submitted by verified resident ${reporterName}`,
          actor: 'Citizen App'
        },
        {
          status: 'SENT_TO_AUTHORITY',
          timestamp: new Date(Date.now() + 1500).toISOString(),
          note: `Auto-routed to ${routing.authorityName} (${routing.department})`,
          actor: 'Routing Engine'
        }
      ],
      officialUpdates: [],
      escalationHours: routing.escalationHours,
      isEscalated: false
    };

    setReports(prev => [newReport, ...prev]);

    // Update user identity tracking with verified name
    setIdentity(prev => ({
      ...prev,
      displayName: reporterName,
      isAnonymous: false,
      supportedReportIds: [...prev.supportedReportIds, reportId],
      affectedReportIds: [...prev.affectedReportIds, reportId],
      followedReportIds: [...prev.followedReportIds, reportId]
    }));

    // Generate submission confirmation notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'SUBMISSION',
      title: 'Report Submitted & Routed',
      message: `Your report ${reportId} has been delivered to ${routing.authorityName}. Target resolution time: ${routing.escalationHours}h.`,
      timestamp: 'Just now',
      read: false,
      reportId: reportId
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Clear draft
    clearDraft();

    return newReport;
  };

  const supportReport = (reportId: string) => {
    const isSupported = identity.supportedReportIds.includes(reportId);
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            supportedCount: isSupported ? Math.max(1, r.supportedCount - 1) : r.supportedCount + 1
          };
        }
        return r;
      })
    );

    setIdentity(prev => ({
      ...prev,
      supportedReportIds: isSupported
        ? prev.supportedReportIds.filter(id => id !== reportId)
        : [...prev.supportedReportIds, reportId]
    }));
  };

  const markAffected = (reportId: string) => {
    const isAffected = identity.affectedReportIds.includes(reportId);
    if (isAffected) return; // Cannot un-affect, represents a verified voice count

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            affectedCount: r.affectedCount + 1
          };
        }
        return r;
      })
    );

    setIdentity(prev => ({
      ...prev,
      affectedReportIds: [...prev.affectedReportIds, reportId]
    }));

    // Notification to community
    const target = reports.find(r => r.id === reportId);
    if (target) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        type: 'COMMUNITY',
        title: "I'm Also Affected Recorded",
        message: `You joined ${target.affectedCount + 1} residents impacted by ${target.title.slice(0, 35)}...`,
        timestamp: 'Just now',
        read: false,
        reportId
      };
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const followReport = (reportId: string) => {
    const isFollowed = identity.followedReportIds.includes(reportId);
    setIdentity(prev => ({
      ...prev,
      followedReportIds: isFollowed
        ? prev.followedReportIds.filter(id => id !== reportId)
        : [...prev.followedReportIds, reportId]
    }));
  };

  const addEvidenceToReport = (reportId: string, evidenceData: { url: string; mediaType: 'image' | 'video'; caption?: string }) => {
    const newEv: ReportEvidence = {
      id: `ev-${Date.now()}`,
      url: evidenceData.url,
      mediaType: evidenceData.mediaType,
      uploadedBy: identity.id,
      uploadedByName: identity.isAnonymous ? 'Community Member' : identity.displayName,
      createdAt: new Date().toISOString(),
      caption: evidenceData.caption || 'Additional evidence from resident'
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            evidence: [...r.evidence, newEv],
            updatedAt: new Date().toISOString()
          };
        }
        return r;
      })
    );
  };

  const addCommentToReport = (reportId: string, text: string, isOfficial?: boolean) => {
    if (!text.trim()) return;

    const newComment: ReportComment = {
      id: `comm-${Date.now()}`,
      reportId,
      authorName: identity.isAnonymous ? 'Anonymous' : identity.displayName,
      authorId: identity.id,
      text: text.trim(),
      timestamp: 'Just now',
      isOfficial: isOfficial || identity.role === 'AUTHORITY_OFFICER',
      authorityRole: identity.role === 'AUTHORITY_OFFICER' ? 'Field Authority Officer' : undefined
    };

    setComments(prev => ({
      ...prev,
      [reportId]: [...(prev[reportId] || []), newComment]
    }));

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return { ...r, commentsCount: r.commentsCount + 1 };
        }
        return r;
      })
    );
  };

  const addCommunityPost = (content: string, isNotice?: boolean) => {
    if (!content.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      communityId: selectedCommunity.id,
      authorName: identity.isAnonymous ? 'Community Member' : identity.displayName,
      authorId: identity.id,
      content: content.trim(),
      timestamp: 'Just now',
      likes: 0,
      commentsCount: 0,
      isNotice: isNotice || false,
      tag: isNotice ? 'Notice' : undefined
    };

    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const likeCommunityPost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, likes: p.likes + 1 };
        }
        return p;
      })
    );
  };

  // Authority Actions
  const assignTeam = (reportId: string, teamName: string) => {
    const now = new Date().toISOString();
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            assignedTeam: teamName,
            status: 'ASSIGNED' as ReportStatus,
            updatedAt: now,
            statusHistory: [
              ...r.statusHistory,
              {
                status: 'ASSIGNED',
                timestamp: now,
                note: `Assigned to ${teamName}`,
                actor: 'Authority Dispatch'
              }
            ]
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'AUTHORITY',
      title: 'Issue Assigned to Field Team',
      message: `Case ${reportId} assigned to ${teamName}. Field inspection initiated.`,
      timestamp: 'Just now',
      read: false,
      reportId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateReportStatus = (reportId: string, newStatus: ReportStatus, note: string) => {
    const now = new Date().toISOString();
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: newStatus,
            updatedAt: now,
            statusHistory: [
              ...r.statusHistory,
              {
                status: newStatus,
                timestamp: now,
                note: note || `Status transitioned to ${newStatus}`,
                actor: 'Official Officer'
              }
            ]
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: newStatus === 'IN_PROGRESS' ? 'PROGRESS' : 'AUTHORITY',
      title: `Case Status: ${newStatus.replace('_', ' ')}`,
      message: `Update on ${reportId}: ${note}`,
      timestamp: 'Just now',
      read: false,
      reportId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const postOfficialUpdate = (reportId: string, message: string, actionTaken?: string) => {
    const now = new Date().toISOString();
    const update: OfficialUpdate = {
      id: `up-${Date.now()}`,
      officerName: identity.displayName || 'Authorized Officer',
      officerRole: 'Municipal Duty Officer',
      authorityName: 'MCD / Dept Control Room',
      message,
      timestamp: now,
      actionTaken
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            officialUpdates: [...r.officialUpdates, update],
            updatedAt: now
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'AUTHORITY',
      title: 'Official Authority Update',
      message: `${update.authorityName}: "${message.slice(0, 50)}..."`,
      timestamp: 'Just now',
      read: false,
      reportId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const resolveReportWithProof = (reportId: string, note: string, proofUrl: string) => {
    const now = new Date().toISOString();
    const resolutionProofEv: ReportEvidence = {
      id: `res-ev-${Date.now()}`,
      url: proofUrl || 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
      mediaType: 'image',
      uploadedBy: identity.id,
      uploadedByName: `${identity.displayName || 'Field Officer'} (Verified Authority)`,
      createdAt: now,
      caption: 'Official site resolution photograph after completion',
      isResolutionProof: true
    };

    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'RESOLVED',
            resolvedAt: now,
            updatedAt: now,
            resolutionEvidence: [...(r.resolutionEvidence || []), resolutionProofEv],
            resolutionNote: note || 'All on-site repair and cleaning operations have been concluded and verified.',
            statusHistory: [
              ...r.statusHistory,
              {
                status: 'RESOLVED',
                timestamp: now,
                note: note || 'Resolved with verified site evidence',
                actor: 'Authority Desk'
              }
            ]
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'RESOLUTION',
      title: 'Problem Resolved & Verified! 🟢',
      message: `Report ${reportId} has been marked as resolved with photographic proof. Check the resolution evidence.`,
      timestamp: 'Just now',
      read: false,
      reportId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const deleteReport = (reportId: string, reason?: string) => {
    // 1. Add to deleted IDs set in localStorage so it never re-appears
    try {
      const deletedRaw = localStorage.getItem('cc_deleted_report_ids');
      const deletedList: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      if (!deletedList.includes(reportId)) {
        deletedList.push(reportId);
        localStorage.setItem('cc_deleted_report_ids', JSON.stringify(deletedList));
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Remove from reports state
    setReports(prev => prev.filter(r => r.id !== reportId));

    // 3. Remove associated comments
    setComments(prev => {
      const next = { ...prev };
      delete next[reportId];
      return next;
    });

    // 4. Close modal if currently inspecting this report
    if (selectedReportId === reportId) {
      setSelectedReportId(null);
    }

    // 5. Create audit notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'AUTHORITY',
      title: 'Admin Action: Case Removed 🗑️',
      message: `Report ${reportId} was permanently deleted by Platform Admin${reason ? ` (${reason})` : ''}.`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return true;
  };

  const bulkDeleteReports = (reportIds: string[], reason?: string) => {
    if (!reportIds.length) return;
    try {
      const deletedRaw = localStorage.getItem('cc_deleted_report_ids');
      const deletedList: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
      reportIds.forEach(id => {
        if (!deletedList.includes(id)) deletedList.push(id);
      });
      localStorage.setItem('cc_deleted_report_ids', JSON.stringify(deletedList));
    } catch (e) {
      console.error(e);
    }

    const idSet = new Set(reportIds);
    setReports(prev => prev.filter(r => !idSet.has(r.id)));
    setComments(prev => {
      const next = { ...prev };
      reportIds.forEach(id => delete next[id]);
      return next;
    });

    if (selectedReportId && idSet.has(selectedReportId)) {
      setSelectedReportId(null);
    }

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'AUTHORITY',
      title: 'Admin Action: Bulk Cases Removed 🗑️',
      message: `${reportIds.length} reports permanently deleted by Platform Admin${reason ? ` (${reason})` : ''}.`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateReportByAdmin = (
    reportId: string,
    updates: {
      status?: ReportStatus;
      priority?: PriorityLevel;
      authorityId?: string;
      authorityName?: string;
      adminNote?: string;
    }
  ) => {
    const now = new Date().toISOString();
    setReports(prev =>
      prev.map(r => {
        if (r.id === reportId) {
          const newStatus = updates.status || r.status;
          const newPriority = updates.priority || r.priority;
          const newAuthorityId = updates.authorityId || r.authorityId;
          const newAuthorityName = updates.authorityName || r.authorityName;

          const updatedHistory = [...r.statusHistory];
          if (updates.status && updates.status !== r.status) {
            updatedHistory.push({
              status: updates.status,
              timestamp: now,
              note: updates.adminNote || `Admin overridden status to ${updates.status}`,
              actor: `Platform Admin (${adminUsername || 'Municipal Control'})`
            });
          }

          const officialUpdates = [...r.officialUpdates];
          if (updates.adminNote) {
            officialUpdates.push({
              id: `up-${Date.now()}`,
              officerName: adminUsername || 'Super Admin',
              officerRole: 'Municipal Governance Administrator',
              authorityName: 'Municipal Admin Control Center',
              message: updates.adminNote,
              timestamp: now,
              actionTaken: 'Governance Override'
            });
          }

          return {
            ...r,
            status: newStatus,
            priority: newPriority,
            authorityId: newAuthorityId,
            authorityName: newAuthorityName,
            statusHistory: updatedHistory,
            officialUpdates,
            updatedAt: now
          };
        }
        return r;
      })
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'AUTHORITY',
      title: 'Admin Governance Update 🛡️',
      message: `Case ${reportId} modified by Admin: ${updates.adminNote || 'Priority/Status adjusted.'}`,
      timestamp: 'Just now',
      read: false,
      reportId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const updateDraft = (updates: Partial<ReportDraft>) => {
    setReportDraft(prev => ({ ...prev, ...updates }));
  };

  const clearDraft = () => {
    setReportDraft(DEFAULT_DRAFT);
  };

  const hasDraft = Boolean(reportDraft.categoryId || reportDraft.evidence.length > 0 || reportDraft.description);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedReportId,
        setSelectedReportId,
        isReportWizardOpen,
        setIsReportWizardOpen,
        identity,
        updateDisplayName,
        toggleAnonymous,
        switchRole,
        selectedCommunity,
        switchCommunity,
        allCommunities: communities,
        categories,
        reports,
        communityPosts,
        comments,
        notifications,
        authorities,
        mappingRules,
        createReport,
        supportReport,
        markAffected,
        followReport,
        addEvidenceToReport,
        addCommentToReport,
        addCommunityPost,
        likeCommunityPost,
        assignTeam,
        updateReportStatus,
        postOfficialUpdate,
        resolveReportWithProof,
        reportDraft,
        updateDraft,
        clearDraft,
        hasDraft,
        markNotificationAsRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        resolveAuthorityForReport,
        isAdminAuthenticated,
        adminUsername,
        loginAdmin,
        logoutAdmin,
        deleteReport,
        bulkDeleteReports,
        updateReportByAdmin,
        isDetectingLocation,
        useCurrentLocation,
        isUsingCurrentLocation,
        locationStatusMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
