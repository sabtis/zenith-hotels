export interface SovereigntyAudit {
  autonomyStatus: 'verified' | 'critical' | 'pending';
  securityScore: number;
  auditDate: string;
  certificateId: string;
  shieldStatus: 'active' | 'inactive';
  foresightRating: number;
}

export interface SentimentScores {
  privacy: number;
  service: number;
  exclusivity: number;
  gastronomy: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  marketPrice?: number;
  rating: number;
  reviewsCount?: number;
  image: string;
  galleryImages?: string[];
  description: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  tier: 'Zenith' | 'Elite' | 'Premier' | 'prive';
  availableRooms: number;
  isZenithAward?: boolean;
  zenithTier?: number;
  sovereigntyAudit?: SovereigntyAudit;
  sentimentScores?: SentimentScores;
  distanceFromCenter?: number;
  provider?: string;
}

export interface PlaybookGuideline {
  id: string;
  pilar: string;
  directive: string;
  action: string;
  icon: string;
}
