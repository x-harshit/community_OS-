export type Role = 'RESIDENT' | 'COMMUNITY_ADMIN' | 'AUTHORITY_OFFICER' | 'PLATFORM_ADMIN';

export type ReportStatus = 'SUBMITTED' | 'SENT_TO_AUTHORITY' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
export type DeliveryState = 'PENDING' | 'DELIVERED';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface CivicCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultEscalationHours: number;
  priority: PriorityLevel;
  authorityType: string;
}

export interface Community {
  id: string;
  name: string;
  city: string;
  state: string;
  memberCount: number;
  activeReportsCount: number;
  wardNumber: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface UserIdentity {
  id: string;
  displayName: string;
  communityId: string;
  role: Role;
  isAnonymous: boolean;
  avatarSeed: string;
  supportedReportIds: string[];
  affectedReportIds: string[];
  followedReportIds: string[];
}

export interface ReportEvidence {
  id: string;
  url: string;
  mediaType: 'image' | 'video';
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  caption?: string;
  isResolutionProof?: boolean;
}

export interface OfficialUpdate {
  id: string;
  officerName: string;
  officerRole: string;
  authorityName: string;
  message: string;
  timestamp: string;
  actionTaken?: string;
}

export interface StatusHistoryItem {
  status: ReportStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface CivicReport {
  id: string; // e.g. CC-10284
  communityId: string;
  categoryId: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  locationTimestamp?: number;
  locationSource?: 'device_gps' | 'manual';
  approximateLocation: string; // community-safe
  exactAddress: string; // authority-only
  jurisdiction: string;
  authorityId: string;
  authorityName: string;
  department: string;
  assignedTeam?: string;
  status: ReportStatus;
  deliveryState: DeliveryState;
  priority: PriorityLevel;
  createdBy: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  affectedCount: number;
  supportedCount: number;
  commentsCount: number;
  evidence: ReportEvidence[];
  resolutionEvidence?: ReportEvidence[];
  resolutionNote?: string;
  statusHistory: StatusHistoryItem[];
  officialUpdates: OfficialUpdate[];
  escalationHours: number;
  isEscalated: boolean;
}

export interface ReportComment {
  id: string;
  reportId: string;
  authorName: string;
  authorId: string;
  text: string;
  timestamp: string;
  isOfficial?: boolean;
  authorityRole?: string;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorName: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  isNotice?: boolean;
  tag?: string;
}

export interface AppNotification {
  id: string;
  type: 'SUBMISSION' | 'AUTHORITY' | 'PROGRESS' | 'RESOLUTION' | 'COMMUNITY';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  reportId?: string;
}

export interface Authority {
  id: string;
  name: string;
  code: string;
  department: string;
  jurisdiction: string;
  phone: string;
  email: string;
  verified: boolean;
  teams: string[];
}

export interface AuthorityMappingRule {
  categoryId: string;
  jurisdiction: string;
  authorityId: string;
  authorityName: string;
  department: string;
  escalationHours: number;
}
