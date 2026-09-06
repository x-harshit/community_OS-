import {
  CivicCategory,
  Community,
  CivicReport,
  CommunityPost,
  ReportComment,
  Authority,
  AuthorityMappingRule,
  AppNotification
} from '../types';

export const INITIAL_CATEGORIES: CivicCategory[] = [
  {
    id: 'waste',
    name: 'Waste / Garbage',
    icon: 'Trash2',
    description: 'Uncollected garbage, overflowing dumpsters, littered public spots',
    defaultEscalationHours: 48,
    priority: 'HIGH',
    authorityType: 'Municipal Corporation (Sanitation)'
  },
  {
    id: 'water',
    name: 'Water / Leakage',
    icon: 'Droplets',
    description: 'Broken water mains, contaminated supply, dry taps, pipeline burst',
    defaultEscalationHours: 24,
    priority: 'HIGH',
    authorityType: 'Water Supply Board'
  },
  {
    id: 'road',
    name: 'Road / Pothole',
    icon: 'Milestone',
    description: 'Deep potholes, broken tarmac, cave-ins, hazardous road craters',
    defaultEscalationHours: 72,
    priority: 'MEDIUM',
    authorityType: 'Public Works Department'
  },
  {
    id: 'drainage',
    name: 'Drainage / Sewerage',
    icon: 'Waves',
    description: 'Blocked stormwater drains, overflowing sewer manholes, stagnant water',
    defaultEscalationHours: 36,
    priority: 'HIGH',
    authorityType: 'Drainage & Sewerage Board'
  },
  {
    id: 'street_light',
    name: 'Street Light',
    icon: 'Lightbulb',
    description: 'Dark streets, non-functioning lamp posts, exposed electrical wires',
    defaultEscalationHours: 48,
    priority: 'MEDIUM',
    authorityType: 'Municipal Electrical Wing'
  },
  {
    id: 'electricity',
    name: 'Electricity',
    icon: 'Zap',
    description: 'Transformer spark, dangling live wires, voltage fluctuations',
    defaultEscalationHours: 12,
    priority: 'EMERGENCY',
    authorityType: 'Power Distribution Company'
  },
  {
    id: 'traffic',
    name: 'Traffic / Signal',
    icon: 'Compass',
    description: 'Dead traffic lights, illegal parking chokepoints, missing signboards',
    defaultEscalationHours: 24,
    priority: 'HIGH',
    authorityType: 'Traffic Police & Transport'
  },
  {
    id: 'park',
    name: 'Park / Tree',
    icon: 'Trees',
    description: 'Fallen dangerous branches, damaged park swings, overgrown bushes',
    defaultEscalationHours: 72,
    priority: 'LOW',
    authorityType: 'Horticulture Department'
  },
  {
    id: 'toilet',
    name: 'Public Toilet',
    icon: 'DoorClosed',
    description: 'Inoperable community restrooms, lack of water, broken locks',
    defaultEscalationHours: 36,
    priority: 'MEDIUM',
    authorityType: 'Sanitation Dept'
  },
  {
    id: 'construction',
    name: 'Construction / Encroachment',
    icon: 'HardHat',
    description: 'Sidewalk encroachment, illegal debris dumping, pedestrian blockage',
    defaultEscalationHours: 96,
    priority: 'MEDIUM',
    authorityType: 'Town Planning & Enforcement'
  },
  {
    id: 'animal',
    name: 'Stray Animal',
    icon: 'PawPrint',
    description: 'Aggressive stray packs, injured cattle on main road, animal distress',
    defaultEscalationHours: 48,
    priority: 'MEDIUM',
    authorityType: 'Veterinary Services Cell'
  },
  {
    id: 'transport',
    name: 'Public Transport',
    icon: 'Bus',
    description: 'Damaged bus stop shelter, missing route timetables, unsafe bus bay',
    defaultEscalationHours: 96,
    priority: 'LOW',
    authorityType: 'State Transport Dept'
  },
  {
    id: 'health',
    name: 'Public Health',
    icon: 'Stethoscope',
    description: 'Mosquito breeding swamp, medical waste, hazardous chemical spill',
    defaultEscalationHours: 24,
    priority: 'HIGH',
    authorityType: 'Public Health Office'
  },
  {
    id: 'noise',
    name: 'Noise / Nuisance',
    icon: 'Volume2',
    description: 'Prohibited late-night industrial noise, illegal loudspeakers',
    defaultEscalationHours: 12,
    priority: 'MEDIUM',
    authorityType: 'Police & Pollution Board'
  },
  {
    id: 'other',
    name: 'Other Civic Issue',
    icon: 'AlertCircle',
    description: 'General neighborhood civic hazard or public infrastructure concern',
    defaultEscalationHours: 72,
    priority: 'MEDIUM',
    authorityType: 'General Municipal Cell'
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'yamuna-vihar',
    name: 'Yamuna Vihar',
    city: 'Delhi',
    state: 'Delhi',
    memberCount: 2481,
    activeReportsCount: 14,
    wardNumber: 'Ward 44-E (East Delhi)',
    coordinates: {
      lat: 28.6987,
      lng: 77.2789
    }
  },
  {
    id: 'rohini-sec14',
    name: 'Rohini Sector 14',
    city: 'Delhi',
    state: 'Delhi',
    memberCount: 1890,
    activeReportsCount: 9,
    wardNumber: 'Ward 22-N (North Delhi)',
    coordinates: {
      lat: 28.7180,
      lng: 77.1264
    }
  },
  {
    id: 'indirapuram',
    name: 'Indirapuram',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
    memberCount: 3120,
    activeReportsCount: 18,
    wardNumber: 'Ward 12 (Ghaziabad Nagar Nigam)',
    coordinates: {
      lat: 28.6366,
      lng: 77.3688
    }
  },
  {
    id: 'koramangala',
    name: 'Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    memberCount: 4200,
    activeReportsCount: 12,
    wardNumber: 'Ward 151 (BBMP South)',
    coordinates: {
      lat: 12.9343,
      lng: 77.6252
    }
  }
];

