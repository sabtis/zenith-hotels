import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { Hotel, TIER_COLORS, TIER_BG } from '../constants';

interface HotelCardProps {
  hotel: Hotel;
  onClick: () => void;
  isDarkMode: boolean;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  onClick,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div
      className="relative w-full h-[420px] rounded-[2rem] overflow-hidden group cursor-pointer card-shadow transition-all duration-500 hover:scale-[1.02] hover:shadow-elevated"
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Top Actions */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${TIER_BG[hotel.tier]} ${TIER_COLORS[hotel.tier]} backdrop-blur-xl`}>
          {hotel.tier}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className="p-3 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:bg-black/50 active:scale-90"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 ${isWishlisted ? 'fill-gold text-gold' : 'text-white/80'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={12} className="text-gold/80" />
          <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest">
            {hotel.location}, {hotel.country}
          </span>
        </div>
        
        <h3 className="text-2xl font-serif italic text-white mb-3 leading-tight">
          {hotel.name}
        </h3>
        
        <p className="text-xs text-white/50 mb-4 line-clamp-2">
          {hotel.description}
        </p>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Desde</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">${hotel.price.toLocaleString()}</span>
              <span className="text-[10px] text-white/40">/noite</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-xl">
            <Star size={14} className="text-gold fill-gold" />
            <span className="text-sm font-bold text-white">{hotel.rating}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mt-4">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white/50 bg-white/5 rounded-full border border-white/5"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-2 py-1 text-[8px] font-bold text-gold/60">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
