import hotelLisbon from '@/assets/hotel-lisbon-palace.jpg';
import hotelNice from '@/assets/hotel-nice-villa.jpg';
import hotelTokyo from '@/assets/hotel-tokyo-obsidian.jpg';
import hotelParis from '@/assets/hotel-paris-maison.jpg';
import hotelSantorini from '@/assets/hotel-santorini-ethereal.jpg';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  country: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  tier: 'Zenith' | 'Elite' | 'Premier';
  availableRooms: number;
}

export const MOCK_HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Palácio Atlântico',
    location: 'Lisboa',
    country: 'Portugal',
    price: 2400,
    rating: 9.8,
    image: hotelLisbon,
    description: 'Onde o barroco encontra a vanguarda. Vista panorâmica do Tejo, piscina de borda infinita suspensa e serviço de mordomo 24h.',
    amenities: ['Spa Privativo', 'Heliponto', 'Chef Michelin', 'Marina', 'Wine Cellar'],
    coordinates: { lat: 38.7223, lng: -9.1393 },
    tier: 'Zenith',
    availableRooms: 3,
  },
  {
    id: '2',
    name: 'Villa Côte d\'Azur',
    location: 'Nice',
    country: 'França',
    price: 3200,
    rating: 9.9,
    image: hotelNice,
    description: 'Elegância mediterrânea absoluta. Praia privativa de águas cristalinas, iate exclusivo e acesso direto ao mar turquesa.',
    amenities: ['Praia Privativa', 'Iate 80ft', 'Adega Francesa', 'Butler 24h', 'Helipad'],
    coordinates: { lat: 43.7102, lng: 7.2620 },
    tier: 'Zenith',
    availableRooms: 2,
  },
  {
    id: '3',
    name: 'The Obsidian Tokyo',
    location: 'Tóquio',
    country: 'Japão',
    price: 2800,
    rating: 9.7,
    image: hotelTokyo,
    description: 'Minimalismo japonês em altitude vertiginosa. Jardim zen suspenso, onsen privativo e vista 360° da metrópole iluminada.',
    amenities: ['Onsen Privativo', 'Jardim Zen', 'Omakase 3★', 'Tatami Suite', 'Sky Lounge'],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    tier: 'Elite',
    availableRooms: 4,
  },
  {
    id: '4',
    name: 'Maison Royale',
    location: 'Paris',
    country: 'França',
    price: 4500,
    rating: 10.0,
    image: hotelParis,
    description: 'O epítome do luxo parisiense. Palácio Belle Époque com vista direta para a Torre Eiffel e jardins à francesa impecáveis.',
    amenities: ['Vista Eiffel', 'Sommelier Privé', 'Galeria de Arte', 'Limusine Maybach', 'Spa Dior'],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tier: 'Zenith',
    availableRooms: 1,
  },
  {
    id: '5',
    name: 'Santorini Ethereal',
    location: 'Oia',
    country: 'Grécia',
    price: 2100,
    rating: 9.6,
    image: hotelSantorini,
    description: 'Suspenso entre céu e mar Egeu. Suítes esculpidas na rocha vulcânica com infinity pool privativa e pôr do sol lendário.',
    amenities: ['Infinity Pool', 'Cave Suite', 'Sunset Deck', 'Catamarã', 'Spa Volcanic'],
    coordinates: { lat: 36.4618, lng: 25.3753 },
    tier: 'Elite',
    availableRooms: 5,
  },
];

export const TIER_COLORS = {
  Zenith: 'text-gold',
  Elite: 'text-platinum',
  Premier: 'text-emerald',
};

export const TIER_BG = {
  Zenith: 'bg-gold/10 border-gold/20',
  Elite: 'bg-white/5 border-white/10',
  Premier: 'bg-emerald/10 border-emerald/20',
};