export const INITIAL_AUTHORITIES: Authority[] = [
  {
    id: 'auth-mcd-sanitation',
    name: 'Municipal Corporation of Delhi (MCD)',
    code: 'MCD-SWM',
    department: 'Solid Waste & Sanitation Division',
    jurisdiction: 'Delhi Ward 44-E / Shahdara North',
    phone: '155304',
    email: 'sanitation.mcd@gov.in',
    verified: true,
    teams: ['Team Alpha (Block B-C)', 'Team Bravo (Market Zone)', 'Emergency Rapid Squad']
  },
  {
    id: 'auth-djb',
    name: 'Delhi Jal Board (DJB)',
    code: 'DJB-OPS',
    department: 'Water Supply & Sewer Maintenance Cell',
    jurisdiction: 'Yamuna Vihar Underground Reservoir Area',
    phone: '1916',
    email: 'complaints@delhijalboard.nic.in',
    verified: true,
    teams: ['Leakage Repair Crew 1', 'Submersible Unit 4', 'Sewer Desilting Crew']
  },
  {
    id: 'auth-pwd',
    name: 'Public Works Department (PWD Delhi)',
    code: 'PWD-ROADS',
    department: 'Division 3 - Arterial Roads & Drainage',
    jurisdiction: 'North-East Delhi Roads Zone',
    phone: '1800-11-0093',
    email: 'roads.pwd@delhi.gov.in',
    verified: true,
    teams: ['Hotmix Patch Team 2', 'Drain Maintenance Unit', 'Footpath Restoral Gang']
  },
  {
    id: 'auth-bses',
    name: 'BSES Yamuna Power Limited',
    code: 'BYPL-ELEC',
    department: 'Distribution, Metering & Street Lighting',
    jurisdiction: 'East Circle Yamuna Vihar Grid',
    phone: '19122',
    email: 'bypl.customercare@relianceada.com',
    verified: true,
    teams: ['Linesmen Rapid Team 3', 'Streetlight Maintenance 1', 'Transformer Inspection Team']
  },
  {
    id: 'auth-traffic',
    name: 'Delhi Traffic Police',
    code: 'DTP-CELL',
    department: 'Traffic Engineering & Signal Control',
    jurisdiction: 'Shahdara North Traffic Circle',
    phone: '1095',
    email: 'traffic@delhipolice.gov.in',
    verified: true,
    teams: ['Signal Response Van 04', 'Towing Support Team']
  }
];

