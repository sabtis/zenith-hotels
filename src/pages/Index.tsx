import React, { useState, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { Search, RefreshCcw, Home, Map as MapIcon, User, Fingerprint, Loader2, Signal, Zap, Activity, DollarSign } from 'lucide-react';
import { MOCK_HOTELS, APP_VERSION } from '../constants';
import HotelCard from '../components/HotelCard';
import { streamSovereignSearch } from '../services/aiService';

const AccountScreen = lazy(() => import('../components/AccountScreen'));
const HotelMap = lazy(() => import('../components/HotelMap'));
const PinLock = lazy(() => import('../components/PinLock'));
const FinancialDashboard = lazy(() => import('../components/FinancialDashboard'));
const Index = () => {
  const [view, setView] = useState<'home' | 'detail' | 'map' | 'account'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [isRecalibrating, setIsRecalibrating] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [showPinLock, setShowPinLock] = useState(false);
  const [isAccountUnlocked, setIsAccountUnlocked] = useState(false);
  const [showFinancial, setShowFinancial] = useState(false);
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Protocolo de Recalibração Manual (Mobile Hard Reset)
  const forceSync = async () => {
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
  };

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setAiBriefing("");

    await streamSovereignSearch(
      searchQuery,
      MOCK_HOTELS,
      (delta) => setAiBriefing((prev) => (prev || "") + delta),
      (ids) => {
        setRecommendedIds(ids);
        setIsSearching(false);
      }
    );
  }, [searchQuery]);

  const displayedHotels = useMemo(() =>
    recommendedIds.length ? MOCK_HOTELS.filter(h => recommendedIds.includes(h.id)) : MOCK_HOTELS
    , [recommendedIds]);

  if (isBooting) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center space-y-6">
      <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      <div className="text-gold font-black text-[10px] uppercase tracking-[0.6em] animate-pulse">Zenith OS v{APP_VERSION}</div>
    </div>
  );

  return (
    <div className="w-full min-h-[100dvh] bg-background flex justify-center">
      <div className="w-full max-w-[430px] h-[100dvh] flex flex-col bg-[#050505] relative overflow-hidden shadow-2xl">

        <header className="p-6 pb-4 border-b border-white/5 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center font-black text-background shadow-gold-glow">LV</div>
              <div>
                <p className="text-[10px] font-black uppercase text-white tracking-widest leading-none">LuxVago Privé</p>
                <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest mt-1">v{APP_VERSION}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={forceSync} className="p-2.5 bg-white/5 rounded-full text-zinc-500 active:scale-90 transition-all">
                <RefreshCcw size={16} className={isRecalibrating ? 'animate-spin text-gold' : ''} />
              </button>
              <button onClick={() => setView('account')} className="p-2.5 bg-white/5 rounded-full text-zinc-500 active:scale-90">
                <Fingerprint size={16} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Instruir Oráculo Zenith..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white outline-none focus:border-gold/50 transition-all placeholder:text-zinc-700"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gold text-background rounded-xl shadow-lg active:scale-90 transition-all">
              {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} strokeWidth={3} />}
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-y-auto hide-scrollbar pb-32 overscroll-contain">
          {view === 'home' && (
            <div className="p-6 space-y-10">
              {aiBriefing && (
                <div className="bg-gold/5 border border-gold/20 p-8 rounded-3xl animate-in fade-in duration-700">
                  <p className="text-[14px] italic serif text-gold leading-relaxed">"{aiBriefing}"</p>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex justify-between items-end px-2">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Registry Soberano</h2>
                  <span className="text-[8px] text-zinc-600 font-bold uppercase">{displayedHotels.length} Ativos</span>
                </div>

                <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scrollbar -mx-2 px-2 cursor-grab active:cursor-grabbing">
                  {displayedHotels.map(h => (
                    <div key={h.id} className="min-w-[85vw] snap-center">
                      <HotelCard hotel={h} isWishlisted={false} onToggleWishlist={() => { }} onClick={() => { }} isDarkMode={true} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
                  <Signal size={14} className="text-emerald-500 mb-1" />
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Network</span>
                  <span className="text-[10px] font-bold text-white uppercase">Secure</span>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
                  <Zap size={14} className="text-gold mb-1" />
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Oracle</span>
                  <span className="text-[10px] font-bold text-white uppercase">Sovereign</span>
                </div>
                <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-1">
                  <Activity size={14} className="text-purple-500 mb-1" />
                  <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest">Status</span>
                  <span className="text-[10px] font-bold text-white uppercase">v{APP_VERSION.split('-')[0]}</span>
                </div>
              </div>
            </div>
          )}

          <Suspense fallback={<div className="p-20 text-center text-gold text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Módulo...</div>}>
            {view === 'account' && (
              <AccountScreen 
                stats={{} as any} 
                onOpenAdmin={() => { }} 
                onOpenBusiness={() => setShowFinancial(true)} 
                currentTheme="dark" 
                onToggleTheme={() => { }} 
                swStatus="active" 
                isInstallReady={false} 
                onInstallApp={async () => true}
                onLogout={() => { setIsAccountUnlocked(false); setView('home'); }}
              />
            )}
            {view === 'map' && <HotelMap hotels={MOCK_HOTELS} initialSelectedId={null} onSelectHotel={() => { }} isWishlisted={() => false} onToggleWishlist={() => { }} isDarkMode={true} />}
          </Suspense>

          {/* PIN Lock for Account */}
          <Suspense fallback={null}>
          {showPinLock && (
              <PinLock 
                onUnlock={() => { setShowPinLock(false); setIsAccountUnlocked(true); setView('account'); }} 
                onCancel={() => { setShowPinLock(false); setView('home'); }} 
              />
            )}
            {showFinancial && <FinancialDashboard onClose={() => { setShowFinancial(false); setView('home'); }} />}
          </Suspense>
        </main>

        <nav className="h-20 border-t border-white/5 bg-black/90 backdrop-blur-3xl fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto flex justify-around items-center px-10 pb-2 z-[100] shadow-2xl">
          <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-gold scale-110' : 'text-zinc-600'}`}>
            <Home size={22} />
            <span className="text-[7px] font-black uppercase">Home</span>
          </button>
          <button onClick={() => setView('map')} className={`flex flex-col items-center gap-1 transition-all ${view === 'map' ? 'text-gold scale-110' : 'text-zinc-600'}`}>
            <MapIcon size={22} />
            <span className="text-[7px] font-black uppercase">Mapa</span>
          </button>
          {isAccountUnlocked && (
            <button onClick={() => setShowFinancial(true)} className={`flex flex-col items-center gap-1 transition-all text-zinc-600`}>
              <DollarSign size={22} />
              <span className="text-[7px] font-black uppercase">Finanças</span>
            </button>
          )}
          <button onClick={() => isAccountUnlocked ? setView('account') : setShowPinLock(true)} className={`flex flex-col items-center gap-1 transition-all ${view === 'account' ? 'text-gold scale-110' : 'text-zinc-600'}`}>
            <User size={22} />
            <span className="text-[7px] font-black uppercase">Conta</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Index;
