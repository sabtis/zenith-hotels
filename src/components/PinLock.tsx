import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface PinLockProps {
  onUnlock: () => void;
  onCancel: () => void;
}

const PinLock: React.FC<PinLockProps> = ({ onUnlock, onCancel }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const CORRECT_PIN = '123456';

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      onUnlock();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 1000);
    }
  };

  const handleKeyPress = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) {
        setTimeout(() => {
          if (newPin === CORRECT_PIN) {
            onUnlock();
          } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 1000);
          }
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8">
      <button onClick={onCancel} className="absolute top-6 right-6 p-2 text-zinc-500">
        <X size={24} />
      </button>
      
      <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20 mb-6">
        <Lock size={32} className="text-gold" />
      </div>
      
      <h2 className="text-xl font-bold text-white mb-2">Acesso Restrito</h2>
      <p className="text-xs text-zinc-500 mb-8">Digite o PIN de segurança</p>

      <div className="flex gap-3 mb-8">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all ${
              pin.length > i
                ? error ? 'bg-red-500' : 'bg-gold'
                : 'bg-white/10'
            } ${error ? 'animate-pulse' : ''}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((digit) => (
          <button
            key={digit}
            onClick={() => digit === '⌫' ? handleDelete() : digit && handleKeyPress(digit)}
            disabled={!digit}
            className={`w-20 h-16 rounded-2xl text-2xl font-bold transition-all ${
              digit
                ? 'bg-white/5 text-white active:bg-gold active:text-background'
                : 'invisible'
            }`}
          >
            {digit}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PinLock;
