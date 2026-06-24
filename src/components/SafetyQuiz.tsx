import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight, Printer, Shield } from 'lucide-react';
import { QUIZ_QUESTIONS, translations } from '../data/db';

interface SafetyQuizProps {
  lang: 'kk' | 'ru' | 'en';
}

export const SafetyQuiz: React.FC<SafetyQuizProps> = ({ lang }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [certGenerated, setCertGenerated] = useState<boolean>(false);

  const t = translations[lang];
  const q = QUIZ_QUESTIONS[currentIdx];

  const handleOptionClick = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
  };

  const handleConfirm = () => {
    if (selectedOpt === null) return;
    setIsAnswered(true);
    if (selectedOpt === q.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
    setCertGenerated(false);
  };

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setCertGenerated(true);
    }
  };

  const printCertificate = () => {
    const printContent = document.getElementById('safety-certificate')?.innerHTML;

    if (printContent) {
      // Create a print window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Water Safety Certificate</title>
              <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;750;800&display=swap" rel="stylesheet">
              <style>
                body {
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  background: #ffffff;
                  color: #000000;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  padding: 20px;
                  box-sizing: border-box;
                }
                .cert-container {
                  border: 12px double #f97316;
                  padding: 40px;
                  max-width: 700px;
                  text-align: center;
                  border-radius: 12px;
                  background: #fff8f3;
                  position: relative;
                }
                .cert-title {
                  color: #ea580c;
                  font-size: 28px;
                  font-weight: 800;
                  margin-bottom: 5px;
                  letter-spacing: 2px;
                }
                .cert-subtitle {
                  font-size: 14px;
                  color: #475569;
                  font-weight: 600;
                  margin-bottom: 30px;
                }
                .cert-name {
                  font-size: 32px;
                  font-weight: 800;
                  border-bottom: 2px solid #000;
                  display: inline-block;
                  padding: 5px 30px;
                  margin: 20px 0;
                }
                .cert-desc {
                  font-size: 16px;
                  color: #334155;
                  line-height: 1.6;
                  margin-bottom: 40px;
                }
                .cert-footer {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: 30px;
                }
                .stamp {
                  border: 3px solid #10b981;
                  color: #10b981;
                  padding: 10px 15px;
                  font-weight: 800;
                  border-radius: 8px;
                  transform: rotate(-10deg);
                  font-size: 12px;
                  display: inline-block;
                }
                .signature {
                  border-top: 1px solid #94a3b8;
                  width: 150px;
                  padding-top: 5px;
                  font-size: 11px;
                  color: #64748b;
                }
              </style>
            </head>
            <body>
              <div class="cert-container">
                <div class="cert-title">${t.certTitle}</div>
                <div class="cert-subtitle">${t.subtitle.toUpperCase()}</div>
                <div>This is proudly awarded to:</div>
                <div class="cert-name">${userName}</div>
                <div class="cert-desc">${t.certDesc}</div>
                <div class="cert-footer">
                  <div>
                    <div class="stamp">PASSED / APPROVED</div>
                    <div style="font-size: 10px; color: #94a3b8; margin-top: 5px;">ID: BALK-${Math.floor(Math.random() * 90000) + 10000}</div>
                  </div>
                  <div>
                    <div class="signature">Emergency Dept Inspector</div>
                  </div>
                </div>
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  window.close();
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  // Get current option label dynamically based on language
  const getOptionLabel = (idx: number) => {
    if (lang === 'kk') return q.optionsKk[idx];
    if (lang === 'en') return q.optionsEn[idx];
    return q.optionsRu[idx];
  };

  const getQuestionLabel = () => {
    if (lang === 'kk') return q.questionKk;
    if (lang === 'en') return q.questionEn;
    return q.questionRu;
  };

  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = ((currentIdx) / totalQuestions) * 100;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl relative">
      
      {/* Quiz Header */}
      <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
        <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <Award className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            {t.quizTitle}
          </h3>
          <p className="text-xs text-slate-400">
            {t.quizSub}
          </p>
        </div>
      </div>

      {!quizFinished ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>QUESTION {currentIdx + 1} OF {totalQuestions}</span>
              <span>{Math.round(progressPercent)}% COMPLETE</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl">
            <h4 className="text-sm md:text-base font-extrabold text-white leading-relaxed">
              {getQuestionLabel()}
            </h4>
          </div>

          {/* Options Grid */}
          <div className="space-y-2">
            {q.optionsRu.map((_, idx) => {
              let btnClass = 'bg-slate-950/60 border-white/5 text-slate-300 hover:bg-slate-900/80 hover:text-white';
              
              if (selectedOpt === idx) {
                btnClass = 'bg-orange-500/10 border-orange-500/60 text-orange-300';
              }
              
              if (isAnswered) {
                if (idx === q.correctAnswer) {
                  btnClass = 'bg-emerald-500/10 border-emerald-500/60 text-emerald-300 ring-2 ring-emerald-500/20';
                } else if (selectedOpt === idx) {
                  btnClass = 'bg-red-500/10 border-red-500/60 text-red-300 ring-2 ring-red-500/20';
                } else {
                  btnClass = 'bg-slate-950/20 border-white/5 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer ${btnClass}`}
                >
                  <span className="leading-relaxed">{getOptionLabel(idx)}</span>
                  {isAnswered && idx === q.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && selectedOpt === idx && idx !== q.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end pt-2">
            {!isAnswered ? (
              <button
                onClick={handleConfirm}
                disabled={selectedOpt === null}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  selectedOpt !== null
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>{lang === 'kk' ? 'Растау' : lang === 'ru' ? 'Подтвердить' : 'Confirm'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{lang === 'kk' ? 'Келесі' : lang === 'ru' ? 'Далее' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="space-y-6 text-center py-4">
          <div className="max-w-md mx-auto space-y-4">
            <div className="inline-flex p-4 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <Award className="w-12 h-12 text-orange-500 animate-bounce" />
            </div>
            
            <div>
              <h4 className="text-lg md:text-xl font-extrabold text-white">
                {score >= 4 ? t.quizPass : t.quizFail}
              </h4>
              <p className="text-2xl font-black text-orange-500 mt-2">
                {score} / {totalQuestions}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'kk' 
                  ? 'Сынақты қайта тапсыру арқылы біліміңізді шыңдай аласыз.' 
                  : lang === 'ru' 
                  ? 'Вы можете пересдать тест в любое время для закрепления знаний.' 
                  : 'You can retake the test at any time to reinforce your safety knowledge.'}
              </p>
            </div>

            {/* Certificate Form */}
            {score >= 4 && !certGenerated && (
              <form onSubmit={handleGenerateCertificate} className="bg-slate-950/40 p-4 border border-white/5 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  {lang === 'kk' ? 'Сертификат үшін аты-жөніңізді енгізіңіз:' : lang === 'ru' ? 'Введите имя для генерации сертификата:' : 'Enter your name to generate certificate:'}
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={lang === 'kk' ? 'Аты-жөні' : lang === 'ru' ? 'Имя и фамилия' : 'Full Name'}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    {lang === 'kk' ? 'Жасау' : lang === 'ru' ? 'Создать' : 'Generate'}
                  </button>
                </div>
              </form>
            )}

            {/* Generated Certificate Display */}
            {certGenerated && (
              <div className="space-y-4">
                {/* Visual Certificate Block */}
                <div 
                  id="safety-certificate" 
                  className="relative p-6 border-4 double border-orange-500 bg-gradient-to-b from-[#091c32] to-[#040e1b] rounded-xl text-center shadow-inner overflow-hidden"
                >
                  {/* Decorative stamp/watermark */}
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 opacity-10 text-white pointer-events-none">
                    <Shield className="w-full h-full" />
                  </div>
                  
                  <span className="text-[9px] font-mono tracking-widest text-orange-500 uppercase block">
                    {t.certTitle}
                  </span>
                  <div className="text-base font-extrabold text-white tracking-tight mt-1 truncate">
                    {userName}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-2 px-4">
                    {t.certDesc}
                  </p>
                  
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-[9px] font-mono text-slate-500">
                    <div className="text-left">
                      <div>DATE: {new Date().toLocaleDateString()}</div>
                      <div className="text-emerald-400 font-bold">VERIFIED</div>
                    </div>
                    <div className="text-right">
                      <div>DEPT OF EMERGENCY</div>
                      <div className="text-orange-500 font-bold">APPROVED</div>
                    </div>
                  </div>
                </div>

                {/* Print/Download buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={printCertificate}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'kk' ? 'Басып шығару' : lang === 'ru' ? 'Распечатать' : 'Print Certificate'}</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={resetQuiz}
              className="mt-2 w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'kk' ? 'Қайта тапсыру' : lang === 'ru' ? 'Пройти заново' : 'Retake Quiz'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
