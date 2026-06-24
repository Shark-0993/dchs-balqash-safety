export type RegionKey = 'balkhash' | 'torangalyk' | 'chubar_tyubek' | 'priozersk';

export interface ResortItem {
  id: string;
  region: RegionKey;
  category: 'resort' | 'permitted_beach' | 'prohibited_zone' | 'rescue_post';
  nameRu: string;
  nameKk: string;
  nameEn: string;
  lat: number | null;
  lng: number | null;
  status: 'ready' | 'not_ready' | 'danger' | 'active';
  deficienciesRu?: string;
  deficienciesKk?: string;
  deficienciesEn?: string;
  infoRu?: string;
  infoKk?: string;
  infoEn?: string;
  source?: 'google_sheet' | 'static' | 'user_report';
  sourceId?: string;
  locationKey?: string;
}

// Full database of Lake Balkhash Portal
export const BALKHASH_PORTAL_DB: ResortItem[] = [
  // --- REGION: BALKHASH CITY ---
  { id: "b1", region: "balkhash", category: "resort", nameRu: "«Барковское»", nameKk: "«Барковское»", nameEn: "Barkovskoye", lat: 46.814297, lng: 75.005188, status: "ready" },
  { id: "b2", region: "balkhash", category: "resort", nameRu: "«Самал»", nameKk: "«Самал»", nameEn: "Samal", lat: 46.813643, lng: 75.006147, status: "ready" },
  { id: "b3", region: "balkhash", category: "resort", nameRu: "«Жемчужина»", nameKk: "«Жемчужина»", nameEn: "Zhemchuzhina", lat: 46.811419, lng: 75.009443, status: "ready" },
  { id: "b4", region: "balkhash", category: "resort", nameRu: "«Нурбакыт»", nameKk: "«Нұрбақыт»", nameEn: "Nurbakyt", lat: 46.814362, lng: 75.004497, status: "ready" },
  { id: "b5", region: "balkhash", category: "resort", nameRu: "«Фламинго»", nameKk: "«Фламинго»", nameEn: "Flamingo", lat: 46.790251, lng: 74.981478, status: "ready" },
  { id: "b6", region: "balkhash", category: "resort", nameRu: "«Лазурный берег»", nameKk: "«Лазурный берег»", nameEn: "Lazurny Bereg", lat: 46.813660, lng: 75.005700, status: "ready" },
  { id: "b7", region: "balkhash", category: "resort", nameRu: "«Big Ben»", nameKk: "«Big Ben»", nameEn: "Big Ben", lat: null, lng: null, status: "not_ready", deficienciesRu: "Отсутствует акт обследования дна", deficienciesKk: "Су түбін тексеру актісі жоқ", deficienciesEn: "Bottom survey certificate missing" },
  { id: "b8", region: "balkhash", category: "resort", nameRu: "«Санторини»", nameKk: "«Санторини»", nameEn: "Santorini", lat: 46.794616, lng: 75.006119, status: "ready" },
  { id: "b9", region: "balkhash", category: "resort", nameRu: "«Оазис»", nameKk: "«Оазис»", nameEn: "Oasis", lat: 46.814908, lng: 75.005843, status: "ready" },
  { id: "b10", region: "balkhash", category: "resort", nameRu: "«ИРС»", nameKk: "«ИРС»", nameEn: "IRS", lat: 46.795650, lng: 74.930693, status: "ready" },
  { id: "b11", region: "balkhash", category: "resort", nameRu: "«Маяк»", nameKk: "«Маяк»", nameEn: "Mayak", lat: 46.803044, lng: 75.010799, status: "ready" },
  { id: "b12", region: "balkhash", category: "resort", nameRu: "«Лафа»", nameKk: "«Лафа»", nameEn: "Lafa", lat: 46.811259, lng: 75.007161, status: "ready" },
  { id: "b13", region: "balkhash", category: "resort", nameRu: "«Green Village»", nameKk: "«Green Village»", nameEn: "Green Village", lat: 46.811858, lng: 75.006601, status: "ready" },
  { id: "b14", region: "balkhash", category: "resort", nameRu: "«Шагала»", nameKk: "«Шағала»", nameEn: "Shagala", lat: 46.782890, lng: 74.978534, status: "ready" },
  { id: "b15", region: "balkhash", category: "resort", nameRu: "«Riviera»", nameKk: "«Riviera»", nameEn: "Riviera", lat: 46.792543, lng: 75.001274, status: "ready" },
  { id: "b16", region: "balkhash", category: "resort", nameRu: "«Волна»", nameKk: "«Волна»", nameEn: "Volna", lat: 46.811518, lng: 75.006973, status: "ready" },
  { id: "b17", region: "balkhash", category: "resort", nameRu: "«Долина отдыха»", nameKk: "«Долина отдыха»", nameEn: "Dolina Otdykha", lat: 46.811697, lng: 75.006766, status: "ready" },
  { id: "b18", region: "balkhash", category: "resort", nameRu: "«Балхаш»", nameKk: "«Балқаш»", nameEn: "Balkhash", lat: 46.832306, lng: 74.984585, status: "ready" },

  // --- REGION: TORANGALYK VILLAGE ---
  { id: "t1", region: "torangalyk", category: "resort", nameRu: "«Сказка»", nameKk: "«Сказка»", nameEn: "Skazka", lat: 46.767885, lng: 74.843097, status: "ready" },
  { id: "t2", region: "torangalyk", category: "resort", nameRu: "«Релакс»", nameKk: "«Релакс»", nameEn: "Relax", lat: 46.765637, lng: 74.832529, status: "ready", infoRu: "Проведено обследование дна ОСО", infoKk: "ОСО су түбін тексеру жұмыстарын жүргізді", infoEn: "Bottom survey conducted by Emergency Rescue Department" },
  { id: "t3", region: "torangalyk", category: "resort", nameRu: "«ДосStar»", nameKk: "«ДосStar»", nameEn: "DosStar", lat: 46.769674, lng: 74.839730, status: "ready" },
  { id: "t4", region: "torangalyk", category: "resort", nameRu: "«Family»", nameKk: "«Family»", nameEn: "Family", lat: null, lng: null, status: "not_ready", deficienciesRu: "Дно водоема не обследовано", deficienciesKk: "Су қоймасының түбі тексерілмеген", deficienciesEn: "Water body bottom is not inspected" },
  { id: "t5", region: "torangalyk", category: "resort", nameRu: "«Aqua crystal»", nameKk: "«Aqua crystal»", nameEn: "Aqua crystal", lat: 46.768671, lng: 74.838922, status: "ready" },
  { id: "t6", region: "torangalyk", category: "resort", nameRu: "«Фламинго»", nameKk: "«Фламинго»", nameEn: "Flamingo", lat: 46.769674, lng: 74.839730, status: "ready" },
  { id: "t7", region: "torangalyk", category: "resort", nameRu: "«Ласточкино гнездо»", nameKk: "«Қарлығаш ұясы»", nameEn: "Lastochkino Gnezdo", lat: 46.760462, lng: 74.830922, status: "ready" },
  { id: "t8", region: "torangalyk", category: "resort", nameRu: "«Пегас»", nameKk: "«Пегас»", nameEn: "Pegas", lat: 46.768496, lng: 74.834093, status: "ready" },
  { id: "t9", region: "torangalyk", category: "resort", nameRu: "«Мырза»", nameKk: "«Мырза»", nameEn: "Myrza", lat: 46.767779, lng: 74.833863, status: "ready" },
  { id: "t10", region: "torangalyk", category: "resort", nameRu: "«Тулпар»", nameKk: "«Тұлпар»", nameEn: "Tulpar", lat: 46.763342, lng: 74.823911, status: "ready" },
  { id: "t11", region: "torangalyk", category: "resort", nameRu: "«Фортуна»", nameKk: "«Фортуна»", nameEn: "Fortuna", lat: 46.767514, lng: 74.844010, status: "ready" },
  { id: "t12", region: "torangalyk", category: "resort", nameRu: "«Найзатас»", nameKk: "«Найзатас»", nameEn: "Nayzatas", lat: 46.769335, lng: 74.838104, status: "ready" },
  { id: "t13", region: "torangalyk", category: "resort", nameRu: "«Бриз»", nameKk: "«Бриз»", nameEn: "Breeze", lat: null, lng: null, status: "not_ready", deficienciesRu: "Отсутствуют средства спасения и спасатели", deficienciesKk: "Құтқару құралдары мен құтқарушылар жоқ", deficienciesEn: "Missing rescue gear and lifeguards" },
  { id: "t14", region: "torangalyk", category: "resort", nameRu: "«Жагажай»", nameKk: "«Жағажай»", nameEn: "Zhagazhay", lat: null, lng: null, status: "not_ready", deficienciesRu: "Акт обследования дна просрочен", deficienciesKk: "Су түбін тексеру актісінің мерзімі өтіп кеткен", deficienciesEn: "Bottom survey certificate has expired" },
  { id: "t15", region: "torangalyk", category: "resort", nameRu: "«Айналайын»", nameKk: "«Айналайын»", nameEn: "Ainalayin", lat: null, lng: null, status: "not_ready", deficienciesRu: "Не укомплектован спасательный пост", deficienciesKk: "Құтқару бекеті жасақталмаған", deficienciesEn: "Lifeguard station is not equipped" },
  { id: "t16", region: "torangalyk", category: "resort", nameRu: "«Алма»", nameKk: "«Алма»", nameEn: "Alma", lat: null, lng: null, status: "not_ready", deficienciesRu: "Отсутствует буйковое ограждение пляжа", deficienciesKk: "Жағажайдағы қалтқы қоршаулары жоқ", deficienciesEn: "No buoy markings for swimming limits" },
  { id: "t17", region: "torangalyk", category: "resort", nameRu: "«Мерей»", nameKk: "«Мерей»", nameEn: "Merey", lat: 46.762549, lng: 74.820384, status: "ready" },
  { id: "t18", region: "torangalyk", category: "resort", nameRu: "«Айгерим»", nameKk: "«Әйгерім»", nameEn: "Aigerim", lat: 46.769717, lng: 74.840428, status: "ready" },
  { id: "t19", region: "torangalyk", category: "resort", nameRu: "«BAI house»", nameKk: "«BAI house»", nameEn: "BAI house", lat: 46.768496, lng: 74.834093, status: "ready" },
  { id: "t20", region: "torangalyk", category: "resort", nameRu: "«Вояж»", nameKk: "«Вояж»", nameEn: "Voyage", lat: 46.766168, lng: 74.832984, status: "ready" },
  { id: "t21", region: "torangalyk", category: "resort", nameRu: "«Океан»", nameKk: "«Мұхит»", nameEn: "Ocean", lat: 46.766668, lng: 74.833742, status: "ready" },

  // --- REGION: CHUBAR-TYUBEK VILLAGE ---
  { id: "c1", region: "chubar_tyubek", category: "resort", nameRu: "«Досжан»", nameKk: "«Досжан»", nameEn: "Doszhan", lat: 46.775340, lng: 74.708678, status: "ready" },
  { id: "c2", region: "chubar_tyubek", category: "resort", nameRu: "«Көктем»", nameKk: "«Көктем»", nameEn: "Koktem", lat: 46.775418, lng: 74.713049, status: "ready" },
  { id: "c3", region: "chubar_tyubek", category: "resort", nameRu: "«Голубая Лагуна»", nameKk: "«Көгілдір лагуна»", nameEn: "Blue Lagoon", lat: 46.775297, lng: 74.707609, status: "ready" },
  { id: "c4", region: "chubar_tyubek", category: "resort", nameRu: "«Алтын Құм»", nameKk: "«Алтын Құм»", nameEn: "Altyn Kum", lat: 46.773647, lng: 74.703168, status: "ready" },
  { id: "c5", region: "chubar_tyubek", category: "resort", nameRu: "«Риф»", nameKk: "«Риф»", nameEn: "Reef", lat: 46.775138, lng: 74.718133, status: "ready" },
  { id: "c6", region: "chubar_tyubek", category: "resort", nameRu: "«Шалкар»", nameKk: "«Шалқар»", nameEn: "Shalkar", lat: null, lng: null, status: "not_ready", deficienciesRu: "Отсутствует спасательное снаряжение", deficienciesKk: "Құтқару жабдықтары жоқ", deficienciesEn: "No safety/rescue equipment available" },
  { id: "c7", region: "chubar_tyubek", category: "resort", nameRu: "«Алладин»", nameKk: "«Алладин»", nameEn: "Aladdin", lat: null, lng: null, status: "not_ready", deficienciesRu: "Дно пляжа засорено посторонними предметами", deficienciesKk: "Жағажай түбі бөгде заттармен қоқысталған", deficienciesEn: "Beach bottom is littered with debris" },
  { id: "c8", region: "chubar_tyubek", category: "resort", nameRu: "«Балхаш»", nameKk: "«Балқаш»", nameEn: "Balkhash", lat: 46.775252, lng: 74.707067, status: "ready" },
  { id: "c9", region: "chubar_tyubek", category: "resort", nameRu: "«Аквамарин 1»", nameKk: "«Аквамарин 1»", nameEn: "Aquamarine 1", lat: 46.775050, lng: 74.705444, status: "ready" },
  { id: "c10", region: "chubar_tyubek", category: "resort", nameRu: "«Аквамарин 2»", nameKk: "«Аквамарин 2»", nameEn: "Aquamarine 2", lat: 46.775368, lng: 74.705678, status: "ready" },
  { id: "c11", region: "chubar_tyubek", category: "resort", nameRu: "«Аквамарин 3»", nameKk: "«Аквамарин 3»", nameEn: "Aquamarine 3", lat: 46.775050, lng: 74.705444, status: "ready" },
  { id: "c12", region: "chubar_tyubek", category: "resort", nameRu: "«Андромеда»", nameKk: "«Андромеда»", nameEn: "Andromeda", lat: 46.774110, lng: 74.700230, status: "ready" },
  { id: "c13", region: "chubar_tyubek", category: "resort", nameRu: "«Тропикано»", nameKk: "«Тропикано»", nameEn: "Tropicano", lat: 46.775162, lng: 74.704342, status: "ready" },
  { id: "c14", region: "chubar_tyubek", category: "resort", nameRu: "«Карагандинка»", nameKk: "«Қарағандылық»", nameEn: "Karagandinka", lat: 46.775603, lng: 74.716364, status: "ready" },
  { id: "c15", region: "chubar_tyubek", category: "resort", nameRu: "«Палладин»", nameKk: "«Палладин»", nameEn: "Palladin", lat: 46.774877, lng: 74.702507, status: "ready" },
  { id: "c16", region: "chubar_tyubek", category: "resort", nameRu: "«Дом 2»", nameKk: "«Үй 2»", nameEn: "House 2", lat: null, lng: null, status: "not_ready", deficienciesRu: "Отсутствует дежурный медицинский пункт", deficienciesKk: "Кезекші медициналық пункт жоқ", deficienciesEn: "No duty medical station on site" },
  { id: "c17", region: "chubar_tyubek", category: "resort", nameRu: "«Жемчужина»", nameKk: "«Жемчужина»", nameEn: "Zhemchuzhina", lat: 46.774932, lng: 74.706616, status: "ready" },
  { id: "c18", region: "chubar_tyubek", category: "resort", nameRu: "«Милана»", nameKk: "«Милана»", nameEn: "Milana", lat: 46.774732, lng: 74.704667, status: "ready" },
  { id: "c19", region: "chubar_tyubek", category: "resort", nameRu: "«Pacific»", nameKk: "«Пасифик»", nameEn: "Pacific", lat: 46.775297, lng: 74.707609, status: "ready" },
  { id: "c20", region: "chubar_tyubek", category: "resort", nameRu: "«Респект»", nameKk: "«Респект»", nameEn: "Respect", lat: null, lng: null, status: "not_ready", deficienciesRu: "Отсутствуют знаки безопасности на воде", deficienciesKk: "Судағы қауіпсіздік белгілері жоқ", deficienciesEn: "No water safety warning signs" },
  { id: "c21", region: "chubar_tyubek", category: "resort", nameRu: "Дом отдыха «Хутор»", nameKk: "«Хутор» демалыс үйі", nameEn: "Khutor Guest House", lat: 46.772611, lng: 74.696898, status: "ready" },

  // --- EXTRA: RESCUE POSTS ---
  { id: "rp1", region: "balkhash", category: "rescue_post", nameRu: "Центральная Водно-Спасательная Станция МЧС", nameKk: "МЧС орталық судан құтқару станциясы", nameEn: "Central Water Rescue Station (CES)", lat: 46.799434, lng: 74.986214, status: "active", infoRu: "Круглосуточное дежурство, спасательные катера, водолазная группа.", infoKk: "Тәулік бойы кезекшілік, құтқару қайықтары, сүңгуірлер тобы.", infoEn: "24/7 duty, rescue boats, diving group." },
  { id: "rp2", region: "torangalyk", category: "rescue_post", nameRu: "Опорный мобильный спасательный пост Торангалык", nameKk: "Торанғалық тірек мобильді құтқару бекеті", nameEn: "Torangalyk Mobile Rescue Post", lat: 46.766345, lng: 74.831512, status: "active", infoRu: "Сезонный пост МЧС. Патрулирование береговой линии.", infoKk: "Маусымдық МЧС бекеті. Жағалау сызығын патрульдеу.", infoEn: "Seasonal emergency response post. Coastline patrolling." },
  { id: "rp3", region: "chubar_tyubek", category: "rescue_post", nameRu: "Сезонный пост спасателей Чубар-Тюбек", nameKk: "Шұбар-Түбек маусымдық құтқарушылар бекеті", nameEn: "Chubar-Tyubek Seasonal Lifeguard Post", lat: 46.774523, lng: 74.704123, status: "active", infoRu: "Аварийно-спасательный отряд. Первая помощь.", infoKk: "Апаттық-құтқару жасағы. Алғашқы көмек.", infoEn: "Rescue squad. First aid station." },

  // --- EXTRA: PROHIBITED DANGEROUS PUBLIC BEACHES ---
  { id: "pz1", region: "balkhash", category: "prohibited_zone", nameRu: "Зона водозабора ТЭЦ (Техническая зона)", nameKk: "ЖЭО су жинау аймағы (Техникалық аймақ)", nameEn: "CHP Water Intake Area (Technical Zone)", lat: 46.842345, lng: 74.965432, status: "danger", infoRu: "Сильное подводное течение, водовороты, техническое оборудование. Купание смертельно опасно!", infoKk: "Күшті су асты ағысы, иірімдер, техникалық жабдықтар. Шомылу өте қауіпті!", infoEn: "Strong undercurrents, whirlpools, technical machinery. Swimming is strictly prohibited!" },
  { id: "pz2", region: "torangalyk", category: "prohibited_zone", nameRu: "Дикий пляж у скалистого мыса", nameKk: "Жартасты мүйістегі жабайы жағажай", nameEn: "Wild Beach at Rocky Cape", lat: 46.758412, lng: 74.815342, status: "danger", infoRu: "Резкие перепады глубин, острые подводные камни, спасатели отсутствуют.", infoKk: "Тереңдіктің күрт өзгеруі, өткір су асты тастары, құтқарушылар жоқ.", infoEn: "Sudden depth drops, sharp underwater rocks, no lifeguard coverage." },
  { id: "pz3", region: "chubar_tyubek", category: "prohibited_zone", nameRu: "Затопленный карьерный берег", nameKk: "Су басқан карьер жағасы", nameEn: "Flooded Quarry Bank", lat: 46.781211, lng: 74.685412, status: "danger", infoRu: "Оползневая зона, необследованное дно с арматурой, глубина более 10 метров.", infoKk: "Көшкін аймағы, арматурасы бар зерттелмеген түбі, тереңдігі 10 метрден асады.", infoEn: "Landslide zone, uninspected bottom with metal debris, depth exceeds 10m." }
];

