import React, { useState, useRef, useEffect } from 'react';
import { PhoneCall, Shield, AlertTriangle, ChevronDown, Check, Globe } from 'lucide-react';
import { translations } from '../data/db';
import { EmergencyCallButton } from './EmergencyCallButton';

interface HeaderProps {
  lang: 'kk' | 'ru' | 'en';
  setLang: (lang: 'kk' | 'ru' | 'en') => void;
  openSafetyRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, openSafetyRules }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'kk', label: 'Қазақша (KK)' },
    { code: 'ru', label: 'Русский (RU)' },
    { code: 'en', label: 'English (EN)' }
  ];

  const currentLanguageLabel = languages.find(l => l.code === lang)?.label || 'Русский (RU)';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/75 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-0 bg-sky-500/30 rounded-lg blur group-hover:blur-md transition-all"></div>
            <div className="relative p-2.5 bg-gradient-to-br from-slate-900 to-sky-950 border border-sky-500/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-sky-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase block">
              LAKE BALKHASH
            </span>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-none">
              {t.title}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Rules Button */}
          <button 
            onClick={openSafetyRules}
            className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span>
              {lang === 'kk' && 'Қауіпсіздік ережелері'}
              {lang === 'ru' && 'Правила безопасности'}
              {lang === 'en' && 'Safety Regulations'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 hover:bg-slate-800 border border-white/15 rounded-xl text-sm font-semibold text-slate-200 transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">{currentLanguageLabel}</span>
              <span className="sm:hidden uppercase">{lang}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-185' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="py-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code as 'kk' | 'ru' | 'en');
                        setDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <Check className="w-4 h-4 text-sky-400 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Call Button 112 with glowing radar */}
          <EmergencyCallButton
            number="112"
            lang={lang}
            className="relative flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(239,68,68,0.3)] active:scale-95 transition-all group cursor-pointer"
          >
            {/* Outer radar pulse circles */}
            <span className="absolute -inset-1 rounded-xl bg-red-600/30 animate-ping pointer-events-none opacity-75"></span>
            <span className="absolute -inset-2 rounded-xl bg-red-600/10 animate-pulse pointer-events-none opacity-50"></span>

            <PhoneCall className="w-4 h-4 animate-bounce group-hover:scale-110 transition-transform" />
            <span className="font-extrabold text-base">112</span>
            <span className="hidden lg:inline text-xs font-bold bg-black/20 px-2 py-0.5 rounded uppercase tracking-wider">
              {lang === 'kk' && 'Шұғыл'}
              {lang === 'ru' && 'SOS'}
              {lang === 'en' && 'SOS'}
            </span>
          </EmergencyCallButton>

        </div>
      </div>
    </header>
  );
};
