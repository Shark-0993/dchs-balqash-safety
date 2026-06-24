import React, { useEffect, useRef, useState } from 'react';
import { AlertOctagon, Send, CheckCircle2, MapPin, LocateFixed, ExternalLink } from 'lucide-react';
import { RegionKey, ResortItem, translations } from '../data/db';

interface ReportFormProps {
  lang: 'kk' | 'ru' | 'en';
  onReportSubmitted: (newReport: ResortItem) => void;
}

const REGION_CENTERS: Record<RegionKey, { lat: number; lng: number; zoom: number }> = {
  balkhash: { lat: 46.810, lng: 74.995, zoom: 13 },
  torangalyk: { lat: 46.766, lng: 74.835, zoom: 14 },
  chubar_tyubek: { lat: 46.775, lng: 74.710, zoom: 14 },
  priozersk: { lat: 46.027, lng: 73.718, zoom: 13 }
};

declare global {
  interface Window { L: any }
}

const WHATSAPP_NUMBER = '77053268698'; // +7 705 326 8698

export const ReportForm: React.FC<ReportFormProps> = ({ lang, onReportSubmitted }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [region, setRegion] = useState<RegionKey>('balkhash');
  const [submitted, setSubmitted] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'found' | 'error'>('idle');

  const t = translations[lang];

  // Mini map picker
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const setCoords = (nLat: number, nLng: number, pan=true) => {
    setLat(Number(nLat.toFixed(6)));
    setLng(Number(nLng.toFixed(6)));
    const L = window.L;
    if (!L || !mapRef.current) return;
    if (!markerRef.current) {
      markerRef.current = L.marker([nLat, nLng], { draggable: true }).addTo(mapRef.current);
      markerRef.current.on('dragend', () => {
        const p = markerRef.current.getLatLng();
        setCoords(p.lat, p.lng, false);
      });
    } else {
      markerRef.current.setLatLng([nLat, nLng]);
    }
    if (pan) mapRef.current.flyTo([nLat, nLng], Math.max(mapRef.current.getZoom(), 14), { duration: 0.6 });
  };

  // Init mini leaflet map
  useEffect(() => {
    if (!mapElRef.current || mapRef.current || !window.L) return;
    const L = window.L;
    const rc = REGION_CENTERS[region];
    const map = L.map(mapElRef.current, {
      center: [rc.lat, rc.lng],
      zoom: rc.zoom,
      zoomControl: true,
      attributionControl: false
    });
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);
    map.on('click', (e: any) => setCoords(e.latlng.lat, e.latlng.lng));
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; markerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When region changes, recenter map
  useEffect(() => {
    if (!mapRef.current) return;
    const rc = REGION_CENTERS[region];
    mapRef.current.flyTo([rc.lat, rc.lng], rc.zoom, { duration: 0.9 });
  }, [region]);

  const useMyLocation = () => {
    if (!navigator.geolocation) { setGeoStatus('error'); return; }
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition((pos) => {
      setGeoStatus('found');
      setCoords(pos.coords.latitude, pos.coords.longitude, true);
    }, () => setGeoStatus('error'), { enableHighAccuracy: true, timeout: 10000 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !message.trim()) return;

    const hasCoords = lat !== null && lng !== null;
    const finalLat = hasCoords ? lat : (REGION_CENTERS[region].lat + (Math.random() - 0.5) * 0.02);
    const finalLng = hasCoords ? lng : (REGION_CENTERS[region].lng + (Math.random() - 0.5) * 0.02);

    const newReport: ResortItem = {
      id: `report-${Date.now()}`,
      region,
      category: 'prohibited_zone',
      nameRu: `⚠️ ${location}`,
      nameKk: `⚠️ ${location}`,
      nameEn: `⚠️ ${location}`,
      lat: finalLat,
      lng: finalLng,
      status: 'danger',
      infoRu: `Отчёт от ${name || 'Аноним'}: ${message}`,
      infoKk: `Есеп ${name || 'Аноним'}: ${message}`,
      infoEn: `Report from ${name || 'Anonymous'}: ${message}`,
      source: 'user_report'
    };

    // local persistence
    const savedReports = JSON.parse(localStorage.getItem('balkhash_user_reports') || '[]');
    savedReports.push(newReport);
    localStorage.setItem('balkhash_user_reports', JSON.stringify(savedReports));

    onReportSubmitted(newReport);

    // --- Build WhatsApp message ---
    const regionLabel =
      lang === 'kk' ? ( { balkhash: 'Балқаш қ.', torangalyk: 'Торанғалық', chubar_tyubek: 'Шұбар-Түбек', priozersk: 'Приозерск' }[region] )
      : lang === 'ru' ? ( { balkhash: 'г. Балхаш', torangalyk: 'пос. Торангалык', chubar_tyubek: 'пос. Чубар-Тюбек', priozersk: 'г. Приозерск' }[region] )
      : ( { balkhash: 'Balkhash', torangalyk: 'Torangalyk', chubar_tyubek: 'Chubar-Tyubek', priozersk: 'Priozersk' }[region] );

    const lines = [
      lang === 'kk' ? '🚨 БАЛҚАШ ҚАУІПСІЗДІГІ – ХАБАРЛАМА' :
      lang === 'ru' ? '🚨 BALKHASH SAFETY – ИНЦИДЕНТ' :
      '🚨 BALKHASH SAFETY – INCIDENT REPORT',
      '',
      `${lang === 'kk' ? 'Аты' : lang === 'ru' ? 'Имя' : 'Name'}: ${name || (lang==='kk'?'Аноним': lang==='ru'?'Аноним':'Anonymous')}`,
      `${lang === 'kk' ? 'Аймақ' : lang === 'ru' ? 'Регион' : 'Region'}: ${regionLabel}`,
      `${lang === 'kk' ? 'Нысан' : lang === 'ru' ? 'Объект' : 'Location'}: ${location}`,
      hasCoords ? `Coords: ${finalLat.toFixed(6)}, ${finalLng.toFixed(6)}` : null,
      hasCoords ? `https://maps.google.com/?q=${finalLat},${finalLng}` : null,
      '',
      (lang === 'kk' ? 'Сипаттама:' : lang === 'ru' ? 'Описание:' : 'Description:'),
      message
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
    window.open(waUrl, '_blank', 'noopener');

    setSubmitted(true);
    setTimeout(() => {
      setName(''); setLocation(''); setMessage(''); setLat(null); setLng(null); setSubmitted(false);
      if (markerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }, 3800);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
        <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertOctagon className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-white leading-tight">
            {t.reportTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.reportDesc}
          </p>
        </div>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
        >
          WhatsApp
        </a>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-pulse" />
          <h4 className="text-base font-extrabold text-white">
            {t.reportSuccess}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm">
            {lang === 'kk' 
              ? 'Хабарлама WhatsApp арқылы ТЖД-ға жіберілді және картада қызыл маркер ретінде көрсетіледі.'
              : lang === 'ru'
              ? 'Сообщение отправлено в WhatsApp ДЧС и отмечено красным маркером на карте.'
              : 'The message was sent to DES via WhatsApp and marked on the map.'}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
          >
            {lang === 'kk' ? 'WhatsApp чатын ашу' : lang === 'ru' ? 'Открыть чат WhatsApp' : 'Open WhatsApp chat'}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t.reportName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'kk' ? 'Атыңыз' : lang === 'ru' ? 'Иван' : 'Your name'}
                className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'kk' ? 'Аймақ' : lang === 'ru' ? 'Регион' : 'Region'}
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionKey)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              >
                <option value="balkhash">{t.navRegions.balkhash}</option>
                <option value="torangalyk">{t.navRegions.torangalyk}</option>
                <option value="chubar_tyubek">{t.navRegions.chubar_tyubek}</option>
                <option value="priozersk">{t.navRegions.priozersk}</option>
              </select>
            </div>
          </div>

          {/* Location / coordinates picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.reportLoc} *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={lang === 'kk' ? 'Жағажай немесе демалыс орнының атауы' : lang === 'ru' ? 'Название зоны отдыха или дикого пляжа' : 'Resort or beach name'}
              className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />

            <div className="bg-slate-950/60 border border-white/10 rounded-xl p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  {lang === 'kk' ? 'Картадан орынды таңдаңыз' : lang === 'ru' ? 'Выберите точку на карте' : 'Pick location on the map'}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={useMyLocation}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-[11px] font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${geoStatus==='locating' ? 'animate-pulse text-emerald-400' : 'text-sky-400'}`} />
                    {lang==='kk' ? 'Менің орным' : lang==='ru' ? 'Где я' : 'My location'}
                  </button>
                  {lat !== null && lng !== null && (
                    <button
                      type="button"
                      onClick={() => { setLat(null); setLng(null); if (markerRef.current && mapRef.current) { mapRef.current.removeLayer(markerRef.current); markerRef.current = null; } }}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-lg text-[11px] font-semibold text-slate-400 cursor-pointer"
                    >
                      {lang==='kk' ? 'Тазалау' : lang==='ru' ? 'Сбросить' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              <div ref={mapElRef} className="h-[200px] rounded-lg overflow-hidden border border-white/10 bg-slate-950" />

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2">
                  <div className="text-[9px] uppercase tracking-widest text-slate-500">Lat</div>
                  <input
                    type="number" step="any"
                    value={lat ?? ''}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v)) setCoords(v, lng ?? REGION_CENTERS[region].lng);
                    }}
                    placeholder="46.8…"
                    className="bg-transparent outline-none w-full text-white font-mono"
                  />
                </div>
                <div className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2">
                  <div className="text-[9px] uppercase tracking-widest text-slate-500">Lng</div>
                  <input
                    type="number" step="any"
                    value={lng ?? ''}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v)) setCoords(lat ?? REGION_CENTERS[region].lat, v);
                    }}
                    placeholder="74.9…"
                    className="bg-transparent outline-none w-full text-white font-mono"
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-500">
                {lat !== null && lng !== null 
                  ? <>✓ {lat.toFixed(5)}, {lng.toFixed(5)} — <a className="text-sky-400 hover:text-sky-300 underline" href={`https://maps.google.com/?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer">{lang==='kk'?'Картада ашу':lang==='ru'?'Открыть в Google Maps':'Open in Google Maps'}</a></>
                  : (lang==='kk' ? 'Маркер қою үшін картаны басыңыз немесе "Менің орным" түймесін пайдаланыңыз.' : lang==='ru' ? 'Нажмите по карте, чтобы поставить маркер, либо используйте «Где я».' : 'Click on the map to drop a pin, or use “My location”.')
                }
              </p>
            </div>
          </div>

          {/* Hazard Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {t.reportMsg} *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={lang === 'kk' ? 'Қандай бұзушылықты байқадыңыз?' : lang === 'ru' ? 'Какое нарушение вы обнаружили?' : 'Describe the safety hazard'}
              className="w-full px-3 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{t.reportSubmit} — WhatsApp</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center">
            {lang==='kk' ? 'Жіберу батырмасын басқанда WhatsApp чаты +7 705 326 8698 нөмірімен ашылады, хабарлама алдын ала толтырылады.' :
             lang==='ru' ? 'При отправке откроется чат WhatsApp по номеру +7 705 326 8698 с предзаполненным сообщением.' :
             'On submit, a WhatsApp chat with +7 705 326 8698 opens with a pre-filled message.'}
          </p>
        </form>
      )}
    </div>
  );
};