export const translations = {
  kk: {
    title: "Балқаш Қауіпсіздігі",
    subtitle: "Шомылу аймақтары мен құтқару бекеттерінің мемлекеттік мониторинг жүйесі",
    rulesTitle: "Судағы қауіпсіздік ережелері және Балқаш көліндегі мінез-құлық кодексі",
    agreeBtn: "Түсіндім және шарттарды қабылдаймын",
    rules: [
      "Тек рұқсат етілген, түбі тексерілген жағажайларда ғана шомылыңыз.",
      "Су маңында балаларды үнемі және бақылаусыз қалдырмай қадағалаңыз.",
      "Суға түсу алдында немесе шомылу кезінде алкогольдік ішімдіктерді ішуге қатаң тыйым салынады.",
      "Кенеттен соғатын оффшорлық желдер мен ауа райының өзгеруінен сақ болыңыз.",
      "Белгісіз немесе тексерілмеген жерлерде ешқашан суға секірмеңіз."
    ],
    emergencyCall: "112 Шұғыл қызмет",
    navRegions: {
      balkhash: "Балқаш қаласы",
      torangalyk: "Торанғалық ауылы",
      chubar_tyubek: "Шұбар-Түбек ауылы",
      priozersk: "Приозерск қаласы"
    },
    navCategories: {
      permitted: "Рұқсат етілген орындар",
      prohibited: "Тыйым салынған аймақтар",
      rescue: "Құтқару бекеттері",
      resorts: "Демалыс аймақтары"
    },
    searchPlaceholder: "Атауы немесе кемшіліктері бойынша іздеу...",
    statusLabel: "Мәртебесі",
    statusReady: "Тексерілген / Шомылуға рұқсат етілген",
    statusNotReady: "Дайын емес / Кемшіліктер анықталды",
    statusDanger: "Қауіпті / Шомылуға тыйым салынған",
    statusActive: "Белсенді кезекшілік",
    deficiencies: "Анықталған кемшіліктер",
    info: "Қосымша ақпарат",
    routeBtn: "Маршрут құру",
    noRoute: "Маршрут қолжетімді емес (координаталары жоқ)",
    weatherTitle: "Ағымдағы су және ауа райы жағдайы",
    waterTemp: "Су температурасы",
    windSpeed: "Жел жылдамдығы",
    waveHeight: "Толқын биіктігі",
    safetyFlag: "Қауіпсіздік туы",
    flagGreen: "Жасыл (Қауіпсіз, шомылуға болады)",
    flagYellow: "Сары (Сақ болыңыз, жеңіл толқын)",
    flagRed: "Қызыл (Қауіпті, суға түсуге тыйым салынады)",
    quizTitle: "Қауіпсіздік сынағы: Балқашқа дайынсыз ба?",
    quizSub: "5 сұраққа жауап беріп, цифрлық қауіпсіздік сертификатын алыңыз!",
    quizPass: "Құттықтаймыз! Сынақтан сәтті өттіңіз. Балқаш көліндегі су қауіпсіздігі сертификаты сізге берілді.",
    quizFail: "Сынақтан өте алмадыңыз. Қауіпсіздік ережелерін қайталап көріңіз.",
    certTitle: "СУ ҚАУІПСІЗДІГІ СЕРТИФИКАТЫ",
    certDesc: "Балқаш көлінде қауіпсіз шомылу бойынша білім деңгейін растайды",
    reportTitle: "Су нысанындағы қауіп туралы хабарлау",
    reportDesc: "Егер сіз бұзушылықты немесе қауіпті жағдайды байқасаңыз, шұғыл хабарлама жіберіңіз",
    reportName: "Сіздің атыңыз",
    reportLoc: "Орналасқан жері / База атауы",
    reportMsg: "Хабарлама сипаттамасы (буйлардың болмауы, қоқыс және т.б.)",
    reportSubmit: "Хабарламаны жіберу",
    reportSuccess: "Рахмет! Мәліметтер төтенше жағдайлар қызметіне (ТЖД) жіберілді.",
    credits: "Балқаш су қауіпсіздігі порталы. ТЖД қолдауымен әзірленген.",
    statsTotal: "Барлығы тіркелген",
    statsReadyCount: "Шомылуға рұқсат",
    statsUninspected: "Тексерілмеген / Кемшіліктері бар",
    filterResultCount: "Нәтиже табылды: {{count}} нысан",
    interactiveMapTitle: "Интерактивті рельефтік су картасы",
    clickMarkerMsg: "Нысан мәліметтерін көру үшін маркерді таңдаңыз",
    rulesCheckRequired: "Мен жоғарыда аталған қауіпсіздік ережелерімен таныстым және оларды бұлжытпай орындауға міндеттенемін.",
    simulateWeather: "Ауа райын имитациялау",
    weatherCalm: "Штиль (Қалыпты)",
    weatherWindy: "Қатты жел (Сары деңгей)",
    weatherStorm: "Дауыл (Қызыл деңгей)",
    firstAidTitle: "Жедел алғашқы көмек көрсету нұсқаулығы",
    cprStep1: "1. Жәбірленушіні судан шығарып, тегіс бетке жатқызыңыз.",
    cprStep2: "2. Дем алысын және тамыр соғысын тексеріңіз.",
    cprStep3: "3. 112 шұғыл қызметін шақырыңыз немесе біреуден көмек сұраңыз.",
    cprStep4: "4. Көкірек қуысын 30 рет басып, 2 рет жасанды дем беріңіз (30:2).",
    cprStep5: "5. Жедел жәрдем жеткенше немесе жәбірленуші есін жиғанша жалғастырыңыз."
  },
  ru: {
    title: "Безопасность Балхаша",
    subtitle: "Государственная мониторинговая система пляжных зон и спасательных постов",
    rulesTitle: "Правила безопасности на воде и кодекс поведения на озере Балхаш",
    agreeBtn: "Я согласен и принимаю условия",
    rules: [
      "Купайтесь только на разрешенных, прошедших проверку дна пляжах.",
      "Обеспечьте постоянный контроль детей вблизи воды без отвлечения внимания.",
      "Категорически запрещено употребление алкоголя до и во время купания.",
      "Опасайтесь внезапных отжимных ветров и резкого изменения погоды.",
      "Никогда не ныряйте в неизвестных и необследованных местах."
    ],
    emergencyCall: "112 Экстренный вызов",
    navRegions: {
      balkhash: "г. Балхаш",
      torangalyk: "пос. Торангалык",
      chubar_tyubek: "пос. Чубар-Тюбек",
      priozersk: "г. Приозерск"
    },
    navCategories: {
      permitted: "Разрешенные места",
      prohibited: "Запрещенные места",
      rescue: "Спасательные посты",
      resorts: "Зоны отдыха"
    },
    searchPlaceholder: "Поиск по названию или дефектам...",
    statusLabel: "Статус готовности",
    statusReady: "Проверено / Разрешено для купания",
    statusNotReady: "Не готово / Выявлены нарушения",
    statusDanger: "Опасно / Купание запрещено",
    statusActive: "Активное дежурство",
    deficiencies: "Выявленные нарушения",
    info: "Дополнительная информация",
    routeBtn: "Проложить маршрут",
    noRoute: "Маршрут недоступен (нет координат)",
    weatherTitle: "Текущие водные и погодные условия",
    waterTemp: "Температура воды",
    windSpeed: "Скорость ветра",
    waveHeight: "Высота волн",
    safetyFlag: "Флаг безопасности",
    flagGreen: "Зеленый (Безопасно, купание разрешено)",
    flagYellow: "Желтый (Внимание, небольшое волнение)",
    flagRed: "Красный (Опасно, купание категорически запрещено)",
    quizTitle: "Тест безопасности: Готовы ли вы к Балхашу?",
    quizSub: "Ответьте на 5 вопросов и получите цифровой сертификат безопасности!",
    quizPass: "Поздравляем! Вы успешно прошли тест. Сертификат безопасного поведения на озере Балхаш активирован.",
    quizFail: "К сожалению, вы допустили ошибки. Пожалуйста, повторите правила безопасности.",
    certTitle: "СЕРТИФИКАТ БЕЗОПАСНОСТИ НА ВОДЕ",
    certDesc: "Подтверждает знание правил безопасного нахождения на озере Балхаш",
    reportTitle: "Сообщить об угрозе или нарушении",
    reportDesc: "Если вы заметили отсутствие буйков, спасателей или мусор в воде, отправьте отчет",
    reportName: "Ваше имя",
    reportLoc: "Местоположение / Название базы",
    reportMsg: "Описание нарушения (нет спасателей, мусор, арматура в воде и т.д.)",
    reportSubmit: "Отправить отчет",
    reportSuccess: "Спасибо! Данные переданы дежурному инспектору ДЧС.",
    credits: "Портал безопасности на озере Балхаш. Разработано при поддержке МЧС РК.",
    statsTotal: "Всего объектов",
    statsReadyCount: "Разрешено купаться",
    statsUninspected: "Не проверено / С дефектами",
    filterResultCount: "Найдено результатов: {{count}}",
    interactiveMapTitle: "Интерактивная рельефная карта глубин",
    clickMarkerMsg: "Выберите маркер, чтобы просмотреть сведения об объекте",
    rulesCheckRequired: "Я подтверждаю, что ознакомлен с вышеуказанными правилами безопасности и обязуюсь их соблюдать.",
    simulateWeather: "Имитировать погоду",
    weatherCalm: "Штиль (Зеленый флаг)",
    weatherWindy: "Сильный ветер (Желтый флаг)",
    weatherStorm: "Штормовое предупреждение (Красный флаг)",
    firstAidTitle: "Инструкция экстренной первой помощи",
    cprStep1: "1. Извлеките пострадавшего из воды и уложите на твердую поверхность.",
    cprStep2: "2. Проверьте дыхание и пульс.",
    cprStep3: "3. Вызовите спасателей по телефону 112 или попросите окружающих.",
    cprStep4: "4. Проведите 30 нажатий на грудную клетку и 2 искусственных вдоха (30:2).",
    cprStep5: "5. Продолжайте реанимацию до приезда скорой помощи или восстановления дыхания."
  },
  en: {
    title: "Balkhash Safety",
    subtitle: "State monitoring portal for designated beaches and rescue services",
    rulesTitle: "Water Safety Rules & Code of Conduct on Lake Balkhash",
    agreeBtn: "I Agree and Accept the Terms",
    rules: [
      "Swim only in designated, safety-inspected beaches.",
      "Constant parental monitoring of children near the water is mandatory.",
      "Strict prohibition of alcohol consumption before or during swimming.",
      "Beware of sudden offshore winds and changing weather conditions.",
      "Never dive in unknown or uninspected areas."
    ],
    emergencyCall: "112 Emergency Call",
    navRegions: {
      balkhash: "Balkhash City",
      torangalyk: "Torangalyk Village",
      chubar_tyubek: "Chubar-Tyubek Village",
      priozersk: "Priozersk City"
    },
    navCategories: {
      permitted: "Permitted Zones",
      prohibited: "Prohibited Zones",
      rescue: "Rescue Posts",
      resorts: "Recreation Zones"
    },
    searchPlaceholder: "Search by name or deficiencies...",
    statusLabel: "Safety Status",
    statusReady: "Inspected / Safe for Swimming",
    statusNotReady: "Unready / Deficiencies Found",
    statusDanger: "Danger / Swimming Prohibited",
    statusActive: "Active Rescue Post",
    deficiencies: "Identified Deficiencies",
    info: "Additional Information",
    routeBtn: "Navigate / Route",
    noRoute: "Route unavailable (no coordinates)",
    weatherTitle: "Current Water & Weather Conditions",
    waterTemp: "Water Temperature",
    windSpeed: "Wind Speed",
    waveHeight: "Wave Height",
    safetyFlag: "Safety Flag",
    flagGreen: "Green (Safe, swimming allowed)",
    flagYellow: "Yellow (Caution, mild waves)",
    flagRed: "Red (Danger, swimming strictly prohibited)",
    quizTitle: "Safety Quiz: Are you ready for Balkhash?",
    quizSub: "Answer 5 safety questions to earn a digital Safety Swimmer Certificate!",
    quizPass: "Congratulations! You passed the test. Your Lake Balkhash Safe Swimmer Certificate is now active.",
    quizFail: "You missed some questions. Please review the safety code of conduct.",
    certTitle: "WATER SAFETY SWIMMING CERTIFICATE",
    certDesc: "Confirms solid knowledge of water safety rules at Lake Balkhash",
    reportTitle: "Report a Hazard or Violation",
    reportDesc: "If you spot missing safety buoys, trash, or uninspected beaches, report them immediately",
    reportName: "Your Name",
    reportLoc: "Location / Resort Name",
    reportMsg: "Description of issue (no lifebuoys, underwater debris, etc.)",
    reportSubmit: "Submit Report",
    reportSuccess: "Thank you! The report was successfully dispatched to DES duty inspectors.",
    credits: "Lake Balkhash Safety Portal. Supported by the Emergency Situations Department of Kazakhstan.",
    statsTotal: "Total Objects Registered",
    statsReadyCount: "Permitted Beaches",
    statsUninspected: "Uninspected / Deficient",
    filterResultCount: "Found {{count}} records",
    interactiveMapTitle: "Interactive Depth & Location Map",
    clickMarkerMsg: "Select a marker to see detailed resort status",
    rulesCheckRequired: "I confirm that I have read the safety rules above and commit to follow them strictly.",
    simulateWeather: "Simulate Weather",
    weatherCalm: "Calm Water (Green Flag)",
    weatherWindy: "Strong Wind (Yellow Flag)",
    weatherStorm: "Severe Storm (Red Flag)",
    firstAidTitle: "Emergency First Aid Guide",
    cprStep1: "1. Remove victim from water and lay them flat on a firm surface.",
    cprStep2: "2. Check for responsiveness, breathing and pulse.",
    cprStep3: "3. Call 112 or delegate someone to call emergency services.",
    cprStep4: "4. Perform 30 chest compressions and 2 rescue breaths (30:2 cycle).",
    cprStep5: "5. Continue CPR until emergency personnel arrives or victim recovers."
  }
};

