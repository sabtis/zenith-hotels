import React, { useState, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { Search, RefreshCcw, Home, Map as MapIcon, User, Fingerprint, Loader2, Signal, Zap, Activity, Sparkles } from 'lucide-react';
import { MOCK_HOTELS, APP_VERSION } from '../constants';
import HotelCard from '../components/HotelCard';
import { processSovereignSearch } from '../services/aiService';
import { Hotel } from '../constants/types';

const AccountScreen = lazy(() => import('../components/AccountScreen'));
const HotelMap = lazy(() => import('../components/HotelMap'));

type ViewState = 'home' | 'map' | 'account';

const Index = () => {
  // Core navigation state
  const [view, setView] = useState<ViewState>('home');
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  // Search & AI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [marketInsight, setMarketInsight] = useState<string | null>(null);

  // System state
  const [isBooting, setIsBooting] = useState(true);
  const [isRecalibrating, setIsRecalibrating] = useState(false);

  // User state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('luxvago-wishlist') || '[]');
    } catch {
      return [];
    }
  });

  // Boot sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Persist wishlist
  useEffect(() => {
    localStorage.setItem('luxvago-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Protocolo de Recalibração Manual (Mobile Hard Reset)
  const forceSync = useCallback(async () => {
    setIsRecalibrating(true);
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      window.location.reload();
    }
  }, []);

  // AI-powered search
  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await processSovereignSearch(searchQuery, MOCK_HOTELS);
      setRecommendedIds(res.recommendedIds || []);
      setAiBriefing(res.strategicBriefing);
      setMarketInsight(res.marketInsight);
    } catch (error) {
      console.error('Sovereign Search error:', error);
      setAiBriefing('Protocolo de Contingência Zenith: Operando em modo de fundação.');
      setRecommendedIds([]);
    }
    setIsSearching(false);
  }, [searchQuery]);

  // Clear search results
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setRecommendedIds([]);
    setAiBriefing(null);
    setMarketInsight(null);
  }, []);

  // Hotel selection with navigation
  const handleHotelSelect = useCallback((hotel: Hotel) => {
    setSelectedHotelId(hotel.id);
    setView('map');
  }, []);

  // Wishlist toggle
  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  // Computed displayed hotels
  const displayedHotels = useMemo(() =>
    recommendedIds.length
      ? MOCK_HOTELS.filter(h => recommendedIds.includes(h.id))
      : MOCK_HOTELS
    , [recommendedIds]);

  // Boot screen
  if (isBooting) {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold w-6 h-6" />
        </div>
        <div className="text-center space-y-2">
          <div className="text-gold font-black text-[10px] uppercase tracking-[0.5em] animate-pulse">
            Zenith OS
          </div>
          <div className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.3em]">
            v{APP_VERSION}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[100dvh] bg-background flex justify-center">
      <div className="w-full max-w-[430px] h-[100dvh] flex flex-col bg-[#050505] relative overflow-hidden shadow-2xl border-x border-white/5">

        {/* Header - Sticky with glassmorphism */}
        <header className="p-6 pb-4 border-b border-white/5 sticky top-0 z-50 bg-black/80 backdrop-blur-xl safe-area-inset-top">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-black text-background shadow-[0_15px_40px_-10px_rgba(212,175,55,0.4)]">
                LV
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">
                  LuxVago Privé
                </p>
                <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                  v{APP_VERSION}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={forceSync}
                className="p-2.5 bg-white/5 rounded-full text-zinc-500 active:scale-90 transition-all hover:bg-white/10"
                aria-label="Recalibrar sistema"
              >
                <RefreshCcw size={16} className={isRecalibrating ? 'animate-spin text-gold' : ''} />
              </button>
              <button
                onClick={() => setView('account')}
                className="p-2.5 bg-white/5 rounded-full text-zinc-500 active:scale-90 hover:bg-white/10"
                aria-label="Conta"
              >
                <Fingerprint size={16} />
              </button>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative group">
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Instruir Oráculo Zenith..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-14 text-sm text-white outline-none focus:border-gold/50 transition-all placeholder:text-zinc-700"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gold text-background rounded-xl shadow-lg active:scale-90 transition-all disabled:opacity-50"
            >
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} strokeWidth={3} />}
            </button>
          </form>

          {/* Search active indicator */}
          {recommendedIds.length > 0 && (
            <button
              onClick={clearSearch}
              className="mt-3 text-[9px] text-gold/70 font-bold uppercase tracking-widest hover:text-gold transition-colors"
            >
              ✕ Limpar filtro ({recommendedIds.length} resultados)
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto hide-scrollbar pb-32 overscroll-contain">
          {view === 'home' && (
            <div className="p-6 space-y-10 animate-in fade-in duration-500">

              {/* AI Briefing Card */}
              {aiBriefing && (
                <div className="bg-gold/5 border border-gold/20 p-6 rounded-3xl animate-in fade-in slide-up duration-700">
                  <p className="text-[13px] italic serif text-gold leading-relaxed">
                    "{aiBriefing}"
                  </p>
                  {marketInsight && (
                    <p className="text-[10px] text-zinc-500 mt-3 pt-3 border-t border-gold/10">
                      {marketInsight}
                    </p>
                  )}
                </div>
              )}

              {/* Hotel Registry */}
              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    Registry Soberano
                  </h2>
                  <span className="text-[8px] text-zinc-600 font-bold uppercase">
                    {displayedHotels.length} Ativos
                  </span>
                </div>

                {/* Horizontal Hotel Cards */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scrollbar -mx-2 px-2 cursor-grab active:cursor-grabbing">
                  {displayedHotels.map(hotel => (
                    <div key={hotel.id} className="min-w-[85vw] max-w-[320px] snap-center">
                      <HotelCard
                        hotel={hotel}
                        isWishlisted={wishlist.includes(hotel.id)}
                        onToggleWishlist={() => toggleWishlist(hotel.id)}
                        onClick={() => handleHotelSelect(hotel)}
                        isDarkMode={true}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-1 transition-all hover:bg-white/10">
                  <Signal size={14} className="text-emerald-500 mb-1" />
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Network</span>
                  <span className="text-[10px] font-bold text-white uppercase">Secure</span>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-1 transition-all hover:bg-white/10">
                  <Zap size={14} className="text-gold mb-1" />
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Oracle</span>
                  <span className="text-[10px] font-bold text-white uppercase">Sovereign</span>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-1 transition-all hover:bg-white/10">
                  <Activity size={14} className="text-purple-500 mb-1" />
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-bold text-white uppercase">v{APP_VERSION.split('-')[0]}</span>
                </div>
              </div>

              {/* Wishlist Preview (if any) */}
              {wishlist.length > 0 && (
                <div className="p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                  <p className="text-[9px] font-black text-gold uppercase tracking-widest">
                    {wishlist.length} {wishlist.length === 1 ? 'Ativo Reservado' : 'Ativos Reservados'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lazy-loaded Views */}
          <Suspense
            fallback={
              <div className="p-20 text-center text-gold text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                Sincronizando Módulo...
              </div>
            }
          >
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
                onOpenAdmin={() => { }}
                onOpenBusiness={() => { }}
                currentTheme="dark"
                onToggleTheme={() => { }}
                swStatus="active"
                isInstallReady={false}
                onInstallApp={async () => true}
              />
            )}
            {view === 'map' && (
              <HotelMap
                hotels={MOCK_HOTELS}
                initialSelectedId={selectedHotelId}
                onSelectHotel={(hotel) => setSelectedHotelId(hotel.id)}
                isWishlisted={(id) => wishlist.includes(id)}
                onToggleWishlist={toggleWishlist}
                isDarkMode={true}
              />
            )}
          </Suspense>
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 border-t border-white/5 bg-black/90 backdrop-blur-3xl fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex justify-around items-center px-10 z-[100] shadow-2xl safe-area-inset-bottom">
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-gold scale-110' : 'text-zinc-600'}`}
          >
            <Home size={22} />
            <span className="text-[7px] font-black uppercase">Home</span>
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex flex-col items-center gap-1 transition-all ${view === 'map' ? 'text-gold scale-110' : 'text-zinc-600'}`}
          >
            <MapIcon size={22} />
            <span className="text-[7px] font-black uppercase">Mapa</span>
          </button>
          <button
            onClick={() => setView('account')}
            className={`flex flex-col items-center gap-1 transition-all ${view === 'account' ? 'text-gold scale-110' : 'text-zinc-600'}`}
          >
            <User size={22} />
            <span className="text-[7px] font-black uppercase">Conta</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Index;
