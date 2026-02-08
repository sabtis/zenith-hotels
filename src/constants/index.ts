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
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    description: 'Refúgio de ultra-luxo com vista para o Tejo',
    amenities: ['Spa Privativo', 'Heliponto', 'Chef Michelin', 'Marina'],
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
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    description: 'Elegância mediterrânea absoluta',
    amenities: ['Praia Privativa', 'Iate', 'Adega', 'Butler 24h'],
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
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    description: 'Minimalismo japonês em altitude',
    amenities: ['Onsen Privativo', 'Jardim Zen', 'Omakase', 'Tatami Suite'],
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
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    description: 'O epítome do luxo parisiense',
    amenities: ['Suíte Eiffel', 'Sommelier', 'Galeria Privada', 'Limusine'],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    tier: 'Zenith',
    availableRooms: 1,
  },
  {
    id: '5',
    name: 'Santorini Ethereal',
    location: 'Santorini',
    country: 'Grécia',
    price: 2100,
    rating: 9.6,
    image: 'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&q=80',
    description: 'Suspenso entre o céu e o mar Egeu',
    amenities: ['Infinity Pool', 'Cave Suite', 'Sunset Deck', 'Catamaran'],
    coordinates: { lat: 36.3932, lng: 25.4615 },
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