export const QUIZ_QUESTIONS = [
  {
    questionKk: "Балқаш көлінде қандай орындарда шомылуға рұқсат етіледі?",
    questionRu: "В каких местах разрешено купание на озере Балхаш?",
    questionEn: "Where is swimming officially permitted at Lake Balkhash?",
    optionsKk: [
      "Кез келген жабайы жағажайда",
      "Тек МЧС тексеруінен өткен және түбі тазартылған жағажайларда",
      "Су сору станциялары мен су өткізгіштердің маңында"
    ],
    optionsRu: [
      "На любом диком пляже, где меньше людей",
      "Исключительно на оборудованных пляжах, прошедших проверку дна водолазами",
      "Вблизи гидротехнических сооружений и водозаборов"
    ],
    optionsEn: [
      "At any wild beach where there are fewer people",
      "Strictly on designated beaches that have undergone professional bottom inspections",
      "Near water intakes and technical hydraulic stations"
    ],
    correctAnswer: 1
  },
  {
    questionKk: "Көлде қатты оффшорлық (жағадан соғатын) жел басталса не істеу керек?",
    questionRu: "Что необходимо предпринять, если на озере начался сильный отжимной ветер (дующий от берега)?",
    questionEn: "What should you do if a strong offshore wind starts blowing (from the shore to the lake)?",
    optionsKk: [
      "Үрлемелі матраспен алысқа жүзіп кету",
      "Тезірек судан шығып, жағалауға оралу",
      "Желдің басылуын күтіп, тереңде қала беру"
    ],
    optionsRu: [
      "Плыть на надувном матрасе подальше, чтобы поймать волну",
      "Немедленно выйти из воды и вернуться на сушу, избегая использования надувных плавсредств",
      "Ждать в воде на глубине, пока ветер утихнет"
    ],
    optionsEn: [
      "Float further out on an inflatable mattress to ride the waves",
      "Immediately exit the water, head to shore, and avoid using light inflatable items",
      "Stay in deep water and wait for the wind to drop"
    ],
    correctAnswer: 1
  },
  {
    questionKk: "Балалардың су маңындағы қауіпсіздігіне кім жауапты?",
    questionRu: "Кто несет главную ответственность за безопасность детей у воды?",
    questionEn: "Who is primarily responsible for child safety near the water?",
    optionsKk: [
      "Жағажайдағы басқа демалушылар",
      "Балалар өздігінен жауап береді",
      "Ата-аналар (немесе еріп жүруші ересектер) үнемі қадағалау арқылы"
    ],
    optionsRu: [
      "Другие отдыхающие на пляже",
      "Дети сами должны следить за собой",
      "Родители или сопровождающие взрослые посредством непрерывного визуального контроля"
    ],
    optionsEn: [
      "Other beachgoers and tourists nearby",
      "Children themselves are old enough to handle it",
      "Parents or accompanying adults through constant, undistracted visual monitoring"
    ],
    correctAnswer: 2
  },
  {
    questionKk: "Суға түсер алдында алкоголь ішуге неге тыйым салынады?",
    questionRu: "Почему категорически запрещено употребление алкоголя перед купанием?",
    questionEn: "Why is alcohol consumption strictly prohibited before swimming?",
    optionsKk: [
      "Ол суық тиюден қорғайды",
      "Алкоголь реакцияны нашарлатады, бағдардан адастырады және суға бату қаупін 10 есе арттырады",
      "Ол тек терінің тез күюіне әсер етеді"
    ],
    optionsRu: [
      "Потому что алкоголь помогает дольше согреваться в воде",
      "Алкоголь притупляет инстинкты, нарушает координацию и повышает риск утопления более чем в 10 раз",
      "Это просто формальный запрет, не влияющий на физиологию"
    ],
    optionsEn: [
      "Because alcohol keeps the body warm in cold water",
      "It dulls safety reflexes, impairs coordination, and increases drowning risk more than 10-fold",
      "It is merely a formality and doesn't affect water safety"
    ],
    correctAnswer: 1
  },
  {
    questionKk: "Егер адам суға батып бара жатса, ең бірінші қандай нөмірге хабарласу керек?",
    questionRu: "По какому номеру телефона нужно вызывать экстренную помощь в случае ЧС на воде?",
    questionEn: "Which emergency number should you call immediately in case of a water emergency?",
    optionsKk: [
      "102 (Полиция)",
      "112 (Шұғыл құтқару қызметі)",
      "104 (Газ қызметі)"
    ],
    optionsRu: [
      "102 (Полиция)",
      "112 (Единая служба спасения)",
      "104 (Служба газа)"
    ],
    optionsEn: [
      "102 (Police)",
      "112 (Single Emergency Services)",
      "104 (Gas Leak Hotline)"
    ],
    correctAnswer: 1
  }
];
