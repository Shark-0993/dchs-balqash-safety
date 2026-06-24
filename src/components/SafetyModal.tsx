import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertOctagon, Heart, Waves, Compass, Check } from 'lucide-react';
import { translations } from '../data/db';

interface SafetyModalProps {
  lang: 'kk' | 'ru' | 'en';
  setLang: (l: 'kk' | 'ru' | 'en') => void;
  onAccept: () => void;
  isOpen: boolean;
}

export const SafetyModal: React.FC<SafetyModalProps> = ({ lang, setLang, onAccept, isOpen }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [animateShake, setAnimateShake] = useState(false);
  const t = translations[lang];

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAgree = () => {
    if (!isChecked) {
      setAnimateShake(true);
      setTimeout(() => setAnimateShake(false), 500);
      return;
    }
    onAccept();
  };

  // Icons corresponding to each rule
  const ruleIcons = [
    <Waves className="w-5 h-5 text-sky-400 shrink-0" />,
    <Heart className="w-5 h-5 text-emerald-400 shrink-0" />,
    <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />,
    <Compass className="w-5 h-5 text-amber-500 shrink-0" />,
    <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl transition-all duration-500">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,107,0,0.15)] overflow-hidden transition-all duration-300 ${
          animateShake ? 'animate-bounce' : ''
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.1)'
        }}
      >
        {/* Safety Stripe Top */}
        <div className="h-2 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600"></div>

        {/* Inner Content */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Language switch (always available) */}
          <div className="flex justify-center gap-2 text-[11px] font-bold">
            {(['kk','ru','en'] as const).map(code => (
              <button
                key={code}
                onClick={() => { setLang(code); localStorage.setItem('balkhash_pref_lang', code); }}
                className={`px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  lang === code ? 'bg-sky-500/15 text-sky-300 border-sky-500/30' : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {code === 'kk' ? 'Қазақша' : code === 'ru' ? 'Русский' : 'English'}
              </button>
            ))}
          </div>
          
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative w-16 h-16 bg-slate-800/80 border border-orange-500/50 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-9 h-9 text-orange-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug text-balance">
              {t.rulesTitle}
            </h2>
            <p className="text-sm text-slate-400 max-w-lg">
              {lang === 'kk' && 'Балқаш көлінде демалудың қауіпсіздігі үшін төмендегі міндетті ережелерді орындаңыз.'}
              {lang === 'ru' && 'Для обеспечения безопасности пребывания на озере Балхаш, обязательно ознакомьтесь и следуйте правилам ниже.'}
              {lang === 'en' && 'To ensure safety and protect lives at Lake Balkhash, you must review and agree to the following rules.'}
            </p>
          </div>

          {/* Rules List */}
          <div className="space-y-3 bg-slate-900/50 border border-white/5 rounded-xl p-4 md:p-5 max-h-[300px] overflow-y-auto">
            {t.rules.map((rule, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="p-1.5 bg-slate-900 border border-white/10 rounded-md">
                  {ruleIcons[idx] || <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />}
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider block mb-0.5">
                    {lang === 'kk' && `ЕРЕЖЕ ${idx + 1}`}
                    {lang === 'ru' && `ПРАВИЛО ${idx + 1}`}
                    {lang === 'en' && `RULE ${idx + 1}`}
                  </span>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">
                    {rule}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox and Agreement */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="sr-only"
              />
              <div className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                isChecked 
                  ? 'bg-orange-500 border-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.4)]' 
                  : 'bg-slate-950 border-slate-700 group-hover:border-slate-500'
              }`}>
                {isChecked && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </div>
              <span className="text-xs md:text-sm text-slate-300 select-none group-hover:text-white transition-colors">
                {t.rulesCheckRequired}
              </span>
            </label>

            {/* Accept Button */}
            <button
              onClick={handleAgree}
              className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 select-none ${
                isChecked
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-[0.98] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              <ShieldCheck className="w-5 h-5 animate-pulse" />
              <span>{t.agreeBtn}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono uppercase tracking-widest">
          <span>VER: 2026.1.4_PWA</span>
          <span>Balkhash Emergency Dept</span>
        </div>
      </div>
    </div>
  );
};