export const INITIAL_MAPPING_RULES: AuthorityMappingRule[] = [
  {
    categoryId: 'waste',
    jurisdiction: 'Delhi',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'MCD - Solid Waste & Sanitation',
    department: 'Sanitation Division Ward 44-E',
    escalationHours: 48
  },
  {
    categoryId: 'water',
    jurisdiction: 'Delhi',
    authorityId: 'auth-djb',
    authorityName: 'Delhi Jal Board',
    department: 'Water Supply & Leakage Cell',
    escalationHours: 24
  },
  {
    categoryId: 'drainage',
    jurisdiction: 'Delhi',
    authorityId: 'auth-djb',
    authorityName: 'Delhi Jal Board & MCD Drainage',
    department: 'Sewer Maintenance Division',
    escalationHours: 36
  },
  {
    categoryId: 'road',
    jurisdiction: 'Delhi',
    authorityId: 'auth-pwd',
    authorityName: 'Public Works Department (PWD)',
    department: 'Road Works & Infrastructure Cell',
    escalationHours: 72
  },
  {
    categoryId: 'street_light',
    jurisdiction: 'Delhi',
    authorityId: 'auth-bses',
    authorityName: 'BSES Yamuna Power Limited',
    department: 'Public Lighting Division',
    escalationHours: 48
  },
  {
    categoryId: 'electricity',
    jurisdiction: 'Delhi',
    authorityId: 'auth-bses',
    authorityName: 'BSES Yamuna Power Limited',
    department: 'Emergency Power Grid Division',
    escalationHours: 12
  },
  {
    categoryId: 'traffic',
    jurisdiction: 'Delhi',
    authorityId: 'auth-traffic',
    authorityName: 'Delhi Traffic Police',
    department: 'Signal & Corridor Management',
    escalationHours: 24
  },
  {
    categoryId: 'park',
    jurisdiction: 'Delhi',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'MCD Horticulture Wing',
    department: 'Parks & Greens Management',
    escalationHours: 72
  },
  {
    categoryId: 'toilet',
    jurisdiction: 'Delhi',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'MCD Public Health & Sanitation',
    department: 'Community Toilet Management',
    escalationHours: 36
  },
  {
    categoryId: 'animal',
    jurisdiction: 'Delhi',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'MCD Veterinary Division',
    department: 'Stray Animal Welfare & Control',
    escalationHours: 48
  },
  {
    categoryId: 'health',
    jurisdiction: 'Delhi',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'MCD Public Health Office',
    department: 'Epidemic & Sanitation Cell',
    escalationHours: 24
  },
  {
    categoryId: 'noise',
    jurisdiction: 'Delhi',
    authorityId: 'auth-traffic',
    authorityName: 'Local Police & Pollution Control',
    department: 'Public Order & Nuisance Squad',
    escalationHours: 12
  },
  {
    categoryId: 'other',
    jurisdiction: 'Delhi',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'Municipal Corporation of Delhi',
    department: 'General Citizen Redressal',
    escalationHours: 72
  }
];

