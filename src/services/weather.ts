// Open-Meteo free weather API integration (no key required)
// Docs: https://open-meteo.com/en/docs

export interface WeatherSnapshot {
  temperatureAir: number | null; // °C
  temperatureWater: number | null; // °C (approx. surface, derived from air + season fallback)
  windSpeed: number | null; // m/s
  windDirection: number | null; // degrees
  windGusts: number | null; // m/s
  waveHeight: number | null; // m (synthetic — Balkhash is a lake, no marine API, derived from wind)
  weatherCode: number | null;
  isDay: boolean;
  observedAt: string;
  flag: 'green' | 'yellow' | 'red';
  flagReasonKey: 'calm' | 'windy' | 'storm';
}

export interface RegionWeatherProfile {
  key: 'balkhash' | 'torangalyk' | 'chubar_tyubek' | 'priozersk';
  lat: number;
  lng: number;
}

export const WEATHER_PROFILES: Record<string, RegionWeatherProfile> = {
  balkhash: { key: 'balkhash', lat: 46.8329, lng: 74.9846 },
  torangalyk: { key: 'torangalyk', lat: 46.7665, lng: 74.8351 },
  chubar_tyubek: { key: 'chubar_tyubek', lat: 46.7758, lng: 74.7129 },
  priozersk: { key: 'priozersk', lat: 46.0272, lng: 73.7179 }
};

// Approximate water temperature based on month for Lake Balkhash (well-known average values)
const balkhashMonthlyWaterTemp: Record<number, number> = {
  0: 1.5, 1: 1.5, 2: 3, 3: 8, 4: 14, 5: 20,
  6: 24, 7: 25, 8: 21, 9: 14, 10: 6, 11: 2
};

const estimateWaterTemp = (airTemp: number | null): number | null => {
  const month = new Date().getMonth();
  const monthly = balkhashMonthlyWaterTemp[month] ?? 18;
  if (airTemp === null) return monthly;
  // Blend ambient air temp with seasonal baseline (water lags ~3-4°C behind air in summer).
  return Math.round((monthly * 0.7 + (airTemp - 3) * 0.3) * 10) / 10;
};

const estimateWaveHeight = (windMs: number | null): number | null => {
  if (windMs === null) return null;
  // Simple wind-wave approximation: enclosed lake, short fetch.
  // wave (m) ≈ 0.05 * wind(m/s)^1.4, capped at 2.5m
  const wave = 0.05 * Math.pow(windMs, 1.4);
  return Math.min(2.5, Math.max(0, Math.round(wave * 10) / 10));
};

const deriveFlag = (
  windMs: number | null,
  gusts: number | null,
  weatherCode: number | null
): { flag: WeatherSnapshot['flag']; reasonKey: WeatherSnapshot['flagReasonKey'] } => {
  const effectiveWind = Math.max(windMs ?? 0, gusts ?? 0);
  const stormCodes = new Set([95, 96, 99, 65, 75, 82, 86]); // thunderstorm / heavy rain / heavy snow

  if (effectiveWind >= 12 || (weatherCode !== null && stormCodes.has(weatherCode))) {
    return { flag: 'red', reasonKey: 'storm' };
  }
  if (effectiveWind >= 7) {
    return { flag: 'yellow', reasonKey: 'windy' };
  }
  return { flag: 'green', reasonKey: 'calm' };
};

export const fetchWeather = async (lat: number, lng: number): Promise<WeatherSnapshot> => {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,is_day` +
    `&wind_speed_unit=ms&timezone=auto`;

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed: ${response.status}`);
  }

  const data = await response.json();
  const c = data?.current ?? {};

  const air = typeof c.temperature_2m === 'number' ? c.temperature_2m : null;
  const wind = typeof c.wind_speed_10m === 'number' ? c.wind_speed_10m : null;
  const gusts = typeof c.wind_gusts_10m === 'number' ? c.wind_gusts_10m : null;
  const dir = typeof c.wind_direction_10m === 'number' ? c.wind_direction_10m : null;
  const code = typeof c.weather_code === 'number' ? c.weather_code : null;

  const { flag, reasonKey } = deriveFlag(wind, gusts, code);

  return {
    temperatureAir: air !== null ? Math.round(air * 10) / 10 : null,
    temperatureWater: estimateWaterTemp(air),
    windSpeed: wind !== null ? Math.round(wind * 10) / 10 : null,
    windDirection: dir,
    windGusts: gusts !== null ? Math.round(gusts * 10) / 10 : null,
    waveHeight: estimateWaveHeight(Math.max(wind ?? 0, (gusts ?? 0) * 0.6)),
    weatherCode: code,
    isDay: c.is_day === 1,
    observedAt: c.time ?? new Date().toISOString(),
    flag,
    flagReasonKey: reasonKey
  };
};

