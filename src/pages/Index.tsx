import React, { useState } from 'react';
import { Home, Map, User, ShieldAlert, Crown } from 'lucide-react';
import { MOCK_HOTELS } from '../constants';
import HotelCard from '../components/HotelCard';
import AdminDashboard from '../components/AdminDashboard';
import AccountScreen from '../components/AccountScreen';
import PartnershipScreen from '../components/PartnershipScreen';
import HotelMap from '../components/HotelMap';

const Index = () => {
  const [view, setView] = useState<'home' | 'map' | 'account' | 'business'>('home');
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const APP_VERSION = "v10.0.0 ZENITH-NUCLEAR";

  const forceSync = async () => {
    setIsSyncing(true);
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) await reg.unregister();
    }
    const names = await caches.keys();
    for (const name of names) await caches.delete(name);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSelectHotel = (id: string) => {
    setSelectedHotelId(id);
    setView('map');
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center bg-obsidian font-sans select-none touch-pan-y">
      <div className="w-full max-w-[430px] min-h-screen relative flex flex-col bg-obsidian text-foreground luxury-border shadow-elevated">

        <div className="flex-1 overflow-y-auto hide-scrollbar pb-32">
          {view === 'home' && (
            <div className="fade-in">
              <header className="p-8 md:p-12 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-serif italic text-foreground leading-none tracking-tight">
                      LuxVago <span className="text-gold">Privé</span>
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      <p className="text-[9px] text-gold font-black uppercase tracking-[0.4em] opacity-80">
                        Soberania Hoteleira | {APP_VERSION}
                      </p>
                      <button
                        onClick={forceSync}
                        className={`px-3 py-1 bg-gold/10 luxury-border-gold rounded-full text-[7px] font-black text-gold uppercase tracking-widest transition-all active:scale-90 ${isSyncing ? 'animate-pulse' : ''}`}
                      >
                        {isSyncing ? 'Recalibrando...' : 'Recalibrar Conexão'}
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAdmin(true)} 
                    className="p-3 bg-secondary rounded-2xl text-gold/30 hover:text-gold transition-all"
                  >
                    <ShieldAlert size={20} />
                  </button>
                </div>
              </header>

              <main className="px-0 relative">
                <div className="px-8 md:px-12 mb-8 md:mb-12 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 p-4 bg-secondary luxury-border rounded-3xl">
                      <p className="text-[7px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Rede Global</p>
                      <p className="text-lg font-black text-foreground leading-none tracking-tighter">
                        05 Ativos <span className="text-emerald text-[10px]">+1</span>
                      </p>
                    </div>
                    <div className="flex-1 p-4 bg-secondary luxury-border rounded-3xl">
                      <p className="text-[7px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Volume de Aderência</p>
                      <p className="text-lg font-black text-foreground leading-none tracking-tighter">$14.2M</p>
                    </div>
                  </div>
                </div>

                <div className="flex overflow-x-auto gap-6 md:gap-8 px-8 md:px-12 pb-8 md:pb-12 snap-x snap-mandatory hide-scrollbar">
                  {MOCK_HOTELS.map(h => (
                    <div key={h.id} className="min-w-[300px] md:min-w-[320px] snap-center">
                      <HotelCard
                        hotel={h}
                        onClick={() => handleSelectHotel(h.id)}
                        isDarkMode={true}
                        isWishlisted={wishlist.includes(h.id)}
                        onToggleWishlist={() => toggleWishlist(h.id)}
                      />
                    </div>
                  ))}
                  <div className="min-w-[100px]" />
                </div>

                <div className="px-8 md:px-12 pt-8 border-t border-border">
                  <div className="p-6 md:p-8 bg-gold/5 luxury-border-gold rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                      <Crown size={40} className="text-gold" />
                    </div>
                    <h4 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-4">Gabinete do Arquiteto</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-serif italic">
                      "O protocolo Zenith não é apenas uma reserva; é a sincronização de soberanias em nós de ultra-luxo."
                    </p>
                  </div>
                </div>
              </main>
            </div>
          )}

          {view === 'map' && (
            <div className="h-full w-full zoom-in-95">
              <HotelMap
                hotels={MOCK_HOTELS}
                initialSelectedId={selectedHotelId}
                onSelectHotel={(h) => setSelectedHotelId(h.id)}
                isWishlisted={(id) => wishlist.includes(id)}
                onToggleWishlist={toggleWishlist}
                isDarkMode={true}
              />
            </div>
          )}

          {view === 'account' && (
            <AccountScreen
              stats={{
                totalSaved: 4200,
                tripsCompleted: 8,
                zenithPoints: 12450,
                memberSince: 'Out 2024',
                tier: 'Zenith',
                honorProgress: 92,
                referralsCount: 3
              }}
              onOpenAdmin={() => setShowAdmin(true)}
              onOpenBusiness={() => setView('business')}
              currentTheme="dark"
              onToggleTheme={() => {}}
              swStatus="active"
              isInstallReady={false}
              onInstallApp={async () => true}
            />
          )}

          {view === 'business' && (
            <PartnershipScreen isDarkMode={true} />
          )}
        </div>

        {/* HQ Dashboard */}
        {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

        {/* Navigation Bar */}
        <nav className="shrink-0 h-20 md:h-24 glass-nav px-8 md:px-12 flex justify-between items-center z-[1000] fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]">
          <button 
            onClick={() => setView('home')} 
            className={`p-4 transition-all duration-300 ${view === 'home' ? 'text-gold scale-125' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Home size={22} />
          </button>
          <button 
            onClick={() => setView('map')} 
            className={`p-4 transition-all duration-300 ${view === 'map' ? 'text-gold scale-125' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Map size={22} />
          </button>
          <button 
            onClick={() => setView('account')} 
            className={`p-4 transition-all duration-300 ${['account', 'business'].includes(view) ? 'text-gold scale-125' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <User size={22} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Index;