export const INITIAL_REPORTS: CivicReport[] = [
  {
    id: 'CC-10284',
    communityId: 'yamuna-vihar',
    categoryId: 'waste',
    title: 'Severe garbage accumulation blocking service road',
    description: 'Garbage has not been collected for three days near the community park gate and is spilling onto the road, emitting foul odor and breeding mosquitoes.',
    latitude: 28.6992,
    longitude: 77.2798,
    approximateLocation: 'Near Community Park, Block B',
    exactAddress: 'Opposite Gate 3, DDA Community Park, Block B Road, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'Municipal Corporation of Delhi (MCD)',
    department: 'Solid Waste & Sanitation Division',
    assignedTeam: 'Team Alpha (Block B-C)',
    status: 'IN_PROGRESS',
    deliveryState: 'DELIVERED',
    priority: 'HIGH',
    createdBy: 'user_rahul',
    authorName: 'Rahul Sharma',
    isAnonymous: false,
    createdAt: '2026-09-04T09:30:00Z',
    updatedAt: '2026-09-05T14:15:00Z',
    affectedCount: 42,
    supportedCount: 24,
    commentsCount: 6,
    evidence: [
      {
        id: 'ev-1',
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        uploadedBy: 'user_rahul',
        uploadedByName: 'Rahul Sharma',
        createdAt: '2026-09-04T09:30:00Z',
        caption: 'Dumpster overflow extending onto pedestrian path'
      },
      {
        id: 'ev-2',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYgSuZdxSCOpXL6N3KtJ1k2V4Ty7C24k3yRKxaxMaf8A&s=10',
        mediaType: 'image',
        uploadedBy: 'user_priya',
        uploadedByName: 'Priya K.',
        createdAt: '2026-09-04T12:10:00Z',
        caption: 'Additional photo showing stray dogs scattering bags'
      }
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-04T09:30:00Z',
        note: 'Report generated by citizen Rahul Sharma',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-04T09:31:00Z',
        note: 'Auto-routed to MCD Sanitation Division via Jurisdiction Engine',
        actor: 'Routing Engine'
      },
      {
        status: 'ASSIGNED',
        timestamp: '2026-09-04T14:20:00Z',
        note: 'Assigned to Sanitary Inspector R.K. Verma & Team Alpha',
        actor: 'MCD Dispatch Desk'
      },
      {
        status: 'IN_PROGRESS',
        timestamp: '2026-09-05T10:00:00Z',
        note: 'Compactor vehicle and cleaning staff dispatched to site',
        actor: 'Insp. R.K. Verma'
      }
    ],
    officialUpdates: [
      {
        id: 'up-1',
        officerName: 'Insp. R.K. Verma',
        officerRole: 'Senior Sanitary Inspector',
        authorityName: 'MCD Shahdara North',
        message: 'Cleaning squad and 2 compactor trucks deployed. Clearing operation scheduled to finish before 5:00 PM today.',
        timestamp: '2026-09-05T10:05:00Z',
        actionTaken: 'Compactor truck DL-1GC-4482 active on site'
      }
    ],
    escalationHours: 48,
    isEscalated: false
  },
  {
    id: 'CC-10279',
    communityId: 'yamuna-vihar',
    categoryId: 'road',
    title: 'Deep pothole causing vehicle damage near Metro Pillar 42',
    description: 'Over 1.5-foot deep pothole formed after heavy rainfall. Multiple two-wheelers have skidded and suffered rim damage in the last 48 hours.',
    latitude: 28.6975,
    longitude: 77.2765,
    approximateLocation: 'Main Wazirabad Road, Near Metro Pillar 42',
    exactAddress: 'Wazirabad Road opposite Metro Pillar 42, Block C Exit, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-pwd',
    authorityName: 'Public Works Department (PWD Delhi)',
    department: 'Division 3 - Arterial Roads & Drainage',
    assignedTeam: 'Hotmix Patch Team 2',
    status: 'RESOLVED',
    deliveryState: 'DELIVERED',
    priority: 'HIGH',
    createdBy: 'user_aman',
    authorName: 'Aman Deep',
    isAnonymous: false,
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-04T16:30:00Z',
    resolvedAt: '2026-09-04T16:30:00Z',
    affectedCount: 58,
    supportedCount: 39,
    commentsCount: 9,
    evidence: [
      {
        id: 'ev-3',
        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        uploadedBy: 'user_aman',
        uploadedByName: 'Aman Deep',
        createdAt: '2026-09-02T11:00:00Z',
        caption: 'Hazardous deep pothole on fast-moving lane'
      }
    ],
    resolutionEvidence: [
      {
        id: 'ev-res-1',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        uploadedBy: 'pwd_officer_mehta',
        uploadedByName: 'Eng. S.K. Mehta (PWD)',
        createdAt: '2026-09-04T16:30:00Z',
        caption: 'Bituminous hotmix asphalt leveling completed & compacted with heavy roller.',
        isResolutionProof: true
      }
    ],
    resolutionNote: 'The crater was excavated, filled with stone-aggregate base, and resurfaced with dense bituminous concrete. Road is fully open and leveled.',
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-02T11:00:00Z',
        note: 'Reported by Aman Deep with photo proof',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-02T11:01:00Z',
        note: 'Forwarded to PWD Division 3 Desk',
        actor: 'Routing Engine'
      },
      {
        status: 'ASSIGNED',
        timestamp: '2026-09-03T08:30:00Z',
        note: 'Assigned to Hotmix Patch Team 2 under Eng. Mehta',
        actor: 'PWD Operations'
      },
      {
        status: 'IN_PROGRESS',
        timestamp: '2026-09-04T09:00:00Z',
        note: 'Hotmix asphalt roller operation underway',
        actor: 'Eng. S.K. Mehta'
      },
      {
        status: 'RESOLVED',
        timestamp: '2026-09-04T16:30:00Z',
        note: 'Official resolution proof verified & uploaded',
        actor: 'Eng. S.K. Mehta'
      }
    ],
    officialUpdates: [
      {
        id: 'up-2',
        officerName: 'Eng. S.K. Mehta',
        officerRole: 'Executive Engineer',
        authorityName: 'PWD Delhi Division 3',
        message: 'Resurfacing completed with dense hotmix asphalt. Tested for smooth vehicle clearance.',
        timestamp: '2026-09-04T16:35:00Z',
        actionTaken: 'Patching work verified'
      }
    ],
    escalationHours: 72,
    isEscalated: false
  },
  {
    id: 'CC-10291',
    communityId: 'yamuna-vihar',
    categoryId: 'street_light',
    title: 'Three consecutive streetlights dark along Central Market Lane',
    description: 'The entire alley behind Central Market has been completely pitch black for 4 nights. Women and elderly residents feel unsafe walking in the evening.',
    latitude: 28.7010,
    longitude: 77.2812,
    approximateLocation: 'Behind Central Market, Block C',
    exactAddress: 'Alleyway 4, Block C Market, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-bses',
    authorityName: 'BSES Yamuna Power Limited',
    department: 'Distribution, Metering & Street Lighting',
    status: 'SUBMITTED',
    deliveryState: 'DELIVERED',
    priority: 'MEDIUM',
    createdBy: 'user_priya',
    authorName: 'Priya K.',
    isAnonymous: false,
    createdAt: '2026-09-05T18:20:00Z',
    updatedAt: '2026-09-05T18:20:00Z',
    affectedCount: 19,
    supportedCount: 12,
    commentsCount: 3,
    evidence: [
      {
        id: 'ev-4',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYgSuZdxSCOpXL6N3KtJ1k2V4Ty7C24k3yRKxaxMaf8A&s=10',
        mediaType: 'image',
        uploadedBy: 'user_priya',
        uploadedByName: 'Priya K.',
        createdAt: '2026-09-05T18:20:00Z',
        caption: 'Pitch dark street pole at 8:00 PM'
      }
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-05T18:20:00Z',
        note: 'Reported with GPS location confirmation',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-05T18:21:00Z',
        note: 'Received by BSES Yamuna Power Streetlight automated gateway',
        actor: 'Routing Engine'
      }
    ],
    officialUpdates: [],
    escalationHours: 48,
    isEscalated: false
  },
  {
    id: 'CC-10295',
    communityId: 'yamuna-vihar',
    categoryId: 'water',
    title: 'High-pressure potable pipeline burst flooding street',
    description: 'Main clean water pipeline has ruptured underground. Clean drinking water has been gushing out for 4 hours, creating a mini lake and dropping water pressure across Block B houses.',
    latitude: 28.7001,
    longitude: 77.2774,
    approximateLocation: 'Opposite Sub-Post Office, Block B',
    exactAddress: 'Lane 12, Block B near Sub-Post Office, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-djb',
    authorityName: 'Delhi Jal Board (DJB)',
    department: 'Water Supply & Leakage Cell',
    assignedTeam: 'Leakage Repair Crew 1',
    status: 'ASSIGNED',
    deliveryState: 'DELIVERED',
    priority: 'EMERGENCY',
    createdBy: 'user_vikram',
    authorName: 'Vikram Joshi',
    isAnonymous: false,
    createdAt: '2026-09-05T20:10:00Z',
    updatedAt: '2026-09-05T21:40:00Z',
    affectedCount: 64,
    supportedCount: 45,
    commentsCount: 11,
    evidence: [
      {
        id: 'ev-5',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF_0NrB_eWV-Z04nRFLTvLAHOC1lD0RArvtdzTTsqg9Q&s=10',
        mediaType: 'image',
        uploadedBy: 'user_vikram',
        uploadedByName: 'Vikram Joshi',
        createdAt: '2026-09-05T20:10:00Z',
        caption: 'Water gushing out of pavement joints'
      }
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-05T20:10:00Z',
        note: 'Emergency pipeline burst flagged',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-05T20:11:00Z',
        note: 'Dispatched to Delhi Jal Board Control Room',
        actor: 'Routing Engine'
      },
      {
        status: 'ASSIGNED',
        timestamp: '2026-09-05T21:40:00Z',
        note: 'Valve isolation team and Repair Crew 1 assigned',
        actor: 'DJB Control Room'
      }
    ],
    officialUpdates: [
      {
        id: 'up-3',
        officerName: 'Junior Eng. T. Saxena',
        officerRole: 'Water Distribution JE',
        authorityName: 'Delhi Jal Board',
        message: 'Main distribution valve temporarily closed to stop flooding. Repair crew en-route with replacement flange.',
        timestamp: '2026-09-05T21:45:00Z',
        actionTaken: 'Upstream feeder valve turned off'
      }
    ],
    escalationHours: 24,
    isEscalated: false
  },
  {
    id: 'CC-10298',
    communityId: 'yamuna-vihar',
    categoryId: 'street_light',
    title: 'High-voltage cable sagging across pedestrian pathway',
    description: 'Overhead power cable has detached from the tension bracket and is hanging at head height near the market entrance. Severe electrocution hazard especially during rainy evenings.',
    latitude: 28.7025,
    longitude: 77.2785,
    approximateLocation: 'C-Block Main Market Road',
    exactAddress: 'Opposite Substation No. 4, C-Block Main Market Road, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-bses',
    authorityName: 'BSES Yamuna Power Limited',
    department: 'Emergency Power Grid Division',
    assignedTeam: 'High Voltage Quick Response Unit',
    status: 'IN_PROGRESS',
    deliveryState: 'DELIVERED',
    priority: 'EMERGENCY',
    createdBy: 'user_kavita',
    authorName: 'Kavita Singh',
    isAnonymous: false,
    createdAt: '2026-09-05T15:40:00Z',
    updatedAt: '2026-09-05T17:10:00Z',
    affectedCount: 38,
    supportedCount: 29,
    commentsCount: 5,
    evidence: [
      {
        id: 'ev-6',
        url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        uploadedBy: 'user_kavita',
        uploadedByName: 'Kavita Singh',
        createdAt: '2026-09-05T15:40:00Z',
        caption: 'Sagging low-tension cable over footpath'
      }
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-05T15:40:00Z',
        note: 'High voltage hazard reported',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-05T15:41:00Z',
        note: 'Escalated to BSES Emergency Grid Unit',
        actor: 'Routing Engine'
      },
      {
        status: 'IN_PROGRESS',
        timestamp: '2026-09-05T17:10:00Z',
        note: 'Line crew deployed with safety bucket truck',
        actor: 'BSES Dispatch'
      }
    ],
    officialUpdates: [
      {
        id: 'up-4',
        officerName: 'Linesman S. Rawat',
        officerRole: 'Emergency Line Inspector',
        authorityName: 'BSES Yamuna Power',
        message: 'Line isolated safely. New insulator bracket being installed.',
        timestamp: '2026-09-05T17:15:00Z',
        actionTaken: 'Power redirected and cable pulled to code clearance'
      }
    ],
    escalationHours: 24,
    isEscalated: false
  },
  {
    id: 'CC-10302',
    communityId: 'yamuna-vihar',
    categoryId: 'waste',
    title: 'Blocked stormwater culvert overflowing into market alley',
    description: 'Debris and construction rubble are choking the main culvert. Water is backing up into retail shops and generating black sludge across the alleyway.',
    latitude: 28.6960,
    longitude: 77.2830,
    approximateLocation: 'Service Lane, Sector Market Entry',
    exactAddress: 'Drainage Culvert 7, Service Lane, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-mcd-sanitation',
    authorityName: 'Municipal Corporation of Delhi (MCD)',
    department: 'Solid Waste & Sanitation Division',
    status: 'SUBMITTED',
    deliveryState: 'DELIVERED',
    priority: 'HIGH',
    createdBy: 'user_sunita',
    authorName: 'Sunita Mehra',
    isAnonymous: false,
    createdAt: '2026-09-06T02:15:00Z',
    updatedAt: '2026-09-06T02:15:00Z',
    affectedCount: 22,
    supportedCount: 16,
    commentsCount: 2,
    evidence: [
      {
        id: 'ev-7',
        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        uploadedBy: 'user_sunita',
        uploadedByName: 'Sunita Mehra',
        createdAt: '2026-09-06T02:15:00Z',
        caption: 'Culvert blocked with silt and construction waste'
      }
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-06T02:15:00Z',
        note: 'Culvert blockage logged by shopkeeper',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-06T02:16:00Z',
        note: 'Routed to Shahdara North MCD Drainage Wing',
        actor: 'Routing Engine'
      }
    ],
    officialUpdates: [],
    escalationHours: 48,
    isEscalated: false
  },
  {
    id: 'CC-10305',
    communityId: 'yamuna-vihar',
    categoryId: 'road',
    title: 'Uncovered manhole and broken pavement slabs outside school gate',
    description: 'An open sewer manhole with broken concrete lid sits directly on the primary walking path outside the school gate. Children and parents are at high danger of falling in.',
    latitude: 28.7032,
    longitude: 77.2805,
    approximateLocation: 'School Road, Block B',
    exactAddress: 'Outside Gate 2, Senior Secondary School Road, Block B, Yamuna Vihar, Delhi 110053',
    jurisdiction: 'Delhi Ward 44-E',
    authorityId: 'auth-pwd',
    authorityName: 'Public Works Department (PWD Delhi)',
    department: 'Division 3 - Arterial Roads & Drainage',
    assignedTeam: 'Civil Road Maintenance Squad 4',
    status: 'IN_PROGRESS',
    deliveryState: 'DELIVERED',
    priority: 'HIGH',
    createdBy: 'user_deepak',
    authorName: 'Deepak Verma',
    isAnonymous: false,
    createdAt: '2026-09-06T03:00:00Z',
    updatedAt: '2026-09-06T04:20:00Z',
    affectedCount: 51,
    supportedCount: 37,
    commentsCount: 7,
    evidence: [
      {
        id: 'ev-8',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAJpeV9hFP3txijY32kdlbsa-b6et5eLAPbfFjNkDYCg&s=10',
        mediaType: 'image',
        uploadedBy: 'user_deepak',
        uploadedByName: 'Deepak Verma',
        createdAt: '2026-09-06T03:00:00Z',
        caption: 'Broken slab with exposed 6ft drop outside school'
      }
    ],
    statusHistory: [
      {
        status: 'SUBMITTED',
        timestamp: '2026-09-06T03:00:00Z',
        note: 'Hazard reported by PTA member',
        actor: 'Citizen App'
      },
      {
        status: 'SENT_TO_AUTHORITY',
        timestamp: '2026-09-06T03:01:00Z',
        note: 'Transmitted to PWD Civil Zone',
        actor: 'Routing Engine'
      },
      {
        status: 'IN_PROGRESS',
        timestamp: '2026-09-06T04:20:00Z',
        note: 'Temporary safety barricade placed; heavy cast iron cover ordered',
        actor: 'PWD Inspector'
      }
    ],
    officialUpdates: [
      {
        id: 'up-5',
        officerName: 'Asst. Eng. M. Ansari',
        officerRole: 'PWD Maintenance Wing',
        authorityName: 'PWD Delhi',
        message: 'Red hazard cones and reflective barricade installed around open chamber. New reinforced concrete cover arriving by 2 PM.',
        timestamp: '2026-09-06T04:25:00Z',
        actionTaken: 'Safety perimeter established'
      }
    ],
    escalationHours: 24,
    isEscalated: false
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    communityId: 'yamuna-vihar',
    authorName: 'RWA President - Mr. Gupta',
    authorId: 'rwa_gupta',
    content: '📢 Important Update: The municipal fogging team for dengue & malaria prevention will be visiting Blocks A, B, and C tomorrow morning between 7:30 AM and 10:00 AM. Please keep balcony windows open.',
    timestamp: '2 hours ago',
    likes: 38,
    commentsCount: 7,
    isNotice: true,
    tag: 'Official Notice'
  },
  {
    id: 'post-2',
    communityId: 'yamuna-vihar',
    authorName: 'Rahul Sharma',
    authorId: 'user_rahul',
    content: 'Does anyone know when the weekly garbage compactor visits Block B? The bin near the park was completely full this morning.',
    timestamp: '5 hours ago',
    likes: 14,
    commentsCount: 5
  },
  {
    id: 'post-3',
    communityId: 'yamuna-vihar',
    authorName: 'Priya K.',
    authorId: 'user_priya',
    content: 'Thanks to whoever reported the Metro Pillar 42 pothole via Community Connector! PWD finished the resurfacing yesterday and traffic is moving smoothly now.',
    timestamp: 'Yesterday',
    likes: 46,
    commentsCount: 8
  },
  {
    id: 'post-4',
    communityId: 'yamuna-vihar',
    authorName: 'Sunita Mehra',
    authorId: 'user_sunita',
    content: 'Has anyone else in Block C experienced low water pressure in the top floors today?',
    timestamp: 'Yesterday',
    likes: 9,
    commentsCount: 12
  }
];

