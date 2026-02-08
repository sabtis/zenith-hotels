import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Star, ChevronRight, Navigation, RefreshCw, Compass } from 'lucide-react';
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
  const [mapCenter, setMapCenter] = useState<{ lat: string; lng: string }>({ lat: '--', lng: '--' });

  const updateMapCenter = (map: L.Map) => {
    const center = map.getCenter();
    setMapCenter({
      lat: center.lat.toFixed(2),
      lng: center.lng.toFixed(2),
    });
  };

  const handleRefreshArea = () => {
    if (mapInstanceRef.current) {
      const bounds = mapInstanceRef.current.getBounds();
      const visibleHotels = hotels.filter(h => 
        bounds.contains([h.coordinates.lat, h.coordinates.lng])
      );
      console.log('Hotéis visíveis:', visibleHotels.length);
    }
  };

  const handleResetView = () => {
    if (mapInstanceRef.current && hotels.length > 0) {
      const bounds = L.latLngBounds(
        hotels.map(h => [h.coordinates.lat, h.coordinates.lng])
      );
      mapInstanceRef.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
  };

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

    // Tiles de satélite ESRI para visual rico
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
    }).addTo(map);

    // Adiciona labels por cima do satélite
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      pane: 'overlayPane',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Atualiza coordenadas no movimento
    map.on('moveend', () => updateMapCenter(map));
    updateMapCenter(map);

    // Adiciona marcadores para cada hotel
    hotels.forEach((hotel) => {
      const priceK = hotel.price >= 1000 
        ? `$${(hotel.price / 1000).toFixed(hotel.price >= 10000 ? 0 : 1)}k`
        : `$${hotel.price}`;
      
      const markerIcon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
          <div class="zenith-marker">
            <span class="zenith-marker-price">${priceK}</span>
          </div>
        `,
        iconSize: [70, 36],
        iconAnchor: [35, 18],
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
      {/* Sovereign Feed Header */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Sovereign Feed</span>
            <span className="text-[7px] text-white/40 font-mono">LAT: {mapCenter.lat} / LNG: {mapCenter.lng}</span>
          </div>
        </div>

        {/* Atualizar Área Button */}
        <button 
          onClick={handleRefreshArea}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 backdrop-blur-xl border border-gold/30 text-gold text-[10px] font-black uppercase tracking-wider transition-all hover:bg-gold/10 active:scale-95"
        >
          <RefreshCw size={12} />
          <span>Atualizar Área</span>
        </button>
      </div>

      {/* Compass Button */}
      <button 
        onClick={handleResetView}
        className="absolute top-20 right-4 z-[1000] p-3 rounded-full bg-black/70 backdrop-blur-xl border border-white/10 text-white/60 transition-all hover:text-gold hover:border-gold/30 active:scale-95"
      >
        <Compass size={20} />
      </button>

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
