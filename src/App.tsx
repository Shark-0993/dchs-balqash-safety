import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Search, 
  AlertTriangle, 
  PhoneCall, 
  Navigation, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  AlertOctagon,
  Waves,
  Database,
  RefreshCw,
  CloudOff
} from 'lucide-react';

import { BALKHASH_PORTAL_DB, RegionKey, ResortItem, translations } from './data/db';
import { fetchGoogleSheetItems } from './services/googleSheet';
import { Header } from './components/Header';
import { SafetyModal } from './components/SafetyModal';
import { WeatherWidget } from './components/WeatherWidget';
import { LeafletMap } from './components/LeafletMap';
import { EmergencyCallButton } from './components/EmergencyCallButton';
import { SafetyQuiz } from './components/SafetyQuiz';
import { ReportForm } from './components/ReportForm';
import { FirstAidGuide } from './components/FirstAidGuide';

type DataStatus = 'loading' | 'online' | 'cached' | 'fallback' | 'error';

const GOOGLE_SHEET_CACHE_KEY = 'balkhash_google_sheet_cache';

const STATIC_ITEMS = BALKHASH_PORTAL_DB.map(item => ({
  ...item,
  source: item.source ?? 'static'
})) satisfies ResortItem[];

const STATIC_PROHIBITED_ZONES = STATIC_ITEMS.filter(item => item.category === 'prohibited_zone');

const loadStoredReports = (): ResortItem[] => {
  try {
    return JSON.parse(localStorage.getItem('balkhash_user_reports') || '[]') as ResortItem[];
  } catch {
    return [];
  }
};