export const INITIAL_COMMENTS: Record<string, ReportComment[]> = {
  'CC-10284': [
    {
      id: 'comm-1',
      reportId: 'CC-10284',
      authorName: 'Rahul Sharma',
      authorId: 'user_rahul',
      text: 'This has been piling up since Tuesday. People from the neighboring market are also dumping their plastic cartons here.',
      timestamp: 'Yesterday 10:15 AM'
    },
    {
      id: 'comm-2',
      reportId: 'CC-10284',
      authorName: 'Priya K.',
      authorId: 'user_priya',
      text: 'Same issue near Block B corner. The stray cows are scattering it all over the lane. I supported this report!',
      timestamp: 'Yesterday 12:40 PM'
    },
    {
      id: 'comm-3',
      reportId: 'CC-10284',
      authorName: 'Aman Deep',
      authorId: 'user_aman',
      text: 'I also marked "I\'m Also Affected". Let\'s get 30+ residents to support so it escalates quickly to the commissioner.',
      timestamp: 'Yesterday 3:10 PM'
    },
    {
      id: 'comm-4',
      reportId: 'CC-10284',
      authorName: 'Insp. R.K. Verma',
      authorId: 'mcd_officer_verma',
      text: 'Compactor vehicle is on site. The whole pile will be cleared before evening.',
      timestamp: 'Today 10:05 AM',
      isOfficial: true,
      authorityRole: 'MCD Sanitary Inspector'
    }
  ],
  'CC-10279': [
    {
      id: 'comm-5',
      reportId: 'CC-10279',
      authorName: 'Aman Deep',
      authorId: 'user_aman',
      text: 'Reported this right after my scooter tire was punctured here.',
      timestamp: 'Sep 2, 11:30 AM'
    },
    {
      id: 'comm-6',
      reportId: 'CC-10279',
      authorName: 'Vikram Joshi',
      authorId: 'user_vikram',
      text: 'Incredible work by the community and PWD! The resurfacing was completed in less than 48 hours.',
      timestamp: 'Sep 4, 05:00 PM'
    }
  ],
  'CC-10291': [
    {
      id: 'comm-7',
      reportId: 'CC-10291',
      authorName: 'Kavita Singh',
      authorId: 'user_kavita',
      text: 'Thank you Priya for reporting. That alley is completely dark after 7:30 PM. Everyone in Block C please click Support!',
      timestamp: 'Today 7:00 PM'
    }
  ],
  'CC-10295': [
    {
      id: 'comm-8',
      reportId: 'CC-10295',
      authorName: 'Vikram Joshi',
      authorId: 'user_vikram',
      text: 'Water reached up to the doorstep of house B-42. Glad DJB closed the feeder valve promptly.',
      timestamp: 'Today 9:50 PM'
    }
  ]
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'PROGRESS',
    title: 'Work Started on Waste Issue',
    message: 'MCD Sanitation Team Alpha has started clearing the garbage accumulation near Community Park (CC-10284).',
    timestamp: '2 hours ago',
    read: false,
    reportId: 'CC-10284'
  },
  {
    id: 'notif-2',
    type: 'RESOLUTION',
    title: 'Pothole Fixed & Verified!',
    message: 'PWD Delhi has resolved CC-10279 (Metro Pillar 42 Pothole) and uploaded official resolution proof.',
    timestamp: 'Yesterday',
    read: false,
    reportId: 'CC-10279'
  },
  {
    id: 'notif-3',
    type: 'COMMUNITY',
    title: '12 Residents Supported Your Followed Report',
    message: 'Community members joined the petition for Streetlight Repair behind Central Market.',
    timestamp: '3 hours ago',
    read: true,
    reportId: 'CC-10291'
  },
  {
    id: 'notif-4',
    type: 'AUTHORITY',
    title: 'Emergency Case Assigned',
    message: 'Delhi Jal Board has assigned Repair Crew 1 to the pipeline burst on Lane 12.',
    timestamp: '4 hours ago',
    read: true,
    reportId: 'CC-10295'
  }
];
