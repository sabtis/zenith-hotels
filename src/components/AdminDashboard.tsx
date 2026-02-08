import React from 'react';
import { X, TrendingUp, Users, Building2, DollarSign, Activity, Shield } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const metrics = [
    { label: 'Receita Mensal', value: '€2.4M', change: '+12.5%', icon: DollarSign, positive: true },
    { label: 'Ocupação Média', value: '94.2%', change: '+3.1%', icon: Building2, positive: true },
    { label: 'Membros Zenith', value: '1,247', change: '+89', icon: Users, positive: true },
    { label: 'NPS Score', value: '92', change: '+4', icon: TrendingUp, positive: true },
  ];

  const recentActivity = [
    { action: 'Nova reserva Zenith', hotel: 'Palácio Atlântico', time: '2min', value: '€14,400' },
    { action: 'Check-in VIP', hotel: 'Maison Royale', time: '15min', value: '—' },
    { action: 'Upgrade solicitado', hotel: 'The Obsidian Tokyo', time: '32min', value: '€2,100' },
    { action: 'Concierge request', hotel: 'Villa Côte d\'Azur', time: '1h', value: '—' },
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-[430px] max-h-[85vh] bg-onyx rounded-t-[2.5rem] overflow-hidden slide-up">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-onyx/95 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
                <Shield size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">HQ Dashboard</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Acesso Restrito</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-white/5 border border-white/10 transition-all hover:bg-white/10 active:scale-90"
            >
              <X size={18} className="text-white/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto hide-scrollbar" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/8"
              >
                <div className="flex items-center justify-between mb-3">
                  <metric.icon size={18} className="text-gold/60" />
                  <span className={`text-[10px] font-bold ${metric.positive ? 'text-emerald' : 'text-destructive'}`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-xl font-black text-white mb-1">{metric.value}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-widest">{metric.label}</p>
              </div>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-gold" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Atividade Recente</h3>
            </div>
            <div className="space-y-2">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-white mb-1">{activity.action}</p>
                    <p className="text-[10px] text-white/40">{activity.hotel} · {activity.time}</p>
                  </div>
                  {activity.value !== '—' && (
                    <span className="text-sm font-bold text-gold">{activity.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="p-4 rounded-2xl bg-emerald/5 border border-emerald/20">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <div>
                <p className="text-sm font-medium text-white">Sistema Operacional</p>
                <p className="text-[10px] text-white/40">Todos os serviços ativos · Latência: 12ms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