const loadCachedSheetItems = (): { items: ResortItem[]; fetchedAt: string } | null => {
  try {
    const cached = localStorage.getItem(GOOGLE_SHEET_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

export default function App() {
  const [lang, setLang] = useState<'kk' | 'ru' | 'en'>('ru');
  const [showModal, setShowModal] = useState<boolean>(true);
  const [regionFilter, setRegionFilter] = useState<RegionKey>('balkhash');
  const [categoryFilter, setCategoryFilter] = useState<'permitted' | 'prohibited' | 'rescue' | 'resorts'>('resorts');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [weatherCondition, setWeatherCondition] = useState<'calm' | 'windy' | 'storm'>('calm');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus>('loading');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  // Dynamic database uses Google Sheets as primary source and static hazards as fallback support.
  const [database, setDatabase] = useState<ResortItem[]>(STATIC_ITEMS);

  const t = translations[lang];
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const refreshSheetData = async () => {
    setDataStatus('loading');

    try {
      const sheetItems = await fetchGoogleSheetItems();
      const fetchedAt = new Date().toISOString();

      localStorage.setItem(
        GOOGLE_SHEET_CACHE_KEY,
        JSON.stringify({ items: sheetItems, fetchedAt })
      );

      setDatabase([...sheetItems, ...STATIC_PROHIBITED_ZONES, ...loadStoredReports()]);
      setLastUpdated(fetchedAt);
      setDataStatus('online');
    } catch (error) {
      const cached = loadCachedSheetItems();

      if (cached?.items?.length) {
        setDatabase([...cached.items, ...STATIC_PROHIBITED_ZONES, ...loadStoredReports()]);
        setLastUpdated(cached.fetchedAt);
        setDataStatus('cached');
        return;
      }

      setDatabase([...STATIC_ITEMS, ...loadStoredReports()]);
      setDataStatus('fallback');
    }
  };

  // Load language preference and agreement state on mount
  useEffect(() => {
    // Check if user has already agreed to the terms
    const agreed = localStorage.getItem('balkhash_safety_agreed');
    if (agreed === 'true') {
      setShowModal(false);
    }

    // Check language preference
    const savedLang = localStorage.getItem('balkhash_pref_lang');
    if (savedLang === 'kk' || savedLang === 'ru' || savedLang === 'en') {
      setLang(savedLang);
    }

    setDatabase([...STATIC_ITEMS, ...loadStoredReports()]);
    refreshSheetData();
  }, []);

  // Update language preference in localStorage
  const handleLanguageChange = (newLang: 'kk' | 'ru' | 'en') => {
    setLang(newLang);
    localStorage.setItem('balkhash_pref_lang', newLang);
  };

  // Handle safety modal agreement accept
  const handleAcceptAgreement = () => {
    localStorage.setItem('balkhash_safety_agreed', 'true');
    setShowModal(false);
  };

  // Re-open safety rules modal
  const openSafetyRules = () => {
    setShowModal(true);
  };

  // Weather flag handler — receives real Open-Meteo derived flag and maps it to local UI severity.
  const handleWeatherFlag = useCallback((flag: 'green' | 'yellow' | 'red') => {
    const next = flag === 'green' ? 'calm' : flag === 'yellow' ? 'windy' : 'storm';
    setWeatherCondition(next);
  }, []);

  // Callback when user submits a new hazard report
  const handleNewReportSubmitted = (newReport: ResortItem) => {
    setDatabase(prev => [newReport, ...prev]);
  };

  // Scroll to card when selected via map marker
  const handleSelectMapItem = (id: string | null) => {
    setSelectedItemId(id);
    if (id) {
      setTimeout(() => {
        const cardElement = cardRefs.current[id];
        if (cardElement) {
          cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Filter items based on current filters and search query
  const filteredItems = useMemo(() => {
    return database.filter(item => {
      // 1. Filter by Region
      if (item.region !== regionFilter) return false;

      // 2. Filter by Category
      if (categoryFilter === 'permitted') {
        const isSheetPermittedBeach = item.category === 'permitted_beach' && item.status === 'ready';
        const isStaticFallbackBeach = item.source === 'static' && item.category === 'resort' && item.status === 'ready';
        if (!isSheetPermittedBeach && !isStaticFallbackBeach) return false;
      } else if (categoryFilter === 'prohibited') {
        // Not ready status or marked danger or category prohibited
        const isNotReady = item.status === 'not_ready';
        const isDanger = item.status === 'danger';
        const isProhibitedCat = item.category === 'prohibited_zone';
        if (!isNotReady && !isDanger && !isProhibitedCat) return false;
      } else if (categoryFilter === 'rescue') {
        if (item.category !== 'rescue_post') return false;
      } else if (categoryFilter === 'resorts') {
        if (item.category !== 'resort') return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = 
          item.nameRu.toLowerCase().includes(query) ||
          item.nameKk.toLowerCase().includes(query) ||
          item.nameEn.toLowerCase().includes(query);
        
        const defMatch = 
          (item.deficienciesRu && item.deficienciesRu.toLowerCase().includes(query)) ||
          (item.deficienciesKk && item.deficienciesKk.toLowerCase().includes(query)) ||
          (item.deficienciesEn && item.deficienciesEn.toLowerCase().includes(query));

        const infoMatch = 
          (item.infoRu && item.infoRu.toLowerCase().includes(query)) ||
          (item.infoKk && item.infoKk.toLowerCase().includes(query)) ||
          (item.infoEn && item.infoEn.toLowerCase().includes(query));

        return nameMatch || defMatch || infoMatch;
      }

      return true;
    });
  }, [database, regionFilter, categoryFilter, searchQuery]);

  // Statistics calculation for current region
  const stats = useMemo(() => {
    const regionItems = database.filter(item => item.region === regionFilter);
    const permitted = regionItems.filter(item => item.status === 'ready' && item.category !== 'rescue_post').length;
    const deficient = regionItems.filter(item => item.status === 'not_ready' || item.status === 'danger' || item.category === 'prohibited_zone').length;
    const rescue = regionItems.filter(item => item.category === 'rescue_post').length;

    return {
      total: regionItems.length,
      permitted,
      deficient,
      rescue
    };
  }, [database, regionFilter]);

  const regionTabs = useMemo(() => ([
    { key: 'balkhash' as const, label: t.navRegions.balkhash },
    { key: 'torangalyk' as const, label: t.navRegions.torangalyk },
    { key: 'chubar_tyubek' as const, label: t.navRegions.chubar_tyubek },
    { key: 'priozersk' as const, label: t.navRegions.priozersk }
  ]), [t.navRegions]);

  const dataStatusMeta = useMemo(() => {
    if (dataStatus === 'online') {
      return {
        icon: <Database className="w-4 h-4 text-emerald-400" />,
        label: lang === 'kk' ? 'Деректер жаңартылды' : lang === 'ru' ? 'Данные актуальны' : 'Live data online',
        className: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
      };
    }

    if (dataStatus === 'loading') {
      return {
        icon: <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />,
        label: lang === 'kk' ? 'Жаңартылуда' : lang === 'ru' ? 'Синхронизация' : 'Syncing data',
        className: 'bg-sky-500/10 text-sky-300 border-sky-500/20'
      };
    }

    if (dataStatus === 'cached') {
      return {
        icon: <Database className="w-4 h-4 text-amber-400" />,
        label: lang === 'kk' ? 'Кэштен көрсетілуде' : lang === 'ru' ? 'Показаны кэш-данные' : 'Cached data',
        className: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
      };
    }

    return {
      icon: <CloudOff className="w-4 h-4 text-orange-400" />,
      label: lang === 'kk' ? 'Офлайн режим' : lang === 'ru' ? 'Офлайн-база' : 'Offline mode',
      className: 'bg-orange-500/10 text-orange-300 border-orange-500/20'
    };
  }, [dataStatus, lang]);

  const lastUpdatedLabel = lastUpdated
    ? new Date(lastUpdated).toLocaleString(lang === 'en' ? 'en-US' : lang === 'kk' ? 'kk-KZ' : 'ru-RU')
    : (lang === 'kk' ? 'Әлі жаңартылмады' : lang === 'ru' ? 'Еще не обновлялось' : 'Not updated yet');

  return (
    <div lang={lang} className="min-h-screen bg-[#071120] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-gradient-to-b from-orange-600/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Mandatory Onboarding & Safety Rules Modal */}
      <SafetyModal 
        lang={lang}
        setLang={handleLanguageChange}
        isOpen={showModal} 
        onAccept={handleAcceptAgreement} 
      />

      {/* Sticky Header with SOS Call Button */}
      <Header 
        lang={lang} 
        setLang={handleLanguageChange} 
        openSafetyRules={openSafetyRules} 
      />

      {/* Weather Hazard Banner */}
      {weatherCondition === 'storm' && (
        <div className="bg-red-950/80 border-b border-red-500/30 backdrop-blur-md px-4 py-3 text-center animate-pulse z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-red-400 text-xs sm:text-sm font-extrabold uppercase tracking-wide">
            <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />
            <span>
              {lang === 'kk' 
                ? 'ҚАТТЫ ДАУЫЛ ЕСКЕРТУІ: КӨЛДЕ ТОЛҚЫНДАР МЕН ҚАТТЫ ЖЕЛ. СУҒА ТҮСУГЕ МҮЛДЕМ ТЫЙЫМ САЛЫНАДЫ!' 
                : lang === 'ru' 
                ? 'ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ: ВЫСОКИЕ ВОЛНЫ И ОПАСНЫЙ ВЕТЕР. КУПАНИЕ КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО!' 
                : 'SEVERE STORM ALERT: HIGH WAVES AND DANGEROUS WINDS. SWIMMING IS STRICTLY PROHIBITED!'}
            </span>
          </div>
        </div>
      )}

      {weatherCondition === 'windy' && (
        <div className="bg-amber-950/80 border-b border-amber-500/30 backdrop-blur-md px-4 py-3 text-center z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-amber-400 text-xs sm:text-sm font-extrabold uppercase tracking-wide">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              {lang === 'kk' 
                ? 'НАЗАР АУДАРЫҢЫЗ: КҮШТІ ЖЕЛ. БАЛАЛАРҒА ҮРЛЕМЕЛІ МАТРАСТАРДЫ ҚОЛДАНУҒА БОЛМАЙДЫ!' 
                : lang === 'ru' 
                ? 'ВНИМАНИЕ: СИЛЬНЫЙ ОТЖИМНОЙ ВЕТЕР. ЗАПРЕЩЕНО ИСПОЛЬЗОВАНИЕ НАДУВНЫХ МАТРАСОВ!' 
                : 'CAUTION: STRONG OFFSHORE WIND. INFLATABLE MATTRESSES ARE STRONGLY PROHIBITED!'}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 z-10">

        {/* Brand Banner Hero */}
        <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glow behind logo */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-2 max-w-2xl relative">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>{lang === 'kk' ? 'Мемлекеттік Қауіпсіздік Бақылауы' : lang === 'ru' ? 'Государственный Контроль Безопасности' : 'State Safety Control Monitor'}</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">
              {lang === 'kk' ? 'Балқаш көліндегі су қауіпсіздігі порталы' : lang === 'ru' ? 'Портал безопасности на озере Балхаш' : 'Lake Balkhash Water Safety Portal'}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t.subtitle}. {lang === 'kk' ? 'Төтенше жағдайлар департаменті (ТЖД) тексерген базалар мен жағажайлар мәліметі.' : lang === 'ru' ? 'Актуальные данные проверок пляжей и баз отдыха спасателями ДЧС.' : 'Verified beach inspections and resort certifications from the Department of Emergency Situations.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-bold ${dataStatusMeta.className}`}>
                {dataStatusMeta.icon}
                <span>{dataStatusMeta.label}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {lang === 'kk' ? 'Жаңартылды' : lang === 'ru' ? 'Обновлено' : 'Updated'}: {lastUpdatedLabel}
              </span>
            </div>
          </div>

          <div className="flex gap-4 items-center shrink-0 bg-slate-950/50 p-4 border border-white/5 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-550 block font-mono">EMERGENCY LINE</span>
              <EmergencyCallButton
                number="112"
                lang={lang}
                className="text-lg font-black text-red-500 tracking-wider hover:text-red-400 flex items-center gap-1.5 mt-0.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>112</span>
              </EmergencyCallButton>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <div className="text-right">
              <span className="text-[10px] text-slate-550 block font-mono">MEDICAL SERVICE</span>
              <EmergencyCallButton
                number="103"
                lang={lang}
                className="text-lg font-black text-sky-400 tracking-wider hover:text-sky-300 flex items-center gap-1.5 mt-0.5 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>103</span>
              </EmergencyCallButton>
            </div>
          </div>
        </section>

        {/* Region Filter Tabs (Top Navigation) */}
        <nav className="bg-slate-900/60 p-2 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-2 items-stretch justify-between relative shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 flex-grow">
            {regionTabs.map((region) => (
              <button
                key={region.key}
                onClick={() => setRegionFilter(region.key)}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                  regionFilter === region.key
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/10'
                    : 'bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:bg-slate-950/70 border border-transparent'
                }`}
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{region.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Two Column Dashboard Grid */}
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Map, Filters, Cards and Search */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              
              <div className="bg-slate-900/60 border border-white/10 p-4 rounded-2xl shadow-md text-center flex flex-col justify-center">
                <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest block">
                  {t.statsTotal}
                </span>
                <span className="text-xl md:text-3xl font-black text-sky-400 mt-1">
                  {stats.total}
                </span>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-2xl shadow-md text-center flex flex-col justify-center">
                <span className="text-[10px] font-mono text-emerald-500/80 uppercase tracking-widest block">
                  {t.statsReadyCount}
                </span>
                <span className="text-xl md:text-3xl font-black text-emerald-400 mt-1">
                  {stats.permitted}
                </span>
              </div>

              <div className="bg-orange-950/30 border border-orange-500/20 p-4 rounded-2xl shadow-md text-center flex flex-col justify-center">
                <span className="text-[10px] font-mono text-orange-500/85 uppercase tracking-widest block">
                  {t.statsUninspected}
                </span>
                <span className="text-xl md:text-3xl font-black text-orange-400 mt-1">
                  {stats.deficient}
                </span>
              </div>

            </div>

            {/* Real Leaflet map with satellite / streets / hybrid / topo layers */}
            <LeafletMap
              lang={lang}
              items={filteredItems}
              selectedId={selectedItemId}
              onSelectItem={handleSelectMapItem}
              regionKey={regionFilter}
            />

            {/* Weather Widget — real-time Open-Meteo data per region */}
            <WeatherWidget
              lang={lang}
              regionKey={regionFilter}
              onFlagChange={handleWeatherFlag}
            />

            {/* Search and Category Filters Panel */}
            <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-white/5 pb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Search className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-500 hover:text-white cursor-pointer"
                    >
                      {lang === 'kk' ? 'Ысыру' : lang === 'ru' ? 'Сбросить' : 'Clear'}
                    </button>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-450 font-bold self-center">
                  {t.filterResultCount.replace('{{count}}', filteredItems.length.toString())}
                </div>
              </div>

              {/* Category Filter Badges (Sub-Navigation) */}
              <div className="flex flex-wrap gap-2">
                
                <button
                  onClick={() => setCategoryFilter('resorts')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
                    categoryFilter === 'resorts'
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                      : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🏰 {t.navCategories.resorts}
                </button>

                <button
                  onClick={() => setCategoryFilter('permitted')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
                    categoryFilter === 'permitted'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 {t.navCategories.permitted}
                </button>

                <button
                  onClick={() => setCategoryFilter('prohibited')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
                    categoryFilter === 'prohibited'
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.15)]'
                      : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔴 {t.navCategories.prohibited}
                </button>

                <button
                  onClick={() => setCategoryFilter('rescue')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
                    categoryFilter === 'rescue'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                      : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔵 {t.navCategories.rescue}
                </button>

              </div>

              {/* Dynamic Items Listing Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                {filteredItems.length === 0 ? (
                  <div className="col-span-2 py-12 text-center bg-slate-950/40 border border-white/5 rounded-2xl">
                    <HelpCircle className="w-10 h-10 text-slate-650 mx-auto mb-2 animate-bounce" />
                    <span className="text-sm font-extrabold text-slate-400 block">
                      {lang === 'kk' ? 'Ештеңе табылмады' : lang === 'ru' ? 'Ничего не найдено' : 'No results found'}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 px-4">
                      {lang === 'kk' ? 'Сүзгілерді өзгертіп немесе басқа іздеу сұрауын енгізіп көріңіз.' : lang === 'ru' ? 'Попробуйте изменить параметры фильтра или ввести другой запрос.' : 'Try adjusting the filters or modifying your search query.'}
                    </p>
                  </div>
                ) : (
                  filteredItems.map(item => {
                    const isSelected = item.id === selectedItemId;
                    const name = lang === 'kk' ? item.nameKk : lang === 'en' ? item.nameEn : item.nameRu;
                    const deficiencies = lang === 'kk' ? item.deficienciesKk : lang === 'en' ? item.deficienciesEn : item.deficienciesRu;
                    const info = lang === 'kk' ? item.infoKk : lang === 'en' ? item.infoEn : item.infoRu;

                    return (
                      <div
                        key={item.id}
                        ref={(el) => { cardRefs.current[item.id] = el; }}
                        onClick={() => setSelectedItemId(item.id)}
                        className={`p-5 rounded-2xl bg-slate-950/40 border transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer hover:bg-slate-950/70 ${
                          isSelected 
                            ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20' 
                            : 'border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-2">
                          
                          {/* Card Category Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
                              {item.category === 'rescue_post' 
                                ? t.navCategories.rescue 
                                : item.category === 'prohibited_zone' 
                                ? t.navCategories.prohibited
                                : item.category === 'permitted_beach'
                                ? t.navCategories.permitted
                                : t.navCategories.resorts}
                            </span>

                            {/* Status Indicators */}
                            {item.status === 'ready' && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span>{lang === 'kk' ? 'Рұқсат' : lang === 'ru' ? 'Готов' : 'Ready'}</span>
                              </span>
                            )}
                            {item.status === 'not_ready' && (
                              <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                <AlertTriangle className="w-3 h-3 text-orange-400" />
                                <span>{lang === 'kk' ? 'Кемшілік бар' : lang === 'ru' ? 'Дефекты' : 'Deficient'}</span>
                              </span>
                            )}
                            {item.status === 'danger' && (
                              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 animate-ping-slow">
                                <AlertOctagon className="w-3 h-3 text-red-400" />
                                <span>{lang === 'kk' ? 'Қауіпті' : lang === 'ru' ? 'Опасно' : 'Danger'}</span>
                              </span>
                            )}
                            {item.status === 'active' && (
                              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                <Waves className="w-3 h-3 text-blue-400" />
                                <span>{lang === 'kk' ? 'Белсенді' : lang === 'ru' ? 'Активен' : 'Active'}</span>
                              </span>
                            )}
                          </div>

                          {/* Resort/Zone Name */}
                          <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                            {name}
                          </h4>

                          {/* Render Deficiencies if they exist */}
                          {item.status === 'not_ready' && deficiencies && (
                            <div className="bg-orange-950/20 border border-orange-500/10 p-2.5 rounded-lg text-xs font-semibold text-orange-400 leading-relaxed">
                              <span className="block text-[10px] text-orange-550 uppercase tracking-widest font-mono mb-1">{t.deficiencies}</span>
                              ⚠️ {deficiencies}
                            </div>
                          )}

                          {/* Render Extra Info if exists */}
                          {info && (
                            <div className="bg-sky-950/20 border border-sky-500/10 p-2.5 rounded-lg text-xs text-sky-350 leading-relaxed">
                              💡 {info}
                            </div>
                          )}

                        </div>

                        {/* Navigation / Route Actions */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {item.lat && item.lng ? `${item.lat.toFixed(4)}N, ${item.lng.toFixed(4)}E` : t.noRoute}
                          </span>

                          {item.lat && item.lng ? (
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3.5 py-1.5 bg-slate-900 border border-white/10 hover:bg-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors text-slate-200 hover:text-white"
                            >
                              <Navigation className="w-3.5 h-3.5 text-sky-400" />
                              <span>{t.routeBtn}</span>
                            </a>
                          ) : (
                            <button
                              disabled
                              className="px-3.5 py-1.5 bg-slate-950 text-slate-650 text-xs font-bold rounded-lg flex items-center gap-1.5 border border-transparent cursor-not-allowed opacity-50"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>{t.routeBtn}</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

          {/* RIGHT SIDE: Safety Quiz, CPR guides, Report hazard */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Direct Rescue Numbers */}
            <div className="bg-gradient-to-br from-red-950/50 to-slate-950 border border-red-500/20 p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
              
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-red-500 animate-bounce" />
                <span>{lang === 'kk' ? 'МЧС құтқару қызметтері' : lang === 'ru' ? 'Службы спасения МЧС' : 'Emergency Responders'}</span>
              </h3>
              
              <div className="space-y-3 mt-4">
                <EmergencyCallButton
                  number="112"
                  lang={lang}
                  className="flex justify-between items-center p-3 bg-slate-900/60 border border-white/5 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
                >
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">
                      {lang === 'kk' ? 'Шұғыл құтқару қызметі' : lang === 'ru' ? 'Единая служба спасения' : 'Single Dispatcher Line'}
                    </span>
                    <span className="text-[10px] text-slate-500">{lang === 'kk' ? 'Ақпарат алу және көмек шақыру' : lang === 'ru' ? 'Справки и вызов помощи' : 'Free emergency dial'}</span>
                  </div>
                  <span className="text-base font-black text-red-500">112</span>
                </EmergencyCallButton>
                <EmergencyCallButton
                  number="103"
                  lang={lang}
                  className="flex justify-between items-center p-3 bg-slate-900/60 border border-white/5 hover:border-sky-500/30 rounded-xl transition-all cursor-pointer"
                >
                  <div className="text-left">
                    <span className="text-xs font-bold text-white block">
                      {lang === 'kk' ? 'Жедел медициналық жәрдем' : lang === 'ru' ? 'Скорая медицинская помощь' : 'Ambulance & Medical'}
                    </span>
                    <span className="text-[10px] text-slate-500">{lang === 'kk' ? 'Дәрігер шақырту' : lang === 'ru' ? 'Вызов бригады врачей' : 'Emergency health support'}</span>
                  </div>
                  <span className="text-base font-black text-sky-400">103</span>
                </EmergencyCallButton>
              </div>
            </div>

            {/* CPR & Emergency First Aid Guides */}
            <FirstAidGuide lang={lang} />

            {/* Safety Quiz Widget */}
            <SafetyQuiz lang={lang} />

            {/* Incident Reporting Form */}
            <ReportForm 
              lang={lang} 
              onReportSubmitted={handleNewReportSubmitted} 
            />

          </div>

        </div>

      </main>

      {/* Footer Credits */}
      <footer className="mt-16 bg-slate-950 border-t border-white/10 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-mono uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-500" />
            <span>{t.credits}</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={openSafetyRules}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'kk' ? 'Ережелерді қарау' : lang === 'ru' ? 'Свод правил' : 'View Code of Conduct'}
            </button>
            <span>•</span>
            <span>VER: 2026.1.4</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