// Human-readable mapping for WMO weather codes used by Open-Meteo
export const weatherCodeLabels: Record<number, { ru: string; kk: string; en: string; emoji: string }> = {
  0: { ru: 'Ясно', kk: 'Ашық', en: 'Clear', emoji: '☀️' },
  1: { ru: 'Преимущественно ясно', kk: 'Көбіне ашық', en: 'Mostly clear', emoji: '🌤️' },
  2: { ru: 'Переменная облачность', kk: 'Айнымалы бұлтты', en: 'Partly cloudy', emoji: '⛅' },
  3: { ru: 'Пасмурно', kk: 'Бұлтты', en: 'Overcast', emoji: '☁️' },
  45: { ru: 'Туман', kk: 'Тұман', en: 'Fog', emoji: '🌫️' },
  48: { ru: 'Изморось', kk: 'Қырау тұман', en: 'Rime fog', emoji: '🌫️' },
  51: { ru: 'Морось слабая', kk: 'Әлсіз сіркіреу', en: 'Light drizzle', emoji: '🌦️' },
  53: { ru: 'Морось', kk: 'Сіркіреу', en: 'Drizzle', emoji: '🌦️' },
  55: { ru: 'Сильная морось', kk: 'Қатты сіркіреу', en: 'Heavy drizzle', emoji: '🌧️' },
  61: { ru: 'Слабый дождь', kk: 'Әлсіз жаңбыр', en: 'Light rain', emoji: '🌦️' },
  63: { ru: 'Дождь', kk: 'Жаңбыр', en: 'Rain', emoji: '🌧️' },
  65: { ru: 'Сильный дождь', kk: 'Қатты жаңбыр', en: 'Heavy rain', emoji: '⛈️' },
  71: { ru: 'Слабый снег', kk: 'Әлсіз қар', en: 'Light snow', emoji: '🌨️' },
  73: { ru: 'Снег', kk: 'Қар', en: 'Snow', emoji: '🌨️' },
  75: { ru: 'Сильный снег', kk: 'Қалың қар', en: 'Heavy snow', emoji: '❄️' },
  80: { ru: 'Ливни', kk: 'Нөсер', en: 'Showers', emoji: '🌦️' },
  81: { ru: 'Сильные ливни', kk: 'Қатты нөсер', en: 'Heavy showers', emoji: '🌧️' },
  82: { ru: 'Очень сильные ливни', kk: 'Өте қатты нөсер', en: 'Violent showers', emoji: '⛈️' },
  95: { ru: 'Гроза', kk: 'Найзағай', en: 'Thunderstorm', emoji: '⛈️' },
  96: { ru: 'Гроза с градом', kk: 'Найзағай мен бұршақ', en: 'Thunderstorm w/ hail', emoji: '⛈️' },
  99: { ru: 'Сильная гроза с градом', kk: 'Қатты найзағай мен бұршақ', en: 'Severe thunderstorm', emoji: '⛈️' }
};

export const windDirectionLabel = (deg: number | null, lang: 'kk' | 'ru' | 'en'): string => {
  if (deg === null) return '—';
  const dirs = {
    ru: ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'],
    kk: ['С', 'СШ', 'Ш', 'ОШ', 'О', 'ОБ', 'Б', 'СБ'],
    en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  };
  const idx = Math.round(((deg % 360) / 45)) % 8;
  return dirs[lang][idx];
};
