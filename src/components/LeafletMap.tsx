import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Layers, Maximize2, Navigation as NavIcon, LocateFixed } from 'lucide-react';
import { ResortItem, translations } from '../data/db';

// Leaflet is loaded via CDN in index.html as window.L
declare global {
  interface Window {
    L: any;
  }
}

interface LeafletMapProps {
  lang: 'kk' | 'ru' | 'en';
  items: ResortItem[];
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  regionKey: 'balkhash' | 'torangalyk' | 'chubar_tyubek' | 'priozersk';
}

type BaseLayer = 'satellite' | 'streets' | 'hybrid' | 'topo';

const REGION_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  balkhash: { center: [46.83, 74.99], zoom: 12 },
  torangalyk: { center: [46.766, 74.835], zoom: 14 },
  chubar_tyubek: { center: [46.775, 74.71], zoom: 14 },
  priozersk: { center: [46.027, 73.718], zoom: 13 }
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  lang,
  items,
  selectedId,
  onSelectItem,
  regionKey
}) => {
  const t = translations[lang];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const markerRefs = useRef<{ [id: string]: any }>({});
  const baseLayersRef = useRef<{ [key in BaseLayer]?: any }>({});
  const labelLayerRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState<BaseLayer>('satellite');
  const [leafletReady, setLeafletReady] = useState<boolean>(false);

  // Wait for Leaflet CDN
  useEffect(() => {
    let attempts = 0;
    const check = () => {
      if (window.L) {
        setLeafletReady(true);
        return;
      }
      attempts += 1;
      if (attempts < 50) {
        setTimeout(check, 100);
      }
    };
    check();
  }, []);

  const userLocationLayerRef = useRef<any>(null);
  const [geoState, setGeoState] = useState<'idle' | 'locating' | 'found' | 'denied'>('idle');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!leafletReady || !containerRef.current || mapRef.current) return;
    const L = window.L;

    const initial = REGION_CENTERS[regionKey] ?? REGION_CENTERS.balkhash;
    const map = L.map(containerRef.current, {
      center: initial.center,
      zoom: initial.zoom,
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true,
      worldCopyJump: false
    });

    // Add a custom locate control
    const LocateCtrl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function() {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const btn = L.DomUtil.create('a', '', container);
        btn.href = '#';
        btn.title = 'Где я';
        btn.setAttribute('aria-label', 'Где я');
        btn.style.width = '34px';
        btn.style.height = '34px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.innerHTML = '📍';
        L.DomEvent.on(btn, 'click', function(ev: any){
          L.DomEvent.stopPropagation(ev);
          L.DomEvent.preventDefault(ev);
          // trigger react locate via a custom event
          window.dispatchEvent(new CustomEvent('balkhash-locate-me'));
        });
        return container;
      }
    });
    new LocateCtrl().addTo(map);

    // --- Define base layers ---
    const satellite = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
      }
    );

    const streets = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        attribution: '© OpenStreetMap, © CARTO'
      }
    );

    const topo = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 17,
        attribution: 'Map data: © OpenStreetMap, SRTM | © OpenTopoMap'
      }
    );

    // Reference labels overlay for hybrid mode
    const labels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: '',
        pane: 'overlayPane'
      }
    );

    baseLayersRef.current = { satellite, streets, topo, hybrid: satellite };
    labelLayerRef.current = labels;

    // Start with satellite layer
    satellite.addTo(map);

    // Markers cluster layer (simple feature group)
    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      markerRefs.current = {};
    };
  }, [leafletReady]);

  // Switch base layer
  useEffect(() => {
    if (!mapRef.current || !leafletReady) return;
    const map = mapRef.current;
    const L = window.L;
    const layers = baseLayersRef.current;

    // Remove all base layers + labels first
    Object.values(layers).forEach((layer: any) => {
      if (layer && map.hasLayer(layer)) map.removeLayer(layer);
    });
    if (labelLayerRef.current && map.hasLayer(labelLayerRef.current)) {
      map.removeLayer(labelLayerRef.current);
    }

    // Add chosen layer
    if (activeLayer === 'hybrid') {
      layers.satellite?.addTo(map);
      labelLayerRef.current?.addTo(map);
    } else {
      layers[activeLayer]?.addTo(map);
    }
    // Touch L just to avoid TS unused warning
    void L;
  }, [activeLayer, leafletReady]);

  // Geolocation "Где я" handler
  useEffect(() => {
    if (!leafletReady || !mapRef.current) return;
    const map = mapRef.current;
    const L = window.L;

    const locateMe = () => {
      if (!('geolocation' in navigator)) {
        setGeoError(lang === 'kk' ? 'Геолокация қолжетімсіз' : lang === 'ru' ? 'Геолокация недоступна' : 'Geolocation unavailable');
        setGeoState('denied');
        return;
      }
      setGeoState('locating');
      setGeoError(null);
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGeoState('found');
        map.flyTo([latitude, longitude], 15, { duration: 1 });

        if (userLocationLayerRef.current) {
          map.removeLayer(userLocationLayerRef.current);
        }
        const userIcon = L.divIcon({
          className: 'balkhash-userloc',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          html: `<div style="width:18px;height:18px;border-radius:50%;background:#38bdf8;border:3px solid #ffffff;box-shadow:0 0 0 6px rgba(56,189,248,.25),0 2px 8px rgba(0,0,0,.45)"></div>`
        });
        const marker = L.marker([latitude, longitude], { icon: userIcon, zIndexOffset: 9999 });
        const accuracyCircle = L.circle([latitude, longitude], {
          radius: Math.min(accuracy || 35, 300),
          color: '#38bdf8',
          fillColor: '#38bdf8',
          fillOpacity: 0.11,
          weight: 1.2
        });
        const group = L.layerGroup([accuracyCircle, marker]).addTo(map);
        userLocationLayerRef.current = group;

        marker.bindPopup(`<div style="font-family:Manrope,Inter,sans-serif;font-size:12px"><b>${lang === 'kk' ? 'Сіз осы жердесіз' : lang==='ru' ? 'Вы здесь' : 'You are here'}</b><br/><span style="color:#94a3b8">${latitude.toFixed(5)}, ${longitude.toFixed(5)}</span></div>`).openPopup();
      }, (err) => {
        setGeoState('denied');
        setGeoError(err.message || (lang === 'kk' ? 'Орналасуға рұқсат берілмеді' : lang === 'ru' ? 'Доступ к геопозиции отклонён' : 'Location permission denied'));
      }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
    };

    const handler = () => locateMe();
    window.addEventListener('balkhash-locate-me', handler as EventListener);
    return () => window.removeEventListener('balkhash-locate-me', handler as EventListener);
  }, [leafletReady, lang]);

  // Recenter map when region changes
  useEffect(() => {
    if (!mapRef.current) return;
    const target = REGION_CENTERS[regionKey] ?? REGION_CENTERS.balkhash;
    mapRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
  }, [regionKey]);

  // Render markers when items change
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current || !leafletReady) return;
    const L = window.L;
    const layer = markersLayerRef.current;

    layer.clearLayers();
    markerRefs.current = {};

    const validItems = items.filter(it => it.lat !== null && it.lng !== null);
    if (!validItems.length) return;

    validItems.forEach(item => {
      const statusClass = item.status === 'ready'
        ? 'marker-ready'
        : item.status === 'not_ready'
        ? 'marker-not_ready'
        : item.status === 'danger' || item.category === 'prohibited_zone'
        ? 'marker-danger'
        : 'marker-active';

      const symbol =
        item.category === 'rescue_post' ? '🛟' :
        item.category === 'prohibited_zone' || item.status === 'danger' ? '⛔' :
        item.category === 'permitted_beach' ? '🏖️' :
        item.status === 'ready' ? '✓' : '!';

      const icon = L.divIcon({
        className: `balkhash-marker ${item.id === selectedId ? 'is-selected' : ''}`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        html: `<div class="balkhash-marker-inner ${statusClass}">${symbol}</div>`
      });

      const marker = L.marker([item.lat as number, item.lng as number], { icon, riseOnHover: true });

      const name =
        lang === 'kk' ? item.nameKk :
        lang === 'en' ? item.nameEn : item.nameRu;
      const info =
        lang === 'kk' ? item.infoKk :
        lang === 'en' ? item.infoEn : item.infoRu;
      const deficiencies =
        lang === 'kk' ? item.deficienciesKk :
        lang === 'en' ? item.deficienciesEn : item.deficienciesRu;

      const categoryLabel =
        item.category === 'rescue_post' ? t.navCategories.rescue :
        item.category === 'prohibited_zone' ? t.navCategories.prohibited :
        item.category === 'permitted_beach' ? t.navCategories.permitted :
        t.navCategories.resorts;

      const statusLabel =
        item.status === 'ready' ? t.statusReady :
        item.status === 'not_ready' ? t.statusNotReady :
        item.status === 'danger' ? t.statusDanger : t.statusActive;

      const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;

      const popupHtml = `
        <div style="min-width: 200px; max-width: 260px;">
          <div style="font-size:10px; color:#f97316; font-weight:800; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
            ${categoryLabel}
          </div>
          <div style="font-size:13px; font-weight:800; color:#fff; margin-bottom:6px; line-height:1.3;">
            ${name}
          </div>
          <div style="font-size:11px; color:#94a3b8; margin-bottom:8px;">
            ${statusLabel}
          </div>
          ${deficiencies ? `<div style="background:rgba(249,115,22,0.12); border:1px solid rgba(249,115,22,0.2); padding:6px 8px; border-radius:6px; font-size:11px; color:#fdba74; margin-bottom:6px;">⚠️ ${deficiencies}</div>` : ''}
          ${info ? `<div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.2); padding:6px 8px; border-radius:6px; font-size:11px; color:#7dd3fc; margin-bottom:8px;">💡 ${info}</div>` : ''}
          <div style="display:flex; gap:6px; margin-top:6px;">
            <a href="${routeUrl}" target="_blank" rel="noopener" style="flex:1; text-align:center; padding:6px 8px; background:linear-gradient(90deg,#ea580c,#f59e0b); color:#fff; border-radius:6px; font-size:11px; font-weight:800; text-decoration:none;">${t.routeBtn}</a>
            <a href="tel:112" style="padding:6px 8px; background:#dc2626; color:#fff; border-radius:6px; font-size:11px; font-weight:800; text-decoration:none;">📞 112</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: true, autoPan: true, maxWidth: 280 });
      marker.on('click', () => onSelectItem(item.id));

      marker.addTo(layer);
      markerRefs.current[item.id] = marker;
    });
  }, [items, leafletReady, lang, t, selectedId, onSelectItem]);

  // Pan to selected marker
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const marker = markerRefs.current[selectedId];
    if (marker) {
      const latlng = marker.getLatLng();
      mapRef.current.flyTo(latlng, Math.max(mapRef.current.getZoom(), 15), { duration: 1 });
      marker.openPopup();
    }
  }, [selectedId]);

  const layerOptions = useMemo(() => ([
    {
      key: 'satellite' as BaseLayer,
      label: lang === 'kk' ? 'Спутник' : lang === 'ru' ? 'Спутник' : 'Satellite'
    },
    {
      key: 'hybrid' as BaseLayer,
      label: lang === 'kk' ? 'Гибрид' : lang === 'ru' ? 'Гибрид' : 'Hybrid'
    },
    {
      key: 'streets' as BaseLayer,
      label: lang === 'kk' ? 'Схема' : lang === 'ru' ? 'Схема' : 'Streets'
    },
    {
      key: 'topo' as BaseLayer,
      label: lang === 'kk' ? 'Рельеф' : lang === 'ru' ? 'Рельеф' : 'Topo'
    }
  ]), [lang]);

  const recenter = () => {
    if (!mapRef.current) return;
    const target = REGION_CENTERS[regionKey] ?? REGION_CENTERS.balkhash;
    mapRef.current.flyTo(target.center, target.zoom, { duration: 1.2 });
    onSelectItem(null);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative select-none">

      {/* Map Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-500 animate-spin-slow" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {t.interactiveMapTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <NavIcon className="w-3 h-3 text-sky-400" />
            {t.clickMarkerMsg}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('balkhash-locate-me'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              geoState === 'locating'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-800 border-white/10'
            }`}
            title={lang === 'kk' ? 'Менің орным' : lang === 'ru' ? 'Где я' : 'Where am I'}
          >
            <LocateFixed className={`w-3.5 h-3.5 ${geoState==='locating' ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{lang === 'kk' ? 'Где я' : lang === 'ru' ? 'Где я' : 'Where am I'}</span>
          </button>
          <button
            onClick={recenter}
            className="px-3 py-1.5 bg-slate-950/80 border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === 'kk' ? 'Орталау' : lang === 'ru' ? 'По центру' : 'Recenter'}</span>
          </button>
        </div>
      </div>
      {geoError && (
        <div className="mb-3 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          {geoError}
        </div>
      )}

      {/* Layer Switcher */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-500">
          <Layers className="w-3.5 h-3.5" />
          {lang === 'kk' ? 'Қабат' : lang === 'ru' ? 'Слой' : 'Layer'}:
        </span>
        {layerOptions.map(opt => (
          <button
            key={opt.key}
            onClick={() => setActiveLayer(opt.key)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
              activeLayer === opt.key
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-[0_0_10px_rgba(56,189,248,0.15)]'
                : 'bg-slate-950/40 text-slate-400 border-transparent hover:text-white hover:bg-slate-950/70'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map Canvas */}
      <div
        ref={containerRef}
        className="relative h-[420px] md:h-[520px] w-full rounded-xl overflow-hidden border border-white/10 shadow-inner"
        style={{ background: '#04101c' }}
      >
        {!leafletReady && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm bg-slate-950/80">
            <span className="animate-pulse">Loading map…</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ background: '#10b981', border: '2px solid #6ee7b7' }}></span>
          <span>{t.statusReady}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ background: '#f97316', border: '2px solid #fdba74' }}></span>
          <span>{t.statusNotReady}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full animate-pulse" style={{ background: '#dc2626', border: '2px solid #fca5a5' }}></span>
          <span>{t.statusDanger}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full" style={{ background: '#2563eb', border: '2px solid #93c5fd' }}></span>
          <span>{t.statusActive}</span>
        </div>
      </div>
    </div>
  );
};
