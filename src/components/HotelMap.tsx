import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Star, ChevronRight, Navigation } from 'lucide-react';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(
    hotels.find(h => h.id === initialSelectedId) || null
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inicializa o mapa com centro na Europa
    const map = L.map(mapRef.current, {
      center: [42, 15],
      zoom: 3,
      zoomControl: false,
      attributionControl: false,
      minZoom: 2,
      maxZoom: 18,
    });

    // Tiles escuros com estilo Zenith
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Adiciona controle de zoom no canto superior direito
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    // Adiciona marcadores para cada hotel
    hotels.forEach((hotel) => {
      const priceLabel = `$${(hotel.price / 1000).toFixed(1)}k`;
      
      const markerIcon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div class="custom-marker-node zenith-pulse">
            ${priceLabel}
          </div>
        `,
        iconSize: [80, 40],
        iconAnchor: [40, 20],
      });

      const marker = L.marker([hotel.coordinates.lat, hotel.coordinates.lng], {
        icon: markerIcon,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedHotel(hotel);
        onSelectHotel(hotel);
        map.flyTo([hotel.coordinates.lat, hotel.coordinates.lng], 8, {
          duration: 1.5,
        });
      });

      markersRef.current.push(marker);
    });

    // Ajusta o mapa para mostrar todos os marcadores
    if (hotels.length > 0) {
      const bounds = L.latLngBounds(
        hotels.map(h => [h.coordinates.lat, h.coordinates.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, [hotels, onSelectHotel]);

  // Centraliza no hotel inicial se fornecido
  useEffect(() => {
    if (initialSelectedId && mapInstanceRef.current) {
      const hotel = hotels.find(h => h.id === initialSelectedId);
      if (hotel) {
        setSelectedHotel(hotel);
        mapInstanceRef.current.flyTo(
          [hotel.coordinates.lat, hotel.coordinates.lng],
          8,
          { duration: 1.5 }
        );
      }
    }
  }, [initialSelectedId, hotels]);

  return (
    <div className="relative w-full h-full min-h-screen bg-background">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-6 bg-gradient-to-b from-background via-background/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
            <Navigation size={18} className="text-gold" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Mapa Global</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {hotels.length} Propriedades Ativas
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Selected Hotel Card */}
      {selectedHotel && (
        <div className="absolute bottom-24 left-4 right-4 z-[1000] slide-up">
          <div className="relative rounded-3xl overflow-hidden glass-card">
            <button
              onClick={() => setSelectedHotel(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 backdrop-blur-xl"
            >
              <X size={16} className="text-foreground/60" />
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
                <div
                  className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider mb-2 ${TIER_BG[selectedHotel.tier]} ${TIER_COLORS[selectedHotel.tier]}`}
                >
                  {selectedHotel.tier}
                </div>

                <h3 className="text-base font-serif italic text-foreground mb-1 leading-tight">
                  {selectedHotel.name}
                </h3>

                <p className="text-[10px] text-muted-foreground mb-3">
                  {selectedHotel.location}, {selectedHotel.country}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-gold fill-gold" />
                    <span className="text-sm font-bold text-foreground">
                      {selectedHotel.rating}
                    </span>
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
