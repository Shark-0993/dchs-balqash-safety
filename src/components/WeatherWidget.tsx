import React, { useEffect, useState, useCallback } from 'react';
import { Wind, Waves, Thermometer, RefreshCw, MapPin, Droplets } from 'lucide-react';
import { translations } from '../data/db';
import {
  fetchWeather,
  WEATHER_PROFILES,
  WeatherSnapshot,
  weatherCodeLabels,
} from '../services/weather';

interface WeatherWidgetProps {
  lang: 'kk' | 'ru' | 'en';
  regionKey: 'balkhash' | 'torangalyk' | 'chubar_tyubek' | 'priozersk';
  onFlagChange: (flag: 'green' | 'yellow' | 'red') => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ lang, regionKey, onFlagChange }) => {
  const t = translations[lang];
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const loadWeather = useCallback(async () => {
    const profile = WEATHER_PROFILES[regionKey];
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(profile.lat, profile.lng);
      setSnapshot(data);
      setRefreshedAt(new Date());
      onFlagChange(data.flag);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Weather unavailable');
    } finally {
      setLoading(false);
    }
  }, [regionKey, onFlagChange]);

  useEffect(() => {
    loadWeather();
    const id = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(id);
  }, [loadWeather]);

  const flag = snapshot?.flag ?? 'green';
  const codeMeta = snapshot?.weatherCode != null ? weatherCodeLabels[snapshot.weatherCode] : undefined;
  const regionLabel = t.navRegions[regionKey];

  const fmt = (v: number | null, unit: string) => (v != null ? `${v}${unit}` : '—');

  const flagMeta = {
    green: {
      dot: 'bg-emerald-500',
      badge: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30',
      bar: 'bg-emerald-500/12 border-emerald-500/25',
      label: lang==='kk' ? 'Жасыл – шомылу рұқсат' : lang==='ru' ? 'Зелёный – купание разрешено' : 'Green – safe',
    },
    yellow: {
      dot: 'bg-amber-400',
      badge: 'bg-amber-500/12 text-amber-300 border-amber-500/30',
      bar: 'bg-amber-950/30 border-amber-500/30',
      label: lang==='kk' ? 'Сары – сақ болыңыз' : lang==='ru' ? 'Жёлтый – осторожно' : 'Yellow – caution',
    },
    red: {
      dot: 'bg-red-500',
      badge: 'bg-red-500/12 text-red-300 border-red-500/35',
      bar: 'bg-red-950/30 border-red-500/35',
      label: lang==='kk' ? 'Қызыл – тыйым салынады' : lang==='ru' ? 'Красный – запрещено' : 'Red – prohibited',
    },
  }[flag];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 shadow-lg">
      {/* Compact header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Thermometer className="w-4 h-4 text-sky-400" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] sm:text-xs font-bold text-white truncate">
              {t.weatherTitle}
              {codeMeta && <span className="ml-1.5">{codeMeta.emoji}</span>}
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{regionLabel}</span>
              {refreshedAt && (
                <>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="font-mono hidden sm:inline">{refreshedAt.toLocaleTimeString(lang==='en'?'en-US':lang==='kk'?'kk-KZ':'ru-RU',{hour:'2-digit',minute:'2-digit'})}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${flagMeta.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${flagMeta.dot} ${flag==='red' ? 'animate-pulse' : ''}`}></span>
            {flag === 'green' ? 'GREEN' : flag === 'yellow' ? 'YELLOW' : 'RED'}
          </span>
          <button
            onClick={loadWeather}
            disabled={loading}
            title={lang==='kk' ? 'Жаңарту' : lang==='ru' ? 'Обновить' : 'Refresh'}
            className="p-1.5 rounded-lg bg-slate-950 border border-white/10 hover:border-sky-500/30 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Refresh weather"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics row - compact */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 py-2.5 px-2.5 bg-slate-950/40 rounded-xl border border-white/5">
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">{lang==='kk' ? 'Ауа' : lang==='ru' ? 'Воздух' : 'Air'}</div>
          <div className="text-sm sm:text-base font-black text-white mt-0.5">{fmt(snapshot?.temperatureAir ?? null, '°')}</div>
        </div>
        <div className="text-center border-l border-white/5">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono flex items-center justify-center gap-1"><Droplets className="w-3 h-3 text-sky-400 hidden sm:inline"/>{lang==='kk' ? 'Су' : lang==='ru' ? 'Вода' : 'Water'}</div>
          <div className="text-sm sm:text-base font-black text-sky-300 mt-0.5">{fmt(snapshot?.temperatureWater ?? null, '°')}</div>
        </div>
        <div className="text-center border-l border-white/5">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono flex items-center justify-center gap-1"><Wind className="w-3 h-3 text-slate-400 hidden sm:inline"/>{lang==='kk' ? 'Жел' : lang==='ru' ? 'Ветер' : 'Wind'}</div>
          <div className="text-sm sm:text-base font-black text-white mt-0.5">{fmt(snapshot?.windSpeed ?? null, '')}<span className="text-[10px] font-semibold text-slate-400"> m/s</span></div>
        </div>
        <div className="text-center border-l border-white/5">
          <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono flex items-center justify-center gap-1"><Waves className="w-3 h-3 text-slate-400 hidden sm:inline"/>{lang==='kk' ? 'Толқын' : lang==='ru' ? 'Волна' : 'Wave'}</div>
          <div className="text-sm sm:text-base font-black text-white mt-0.5">{fmt(snapshot?.waveHeight ?? null, '')}<span className="text-[10px] font-semibold text-slate-400"> m</span></div>
        </div>
      </div>

      {/* Compact flag bar */}
      <div className={`mt-2.5 px-3 py-2 rounded-lg border text-[11px] sm:text-xs font-semibold flex items-center justify-between gap-3 flex-wrap ${flagMeta.bar}`}>
        <span className="text-slate-200">{flagMeta.label}</span>
        <span className="text-[10px] text-slate-400">
          {snapshot?.windGusts ? `${lang==='kk'?'Екпін':'Порыв'} ${snapshot.windGusts} m/s • ` : ''}
          {codeMeta ? codeMeta[lang] : (lang==='kk' ? 'Open-Meteo' : lang==='ru' ? 'Open-Meteo' : 'Open-Meteo')}
        </span>
      </div>

      {error && (
        <div className="mt-2 text-[10px] text-amber-300 px-2">
          {error}
        </div>
      )}
    </div>
  );
};
