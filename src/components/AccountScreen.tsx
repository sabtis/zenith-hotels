import React from 'react';
import { Crown, Trophy, Gift, Settings, ChevronRight, Star, Zap, Users, Calendar } from 'lucide-react';

interface AccountStats {
  totalSaved: number;
  tripsCompleted: number;
  zenithPoints: number;
  memberSince: string;
  tier: string;
  honorProgress: number;
  referralsCount: number;
}

interface AccountScreenProps {
  stats: AccountStats;
  onOpenAdmin: () => void;
  onOpenBusiness: () => void;
  currentTheme: string;
  onToggleTheme: () => void;
  swStatus: string;
  isInstallReady: boolean;
  onInstallApp: () => Promise<boolean>;
}

const AccountScreen: React.FC<AccountScreenProps> = ({
  stats,
  onOpenBusiness,
}) => {
  const menuItems = [
    { icon: Trophy, label: 'Conquistas', value: '12 Desbloqueadas', action: () => {} },
    { icon: Gift, label: 'Recompensas', value: '3 Disponíveis', action: () => {} },
    { icon: Users, label: 'Referências', value: `${stats.referralsCount} Convidados`, action: () => {} },
    { icon: Calendar, label: 'Histórico', value: `${stats.tripsCompleted} Viagens`, action: () => {} },
    { icon: Settings, label: 'Configurações', value: '', action: () => {} },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header */}
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif italic text-white mb-1">Minha Conta</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Membro desde {stats.memberSince}</p>
          </div>
          <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20">
            <Crown size={24} className="text-gold" />
          </div>
        </div>

        {/* Tier Card */}
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border border-gold/20 overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-gold fill-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">{stats.tier}</span>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-black text-white mb-1">{stats.zenithPoints.toLocaleString()}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Pontos Zenith</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-white/40">Progresso Honra</span>
                <span className="text-gold font-bold">{stats.honorProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-gold to-gold-glow transition-all duration-1000"
                  style={{ width: `${stats.honorProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <Zap size={16} className="text-emerald mb-2" />
            <p className="text-xl font-black text-white">€{stats.totalSaved.toLocaleString()}</p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest">Total Economizado</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <Trophy size={16} className="text-gold mb-2" />
            <p className="text-xl font-black text-white">{stats.tripsCompleted}</p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest">Viagens Concluídas</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-8">
        <div className="rounded-3xl bg-white/5 border border-white/5 overflow-hidden divide-y divide-white/5">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="w-full p-4 flex items-center justify-between transition-all hover:bg-white/5 active:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-white/5">
                  <item.icon size={18} className="text-white/60" />
                </div>
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-xs text-white/40">{item.value}</span>
                )}
                <ChevronRight size={16} className="text-white/20" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Business CTA */}
      <div className="p-8">
        <button
          onClick={onOpenBusiness}
          className="w-full p-5 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-between transition-all hover:bg-gold/15 active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <Crown size={20} className="text-gold" />
            <div className="text-left">
              <p className="text-sm font-bold text-white">LuxVago Business</p>
              <p className="text-[10px] text-white/40">Torne-se um parceiro</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gold/60" />
        </button>
      </div>
    </div>
  );
};

export default AccountScreen;
