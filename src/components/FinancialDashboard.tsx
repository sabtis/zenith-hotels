import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, Coins, RefreshCcw, Bitcoin } from 'lucide-react';

interface FinancialDashboardProps {
  onClose: () => void;
}

// Get tier values from localStorage (set via AdminDashboard)
const getTierValues = () => [
  { name: 'Tier I', value: Number(localStorage.getItem('zenith_tier1_price')) || 300, color: 'text-zinc-400', bg: 'bg-zinc-500/10' },
  { name: 'Tier II', value: Number(localStorage.getItem('zenith_tier2_price')) || 650, color: 'text-gold', bg: 'bg-gold/10' },
  { name: 'Tier III', value: Number(localStorage.getItem('zenith_tier3_price')) || 950, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'BRL', 'CNY', 'BTC'];

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ onClose }) => {
  const [tiers, setTiers] = useState(getTierValues);
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({
    USD: 1.08, EUR: 1, GBP: 0.86, JPY: 162.5, CHF: 0.94,
    AUD: 1.65, CAD: 1.47, BRL: 5.42, CNY: 7.82, BTC: 0.000016
  });
  const [loading, setLoading] = useState(false);
  
  // Refresh tiers when component mounts or localStorage changes
  useEffect(() => {
    setTiers(getTierValues());
  }, []);

  const convert = (value: number, from: string, to: string): number => {
    const inEUR = from === 'EUR' ? value : value / rates[from];
    return to === 'EUR' ? inEUR : inEUR * rates[to];
  };

  const result = convert(parseFloat(amount) || 0, fromCurrency, toCurrency);

  const refreshRates = () => {
    setLoading(true);
    // Simulação de atualização de taxas
    setTimeout(() => {
      setRates(prev => ({
        ...prev,
        USD: prev.USD * (0.99 + Math.random() * 0.02),
        BTC: prev.BTC * (0.98 + Math.random() * 0.04),
      }));
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-[430px] max-h-[85vh] bg-[#0a0a0a] rounded-t-[2.5rem] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gold/10 border border-gold/20">
                <DollarSign size={20} className="text-gold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Centro Financeiro</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Tiers & Conversão</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 rounded-full bg-white/5 active:scale-90">
              <X size={18} className="text-white/60" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto hide-scrollbar" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {/* Tiers Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <TrendingUp size={14} className="text-gold" />
              Níveis de Parceria
            </h3>
            <div className="space-y-3">
              {tiers.map((tier) => (
                <div key={tier.name} className={`p-4 rounded-2xl ${tier.bg} border border-white/5`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-bold ${tier.color}`}>{tier.name}</span>
                    <span className="text-xl font-black text-white">${tier.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currency Converter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Coins size={14} className="text-gold" />
                Conversor de Moedas
              </h3>
              <button 
                onClick={refreshRates}
                className="p-2 rounded-lg bg-white/5 active:scale-90"
              >
                <RefreshCcw size={14} className={`text-gold ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">Valor</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-lg font-bold outline-none focus:border-gold/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">De</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold/50"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c} value={c} className="bg-black">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-widest mb-2 block">Para</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-gold/50"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c} value={c} className="bg-black">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gold/10 border border-gold/20">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Resultado</p>
                <p className="text-2xl font-black text-gold flex items-center gap-2">
                  {toCurrency === 'BTC' && <Bitcoin size={20} />}
                  {toCurrency === 'BTC' 
                    ? result.toFixed(8) 
                    : result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }
                  <span className="text-sm font-bold text-white/60">{toCurrency}</span>
                </p>
              </div>
            </div>
          </div>

          {/* BTC Rate Display */}
          <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center gap-3">
              <Bitcoin size={24} className="text-orange-500" />
              <div>
                <p className="text-sm font-bold text-white">1 EUR = {rates.BTC.toFixed(8)} BTC</p>
                <p className="text-[10px] text-white/40">Taxa simulada • Atualizar para dados reais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
