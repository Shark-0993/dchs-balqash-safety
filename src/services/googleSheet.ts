import { ResortItem, RegionKey } from '../data/db';

export const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRzuqNXfVP16GifdyCn4SHgQ3AssLk3sn5rk2wp1-BN3D4fX7Jwng4WWPDthQByGdb185w9Gzy6PDWc/pub?output=csv';

type SheetType = 'rescue' | 'allowed' | 'recreation';

interface GoogleSheetRow {
  id: string;
  type: SheetType | string;
  name: string;
  locationKey: string;
  lat: string;
  lng: string;
  ready: string;
}

const locationMap: Record<string, { region: RegionKey; ru: string; kk: string; en: string }> = {
  locBalkhash: {
    region: 'balkhash',
    ru: 'г. Балхаш',
    kk: 'Балқаш қаласы',
    en: 'Balkhash City'
  },
  locBarkovskoe: {
    region: 'balkhash',
    ru: 'Барковское побережье, г. Балхаш',
    kk: 'Барковское жағалауы, Балқаш қаласы',
    en: 'Barkovskoye coast, Balkhash City'
  },
  locTorangalyk: {
    region: 'torangalyk',
    ru: 'пос. Торангалык',
    kk: 'Торанғалық ауылы',
    en: 'Torangalyk Village'
  },
  locChubar: {
    region: 'chubar_tyubek',
    ru: 'пос. Чубар-Тюбек',
    kk: 'Шұбар-Түбек ауылы',
    en: 'Chubar-Tyubek Village'
  },
  locPriozersk: {
    region: 'priozersk',
    ru: 'г. Приозерск',
    kk: 'Приозерск қаласы',
    en: 'Priozersk City'
  }
};

const parseCsv = (csv: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.some(Boolean)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some(Boolean)) {
    rows.push(currentRow);
  }

  return rows;
};

const rowsToObjects = (csv: string): GoogleSheetRow[] => {
  const [headers, ...rows] = parseCsv(csv);

  if (!headers?.length) {
    return [];
  }

  return rows.map((row) => {
    const entry = headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = row[index] ?? '';
      return acc;
    }, {});

    return {
      id: entry.id ?? '',
      type: entry.type ?? '',
      name: entry.name ?? '',
      locationKey: entry.locationKey ?? '',
      lat: entry.lat ?? '',
      lng: entry.lng ?? '',
      ready: entry.ready ?? ''
    };
  });
};

const toNumberOrNull = (value: string): number | null => {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
};

const isReady = (value: string): boolean => {
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === 'да';
};

const mapTypeToCategory = (type: string): ResortItem['category'] => {
  if (type === 'rescue') return 'rescue_post';
  if (type === 'allowed') return 'permitted_beach';
  return 'resort';
};

const getInfo = (row: GoogleSheetRow, locationLabel: { ru: string; kk: string; en: string }) => {
  if (row.type === 'rescue') {
    return {
      ru: `Данные загружены из опубликованной Google-таблицы. Локация: ${locationLabel.ru}.`,
      kk: `Деректер жарияланған Google-кестеден жүктелді. Орналасуы: ${locationLabel.kk}.`,
      en: `Data loaded from the published Google Sheet. Location: ${locationLabel.en}.`
    };
  }

  if (row.type === 'allowed') {
    return {
      ru: `Официально разрешенная зона купания из Google-таблицы. Локация: ${locationLabel.ru}.`,
      kk: `Google-кестеден алынған ресми рұқсат етілген шомылу аймағы. Орналасуы: ${locationLabel.kk}.`,
      en: `Official permitted swimming area from the Google Sheet. Location: ${locationLabel.en}.`
    };
  }

  return {
    ru: `Зона отдыха из опубликованной Google-таблицы. Локация: ${locationLabel.ru}.`,
    kk: `Жарияланған Google-кестеден алынған демалыс аймағы. Орналасуы: ${locationLabel.kk}.`,
    en: `Recreation zone loaded from the published Google Sheet. Location: ${locationLabel.en}.`
  };
};

const mapRowToItem = (row: GoogleSheetRow): ResortItem | null => {
  if (!row.id || !row.name) {
    return null;
  }

  const locationLabel = locationMap[row.locationKey] ?? locationMap.locBalkhash;
  const category = mapTypeToCategory(row.type);
  const ready = isReady(row.ready);
  const status: ResortItem['status'] = category === 'rescue_post'
    ? ready ? 'active' : 'not_ready'
    : ready ? 'ready' : 'not_ready';
  const info = getInfo(row, locationLabel);

  return {
    id: `sheet-${row.id}`,
    region: locationLabel.region,
    category,
    nameRu: row.name,
    nameKk: row.name,
    nameEn: row.name,
    lat: toNumberOrNull(row.lat),
    lng: toNumberOrNull(row.lng),
    status,
    infoRu: info.ru,
    infoKk: info.kk,
    infoEn: info.en,
    source: 'google_sheet',
    sourceId: row.id,
    locationKey: row.locationKey
  };
};

export const parseGoogleSheetCsv = (csv: string): ResortItem[] => {
  return rowsToObjects(csv)
    .map(mapRowToItem)
    .filter((item): item is ResortItem => Boolean(item));
};

export const fetchGoogleSheetItems = async (): Promise<ResortItem[]> => {
  const response = await fetch(GOOGLE_SHEET_CSV_URL, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Google Sheet request failed: ${response.status}`);
  }

  const csv = await response.text();
  const items = parseGoogleSheetCsv(csv);

  if (!items.length) {
    throw new Error('Google Sheet returned no valid rows');
  }

  return items;
};