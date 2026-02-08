import React, { useState } from 'react';
import { MapPin, X, Star, ChevronRight, Navigation } from 'lucide-react';
import { Hotel, TIER_COLORS, TIER_BG } from '../constants';

interface HotelMapProps {
  hotels: Hotel[];
  initialSelectedId: string | null;
  onSelectHotel: (hotel: Hotel) => void;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
  isDarkMode: boolean;
}

const HotelMap: React.FC<HotelMapProps> = ({
  hotels,
  initialSelectedId,
  onSelectHotel,
}) => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(
    hotels.find(h => h.id === initialSelectedId) || null
  );

  const handleMarkerClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    onSelectHotel(hotel);
  };

  // Simulated map positions based on coordinates
  const getPosition = (hotel: Hotel) => {
    // Normalize coordinates to percentage positions
    const minLat = 35;
    const maxLat = 50;
    const minLng = -10;
    const maxLng = 145;
    
    const x = ((hotel.coordinates.lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = ((maxLat - hotel.coordinates.lat) / (maxLat - minLat)) * 60 + 20;
    
    return { x: `${x}%`, y: `${y}%` };
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-obsidian">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-obsidian via-obsidian/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
            <Navigation size={18} className="text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mapa Global</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">{hotels.length} Propriedades Ativas</p>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(var(--onyx))_0%,_hsl(var(--obsidian))_100%)]">
        {/* Grid lines for visual effect */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute w-full h-px bg-white/20"
              style={{ top: `${(i + 1) * 10}%` }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute h-full w-px bg-white/20"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>

        {/* Hotel Markers */}
        {hotels.map((hotel) => {
          const pos = getPosition(hotel);
          const isSelected = selectedHotel?.id === hotel.id;
          
          return (
            <button
              key={hotel.id}
              onClick={() => handleMarkerClick(hotel)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'
              }`}
              style={{ left: pos.x, top: pos.y }}
            >
              <div className={`relative ${isSelected ? 'animate-pulse-gold' : ''}`}>
                {/* Pulse ring */}
                {isSelected && (
                  <div className="absolute inset-0 w-12 h-12 -m-3 rounded-full bg-gold/20 animate-ping" />
                )}
                
                {/* Marker */}
                <div className={`p-3 rounded-full transition-all ${
                  isSelected 
                    ? 'bg-gold text-obsidian shadow-gold' 
                    : 'bg-white/10 text-white/60 border border-white/10 hover:bg-white/20'
                }`}>
                  <MapPin size={isSelected ? 20 : 16} />
                </div>
                
                {/* Label */}
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap transition-all ${
                  isSelected ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-1 rounded-full">
                    {hotel.name}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hotel Card */}
      {selectedHotel && (
        <div className="absolute bottom-24 left-4 right-4 z-20 slide-up">
          <div className="relative rounded-3xl overflow-hidden glass-card">
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 backdrop-blur-xl"
            >
              <X size={16} className="text-white/60" />
            </button>
            
            <div className="flex">
              {/* Image */}
              <div className="w-32 h-32 shrink-0">
                <img
                  src={selectedHotel.image}
                  alt={selectedHotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                <div className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider mb-2 ${TIER_BG[selectedHotel.tier]} ${TIER_COLORS[selectedHotel.tier]}`}>
                  {selectedHotel.tier}
                </div>
                
                <h3 className="text-base font-serif italic text-white mb-1 leading-tight">
                  {selectedHotel.name}
                </h3>
                
                <p className="text-[10px] text-white/40 mb-3">
                  {selectedHotel.location}, {selectedHotel.country}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-gold fill-gold" />
                    <span className="text-sm font-bold text-white">{selectedHotel.rating}</span>
                  </div>
                  
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-gold/20 active:scale-95">
                    <span>Reservar</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelMap;
