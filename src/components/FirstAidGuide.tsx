import React, { useState } from 'react';
import { Activity, ShieldAlert, Heart, Info, Sun, Compass } from 'lucide-react';
import { translations } from '../data/db';

interface FirstAidGuideProps {
  lang: 'kk' | 'ru' | 'en';
}

export const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ lang }) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'cpr' | 'cramp' | 'sunstroke' | 'rip'>('cpr');

  const getGuideContent = () => {
    switch (activeTab) {
      case 'cpr':
        return {
          title: lang === 'kk' ? 'Өкпе-жүрек реанимациясы (ӨЖР)' : lang === 'ru' ? 'Сердечно-легочная реанимация (СЛР)' : 'Cardiopulmonary Resuscitation (CPR)',
          icon: <Heart className="w-6 h-6 text-red-500 animate-pulse" />,
          steps: [
            t.cprStep1,
            t.cprStep2,
            t.cprStep3,
            t.cprStep4,
            t.cprStep5
          ],
          tips: lang === 'kk'
            ? 'Адам есін жиғанша немесе жедел жәрдем келгенше тоқтамаңыз.'
            : lang === 'ru'
            ? 'Не останавливайтесь до приезда медиков или появления признаков жизни.'
            : 'Keep going until professional responders arrive or the victim revives.'
        };
      case 'cramp':
        return {
          title: lang === 'kk' ? 'Судағы бұлшықет құрысуы кезіндегі әрекеттер' : lang === 'ru' ? 'Действия при судорогах в воде' : 'How to Handle Muscle Cramps',
          icon: <Activity className="w-6 h-6 text-orange-500" />,
          steps: [
            lang === 'kk' 
              ? '1. Дүрбелеңге түспеңіз, терең тыныс алып, арқаңызбен су бетіне жатыңыз.' 
              : lang === 'ru' 
              ? '1. Не паникуйте, глубоко вдохните и лягте на спину, чтобы держаться на плаву.' 
              : '1. Do not panic, inhale deeply and float on your back to conserve energy.',
            lang === 'kk'
              ? '2. Егер аяқ бұлшықеті құрысса, аяқтың ұшын өзіңізге қарай қатты тартыңыз.'
              : lang === 'ru'
              ? '2. Если свело икроножную мышцу, сильно потяните носок ноги на себя.'
              : '2. If the calf muscle cramps, pull the toes of your foot firmly towards yourself.',
            lang === 'kk'
              ? '3. Өзіңізбен бірге түйреуіш (булавка) болса, құрысқан тұсты сәл шаншып алыңыз.'
              : lang === 'ru'
              ? '3. Уколите сведенное место булавкой (желательно иметь ее на плавках).'
              : '3. Pinch or prick the cramped muscle (often swimmers carry a safety pin on trunks).',
            lang === 'kk'
              ? '4. Су астындағы суық ағыс немесе термоклиннен тез шығуға тырысыңыз.'
              : lang === 'ru'
              ? '4. Постарайтесь быстрее покинуть зону холодного течения или термоклина.'
              : '4. Try to swim away from the cold water current or thermocline zone immediately.',
            lang === 'kk'
              ? '5. Жағаға қарай қолмен есіп, көмек сұрап айқайлаңыз.'
              : lang === 'ru'
              ? '5. Плывите к берегу, помогая руками, и позовите на помощь.'
              : '5. Swim toward the shore using your arms and shout for assistance.'
          ],
          tips: lang === 'kk'
            ? 'Балқаш суы тереңдікте өте суық болуы мүмкін, бұл құрысудың негізгі себебі.'
            : lang === 'ru'
            ? 'Вода Балхаша на глубине может быть очень холодной, что является основной причиной судорог.'
            : 'Balkhash water can be very cold at deep points, triggering instant muscle cramps.'
        };
      case 'sunstroke':
        return {
          title: lang === 'kk' ? 'Күн өту немесе ыстық соққысы' : lang === 'ru' ? 'Солнечный и тепловой удар' : 'Sunstroke and Heat Exhaustion',
          icon: <Sun className="w-6 h-6 text-amber-500" />,
          steps: [
            lang === 'kk'
              ? '1. Жәбірленушіні дереу көлеңкеге немесе салқын бөлмеге апарыңыз.'
              : lang === 'ru'
              ? '1. Немедленно перенесите пострадавшего в тень или прохладное помещение.'
              : '1. Move the victim immediately into shade or a cool, air-conditioned room.',
            lang === 'kk'
              ? '2. Сыртқы киімдерін шешіп, маңдайы мен денесіне салқын сулы шүберек басыңыз.'
              : lang === 'ru'
              ? '2. Освободите от лишней одежды, положите влажные прохладные компрессы на лоб и тело.'
              : '2. Loosen tight clothes, apply cool wet cloths to the forehead and body.',
            lang === 'kk'
              ? '3. Есі дұрыс болса, салқын суды немесе тұзды ерітіндіні аз-аздан ішкізіңіз.'
              : lang === 'ru'
              ? '3. Если пострадавший в сознании, давайте пить прохладную воду или солевой раствор небольшими глотками.'
              : '3. If the victim is conscious, give small sips of cool water or rehydration fluid.',
            lang === 'kk'
              ? '4. Жәбірленушінің басын сәл көтеріп жатқызыңыз.'
              : lang === 'ru'
              ? '4. Уложите человека с приподнятой головой.'
              : '4. Keep the person lying down with their head slightly elevated.',
            lang === 'kk'
              ? '5. Есінен танса, шұғыл түрде 103 немесе 112 нөміріне қоңырау шалыңыз.'
              : lang === 'ru'
              ? '5. При потере сознания срочно вызывайте скорую помощь 103 или 112.'
              : '5. If unconscious, call 103 or 112 emergency services immediately.'
          ],
          tips: lang === 'kk'
            ? 'Шомылу кезінде әрдайым бас киім киіңіз және суды көп ішіңіз.'
            : lang === 'ru'
            ? 'Всегда носите головной убор во время отдыха на пляже и пейте больше чистой воды.'
            : 'Always wear a sun hat at the beach and stay hydrated.'
        };
      case 'rip':
        return {
          title: lang === 'kk' ? 'Күшті ағыс пен толқынға тап болғанда' : lang === 'ru' ? 'Действия при сильном течении или волнах' : 'Surviving Rip Currents & Waves',
          icon: <Compass className="w-6 h-6 text-sky-500" />,
          steps: [
            lang === 'kk'
              ? '1. Ағысқа қарсы жүзбеңіз — бұл күшті текке сарқиды.'
              : lang === 'ru'
              ? '1. Не пытайтесь плыть против течения — это быстро заберет все ваши силы.'
              : '1. Do not swim directly against the current — it exhausts your energy very fast.',
            lang === 'kk'
              ? '2. Жағалау сызығына параллель, яғни ағыс бұрышымен жүзіңіз.'
              : lang === 'ru'
              ? '2. Плывите параллельно берегу, чтобы выбраться из узкого коридора течения.'
              : '2. Swim parallel to the shoreline to escape the narrow channel of the current.',
            lang === 'kk'
              ? '3. Ағыстан шыққаннан кейін ғана жағаға қарай бұрылыңыз.'
              : lang === 'ru'
              ? '3. Как только вы почувствуете, что вышли из течения, поворачивайте к берегу.'
              : '3. Once you feel clear of the current, start swimming at an angle back to shore.',
            lang === 'kk'
              ? '4. Үлкен толқындар соқса, деміңізді алып, толқынның астымен сүңгіп өтіңіз.'
              : lang === 'ru'
              ? '4. При накате крупных волн задержите дыхание и ныряйте под гребень волны.'
              : '4. In case of massive breaking waves, hold your breath and dive under the wave crest.',
            lang === 'kk'
              ? '5. Жағажайда құтқарушылардың бар-жоғын тексеріп, көмекке шақырыңыз.'
              : lang === 'ru'
              ? '5. Сигнализируйте руками спасателям на берегу, если не можете выбраться.'
              : '5. Signal with your arms to lifeguards on the beach if you cannot escape.'
          ],
          tips: lang === 'kk'
            ? 'Балқаштағы отжимді желдер үрлемелі матрастарды орталыққа қарай жылдам айдайды.'
            : lang === 'ru'
            ? 'Отжимные ветра на Балхаше могут унести надувные матрасы далеко от берега за считанные минуты.'
            : 'Offshore winds at Lake Balkhash can blow inflatable mattresses deep into the lake within minutes.'
        };
    }
  };

  const active = getGuideContent();

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            {t.firstAidTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'kk' ? 'Көлде немесе жағажайда төтенше жағдайлар кезіндегі әрекеттер' : lang === 'ru' ? 'Инструкции на случай чрезвычайных ситуаций на озере' : 'Essential instructions for beach emergencies'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('cpr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'cpr'
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'bg-slate-950/40 border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          {lang === 'kk' ? 'ӨЖР (CPR)' : lang === 'ru' ? 'СЛР (Реанимация)' : 'CPR Protocol'}
        </button>
        <button
          onClick={() => setActiveTab('cramp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'cramp'
              ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
              : 'bg-slate-950/40 border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          {lang === 'kk' ? 'Бұлшықет құрысуы' : lang === 'ru' ? 'Судороги' : 'Muscle Cramps'}
        </button>
        <button
          onClick={() => setActiveTab('sunstroke')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'sunstroke'
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              : 'bg-slate-950/40 border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          {lang === 'kk' ? 'Күн өту' : lang === 'ru' ? 'Солнечный удар' : 'Sunstroke'}
        </button>
        <button
          onClick={() => setActiveTab('rip')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
            activeTab === 'rip'
              ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
              : 'bg-slate-950/40 border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          {lang === 'kk' ? 'Ағыстар мен толқындар' : lang === 'ru' ? 'Ағыстар / Волны' : 'Rip Currents'}
        </button>
      </div>

      {/* Guide Content Display */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {active.icon}
          <h4 className="text-sm md:text-base font-extrabold text-white">
            {active.title}
          </h4>
        </div>

        {/* Steps List */}
        <div className="space-y-2">
          {active.steps.map((step, idx) => (
            <div 
              key={idx} 
              className="p-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs sm:text-sm text-slate-350 font-medium leading-relaxed"
            >
              {step}
            </div>
          ))}
        </div>

        {/* Extra Pro-Tips */}
        <div className="p-3.5 bg-sky-950/20 border border-sky-500/10 rounded-xl flex items-start gap-2.5">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="text-xs text-sky-350 leading-relaxed font-semibold">
            <span className="font-bold text-sky-400 uppercase mr-1">
              {lang === 'kk' ? 'МАҢЫЗДЫ КЕҢЕС:' : lang === 'ru' ? 'ВАЖНЫЙ СОВЕТ:' : 'PRO TIP:'}
            </span>
            {active.tips}
          </div>
        </div>

      </div>

    </div>
  );
};
