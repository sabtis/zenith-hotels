import hotelLisbon from '@/assets/hotel-lisbon-palace.jpg';
import hotelNice from '@/assets/hotel-nice-villa.jpg';
import hotelTokyo from '@/assets/hotel-tokyo-obsidian.jpg';
import hotelParis from '@/assets/hotel-paris-maison.jpg';
import hotelSantorini from '@/assets/hotel-santorini-ethereal.jpg';
import { Hotel, PlaybookGuideline, SovereigntyAudit, SentimentScores } from './types';

export type { Hotel, PlaybookGuideline, SovereigntyAudit, SentimentScores };

// CONTROLE DE VERSÃO SOBERANO - v11.0.0-NUCLEUS
export const APP_VERSION = "11.0.0-NUCLEUS";

export const SOVEREIGN_PLAYBOOK: PlaybookGuideline[] = [
  { id: "P1", pilar: "Blindagem de Dados", directive: "A identidade do aderente é um ativo criptografado.", action: "Nenhum dado sensível é armazenado em nuvens públicas.", icon: "Shield" },
  { id: "P2", pilar: "Antevisão Estratégica", directive: "Prever a necessidade antes do desejo se manifestar.", action: "IA Concierge analisa padrões para ajustar o ambiente.", icon: "Zap" },
  { id: "P3", pilar: "Independência de Rede", directive: "Operação autônoma em nós redundantes.", action: "Sistemas críticos operam em nós descentralizados.", icon: "Globe" },
  { id: "P4", pilar: "Adesão Qualificada", directive: "O acesso é condicionado por integração técnica.", action: "Limite estrito de 30 Zenith Associates por cluster.", icon: "Gem" },
  { id: "P5", pilar: "Proteção da Rede", directive: "A confiança é a condição resolutiva do vínculo.", action: "Dissolution Protocol aciona isolamento neural imediato.", icon: "EyeOff" }
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Palácio Atlântico',
    location: 'Lisboa',
    country: 'Portugal',
    price: 2400,
    marketPrice: 3200,
    rating: 9.8,
    reviewsCount: 847,
    image: hotelLisbon,
    galleryImages: [hotelLisbon],
    description: 'Onde o barroco encontra a vanguarda. Vista panorâmica do Tejo, piscina de borda infinita suspensa e serviço de mordomo 24h.',
    amenities: ['Spa Privativo', 'Heliponto', 'Chef Michelin', 'Marina', 'Wine Cellar'],
    coordinates: { lat: 38.7223, lng: -9.1393 },
    tier: 'Zenith',
    availableRooms: 3,
    isZenithAward: true,
    zenithTier: 3,
    sovereigntyAudit: {
      autonomyStatus: 'verified',
      securityScore: 98.5,
      auditDate: '2024-09-15',
      certificateId: 'ZX-LIS-4421',
      shieldStatus: 'active',
      foresightRating: 96
    },
    sentimentScores: { privacy: 97, service: 96, exclusivity: 98, gastronomy: 94 },
    distanceFromCenter: 1.2,
    provider: 'Zenith Europe'
  },
  {
    id: '2',
    name: 'Villa Côte d\'Azur',
    location: 'Nice',
    country: 'França',
    price: 3200,
    marketPrice: 4500,
    rating: 9.9,
    reviewsCount: 623,
    image: hotelNice,
    galleryImages: [hotelNice],
    description: 'Elegância mediterrânea absoluta. Praia privativa de águas cristalinas, iate exclusivo e acesso direto ao mar turquesa.',
    amenities: ['Praia Privativa', 'Iate 80ft', 'Adega Francesa', 'Butler 24h', 'Helipad'],
    coordinates: { lat: 43.7102, lng: 7.2620 },
    tier: 'Zenith',
    availableRooms: 2,
    isZenithAward: true,
    zenithTier: 3,
    sovereigntyAudit: {
      autonomyStatus: 'verified',
      securityScore: 99.2,
      auditDate: '2024-10-01',
      certificateId: 'ZX-NCE-7832',
      shieldStatus: 'active',
      foresightRating: 97
    },
    sentimentScores: { privacy: 99, service: 98, exclusivity: 100, gastronomy: 97 },
    distanceFromCenter: 0.8,
    provider: 'Iconic Registry'
  },
  {
    id: '3',
    name: 'The Obsidian Tokyo',
    location: 'Tóquio',
    country: 'Japão',
    price: 2800,
    marketPrice: 3800,
    rating: 9.7,
    reviewsCount: 412,
    image: hotelTokyo,
    galleryImages: [hotelTokyo],
    description: 'Minimalismo japonês em altitude vertiginosa. Jardim zen suspenso, onsen privativo e vista 360° da metrópole iluminada.',
    amenities: ['Onsen Privativo', 'Jardim Zen', 'Omakase 3★', 'Tatami Suite', 'Sky Lounge'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tier: 'Elite',
    availableRooms: 4,
    isZenithAward: true,
    zenithTier: 2,
    sovereigntyAudit: {
      autonomyStatus: 'critical',
      securityScore: 100,
      auditDate: '2024-11-01',
      certificateId: 'ZX-TKO-001',
      shieldStatus: 'active',
      foresightRating: 99
    },
    sentimentScores: { privacy: 100, service: 98, exclusivity: 95, gastronomy: 99 },
    distanceFromCenter: 0.0,
    provider: 'Zenith Asia'
  },
  {
    id: '4',
    name: 'Maison Royale',
    location: 'Paris',
    country: 'França',
    price: 4500,
    marketPrice: 6200,
    rating: 10.0,
    reviewsCount: 1891,
    image: hotelParis,
    galleryImages: [hotelParis],
    description: 'O epítome do luxo parisiense. Palácio Belle Époque com vista direta para a Torre Eiffel e jardins à francesa impecáveis.',
    amenities: ['Vista Eiffel', 'Sommelier Privé', 'Galeria de Arte', 'Limusine Maybach', 'Spa Dior'],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tier: 'Zenith',
    availableRooms: 1,
    isZenithAward: true,
    zenithTier: 3,
    sovereigntyAudit: {
      autonomyStatus: 'verified',
      securityScore: 99.9,
      auditDate: '2024-11-10',
      certificateId: 'ZX-PAR-0001',
      shieldStatus: 'active',
      foresightRating: 100
    },
    sentimentScores: { privacy: 99, service: 100, exclusivity: 100, gastronomy: 100 },
    distanceFromCenter: 0.3,
    provider: 'Zenith Europe'
  },
  {
    id: '5',
    name: 'Santorini Ethereal',
    location: 'Oia',
    country: 'Grécia',
    price: 2100,
    marketPrice: 2900,
    rating: 9.6,
    reviewsCount: 756,
    image: hotelSantorini,
    galleryImages: [hotelSantorini],
    description: 'Suspenso entre céu e mar Egeu. Suítes esculpidas na rocha vulcânica com infinity pool privativa e pôr do sol lendário.',
    amenities: ['Infinity Pool', 'Cave Suite', 'Sunset Deck', 'Catamarã', 'Spa Volcanic'],
    coordinates: { lat: 36.4618, lng: 25.3753 },
    tier: 'Elite',
    availableRooms: 5,
    isZenithAward: true,
    zenithTier: 2,
    sovereigntyAudit: {
      autonomyStatus: 'verified',
      securityScore: 97.8,
      auditDate: '2024-08-20',
      certificateId: 'ZX-OIA-5567',
      shieldStatus: 'active',
      foresightRating: 94
    },
    sentimentScores: { privacy: 96, service: 94, exclusivity: 97, gastronomy: 92 },
    distanceFromCenter: 2.1,
    provider: 'Iconic Registry'
  },
];

export const TIER_COLORS = {
  Zenith: 'text-gold',
  Elite: 'text-platinum',
  Premier: 'text-emerald',
  prive: 'text-gold',
};

export const TIER_BG = {
  Zenith: 'bg-gold/10 border-gold/20',
  Elite: 'bg-white/5 border-white/10',
  Premier: 'bg-emerald/10 border-emerald/20',
  prive: 'bg-gold/10 border-gold/20',
};
