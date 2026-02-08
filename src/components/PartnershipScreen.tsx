import React from 'react';
import { Building2, TrendingUp, Globe, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

interface PartnershipScreenProps {
  isDarkMode: boolean;
}

const PartnershipScreen: React.FC<PartnershipScreenProps> = () => {
  const benefits = [
    { icon: Globe, title: 'Alcance Global', desc: 'Acesso a viajantes de alto padrão em todo o mundo' },
    { icon: TrendingUp, title: 'Revenue Premium', desc: 'Tarifas optimizadas com margem superior à média' },
    { icon: Shield, title: 'Proteção Total', desc: 'Garantias e seguros para todas as reservas' },
  ];

  const features = [
    'Dashboard analítico em tempo real',
    'Gestão de inventário dinâmico',
    'Suporte dedicado 24/7',
    'Integração com seu PMS',
    'Marketing co-branding',
    'Programa de fidelização cruzado',
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero */}
      <div className="relative p-8 pb-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-gold" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Programa de Parceria</span>
          </div>
          <h1 className="text-3xl font-serif italic text-white mb-4 leading-tight">
            Junte-se à Elite<br />
            <span className="text-gold">Hoteleira Global</span>
          </h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs">
            Conectamos propriedades excepcionais com viajantes que buscam experiências incomparáveis.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-8 mb-8">
        <div className="space-y-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 shrink-0">
                <benefit.icon size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{benefit.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features List */}
      <div className="px-8 mb-8">
        <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.2em] mb-4">Incluso na Parceria</h3>
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckCircle2 size={14} className="text-emerald shrink-0" />
                <span className="text-sm text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-8 pb-8">
        <button className="w-full p-5 rounded-2xl bg-gold text-obsidian font-bold flex items-center justify-center gap-3 transition-all hover:bg-gold-glow active:scale-[0.98] shadow-gold">
          <span>Solicitar Adesão</span>
          <ArrowRight size={18} />
        </button>
        <p className="text-center text-[10px] text-white/30 mt-4">
          Análise em até 48 horas · Sem compromisso
        </p>
      </div>
    </div>
  );
};

export default PartnershipScreen;
