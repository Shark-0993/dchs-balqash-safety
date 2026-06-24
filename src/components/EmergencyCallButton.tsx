import React, { useEffect, useState } from 'react';
import { PhoneCall, X, Copy, Check, AlertOctagon } from 'lucide-react';

interface EmergencyCallButtonProps {
  number: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'inline';
  lang: 'kk' | 'ru' | 'en';
  children?: React.ReactNode;
}

// Detect a mobile / phone-capable device.
const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /android|iphone|ipad|ipod|windows phone|mobile/i.test(ua);
};

export const EmergencyCallButton: React.FC<EmergencyCallButtonProps> = ({
  number,
  label,
  className,
  variant = 'primary',
  lang,
  children
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!showFallback) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowFallback(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = 'unset';
    };
  }, [showFallback]);

  const handleClick = (e: React.MouseEvent) => {
    // Always allow tel: protocol on mobile devices.
    if (isMobileDevice()) return;
    // On desktop, show fallback dialog with copy / WhatsApp.
    e.preventDefault();
    setShowFallback(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const t = {
    kk: {
      title: 'Шұғыл қоңырау',
      desc: `Жұмыс үстелі құрылғыларынан қоңырау шалу үшін телефонға номерді теріңіз.`,
      number: 'Нөмір',
      copy: 'Көшіру',
      copied: 'Көшірілді',
      tryCall: 'Қоңырау шалуға тырысу',
      close: 'Жабу',
      hint: 'Мобильді құрылғыларда қоңырау автоматты түрде басталады.'
    },
    ru: {
      title: 'Экстренный вызов',
      desc: 'С настольных устройств наберите этот номер на телефоне.',
      number: 'Номер',
      copy: 'Копировать',
      copied: 'Скопировано',
      tryCall: 'Попробовать набрать',
      close: 'Закрыть',
      hint: 'На мобильных устройствах вызов начнётся автоматически.'
    },
    en: {
      title: 'Emergency Call',
      desc: 'On desktop devices, please dial this number from your phone.',
      number: 'Number',
      copy: 'Copy',
      copied: 'Copied',
      tryCall: 'Try to dial',
      close: 'Close',
      hint: 'On mobile devices the call starts automatically.'
    }
  }[lang];

  return (
    <>
      <a
        href={`tel:${number}`}
        onClick={handleClick}
        aria-label={`Call ${number}`}
        className={className}
      >
        {children ?? (
          <>
            <PhoneCall className="w-4 h-4" />
            <span>{label ?? number}</span>
          </>
        )}
      </a>

      {showFallback && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fade-in">
          <div className={`w-full max-w-md bg-slate-900 border ${variant === 'primary' ? 'border-red-500/30' : 'border-white/15'} rounded-2xl shadow-2xl overflow-hidden`}>
            <div className="h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600"></div>
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/15 border border-red-500/40 rounded-xl">
                    <AlertOctagon className="w-6 h-6 text-red-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">{t.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFallback(false)}
                  className="p-1 text-slate-500 hover:text-white cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-950 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block">
                  {t.number}
                </span>
                <span className="text-5xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mt-2 block">
                  {number}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? t.copied : t.copy}</span>
                </button>
                <a
                  href={`tel:${number}`}
                  className="flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.tryCall}</span>
                </a>
              </div>

              <p className="text-[10px] text-slate-500 text-center font-mono uppercase tracking-widest">
                {t.hint}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
