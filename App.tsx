import React, { useState, useEffect } from 'react';
import { Bot, Car, Wrench, AlertTriangle, CheckCircle, ArrowRight, Activity, Cpu } from 'lucide-react';
import { TRANSLATIONS } from './constants';
import { LanguageCode, CarDetails, DiagnosisResult } from './types';
import { analyzeCarIssue } from './services/geminiService';
import { LanguageSelector } from './components/LanguageSelector';
import { SeverityBadge } from './components/SeverityBadge';

const App: React.FC = () => {
  // State
  const [lang, setLang] = useState<LanguageCode>('ar');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DiagnosisResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [carDetails, setCarDetails] = useState<CarDetails>({
    make: '',
    model: '',
    year: '',
    symptoms: ''
  });

  // Derived translations
  const t = TRANSLATIONS[lang];
  const isRTL = lang === 'ar';

  // Handle Document Direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carDetails.make || !carDetails.symptoms) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeCarIssue(carDetails, lang);
      setResults(data);
    } catch (err) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setCarDetails({ make: '', model: '', year: '', symptoms: '' });
    setError(null);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-blue-500 selection:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-500/20 shadow-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                AutoDiag AI
              </h1>
              <p className="text-[10px] md:text-xs text-slate-400 tracking-widest uppercase">M-BOUHLALA Edition</p>
            </div>
          </div>
          <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
        </div>
      </header>

      {/* HERO & MAIN CONTENT */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full mb-4 ring-1 ring-slate-700 shadow-xl">
            <Bot className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
            {t.title}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* INPUT FORM */}
        {!results && !loading && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
              <Activity className="text-blue-500" />
              <h3 className="text-xl font-bold text-slate-100">{t.inputSection}</h3>
            </div>
            
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t.make}</label>
                  <input
                    name="make"
                    required
                    value={carDetails.make}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Toyota, BMW..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t.model}</label>
                  <input
                    name="model"
                    required
                    value={carDetails.model}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Camry, X5..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">{t.year}</label>
                  <input
                    name="year"
                    type="number"
                    required
                    value={carDetails.year}
                    onChange={handleInputChange}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="2018..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">{t.symptoms}</label>
                <textarea
                  name="symptoms"
                  required
                  rows={4}
                  value={carDetails.symptoms}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  placeholder={t.symptomsPlaceholder}
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                >
                  <Cpu className="w-6 h-6" />
                  {t.analyzeButton}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="relative w-24 h-24 mb-8">
               <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
               <Bot className="absolute inset-0 m-auto w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t.analyzing}</h3>
            <p className="text-slate-400 text-center max-w-md">
              AutoDiag AI Engine is processing vehicle data and symptom patterns...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center my-8">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">{t.error}</h3>
            <button 
              onClick={() => setError(null)}
              className="mt-4 text-sm underline text-slate-400 hover:text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* RESULTS SECTION */}
        {results && !loading && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <CheckCircle className="text-green-500 w-8 h-8" />
                {t.resultsTitle}
              </h2>
              <button
                onClick={handleReset}
                className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                 {t.reset}
                 <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {results.map((result, idx) => (
                <div key={idx} className="bg-slate-800 border-l-4 border-blue-500 rounded-r-xl rounded-l-md shadow-2xl overflow-hidden group hover:bg-slate-800/80 transition-all">
                  
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-slate-900 p-3 rounded-full">
                        <Wrench className="w-6 h-6 text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{result.faultName}</h3>
                        <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
                           {t.severity}: <SeverityBadge level={result.severity} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 grid md:grid-cols-2 gap-8">
                    
                    {/* Description & Causes */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                          {result.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          {t.possibleCauses}
                        </h4>
                        <ul className="space-y-2">
                          {result.causes.map((cause, cIdx) => (
                            <li key={cIdx} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0"></span>
                              {cause}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Solutions */}
                    <div className="bg-blue-900/10 rounded-xl p-5 border border-blue-500/20">
                      <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {t.solutions}
                      </h4>
                      <ul className="space-y-3">
                        {result.solutions.map((sol, sIdx) => (
                           <li key={sIdx} className="flex items-start gap-3 text-slate-200 text-sm">
                             <div className="bg-blue-600/20 p-1 rounded text-blue-400 flex-shrink-0 mt-0.5">
                               <Wrench className="w-3 h-3" />
                             </div>
                             {sol}
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer / Safety */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex items-start gap-4">
               <InfoSection t={t} />
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            {t.footer}
          </p>
          <p className="text-slate-600 text-xs mt-2">© {new Date().getFullYear()} AutoDiag AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Extracted for cleaner render
const InfoSection = ({ t }: { t: any }) => (
  <>
    <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-500 flex-shrink-0">
      <AlertTriangle className="w-6 h-6" />
    </div>
    <div>
      <h4 className="text-lg font-bold text-yellow-500 mb-1">{t.warning}</h4>
      <p className="text-slate-400 text-sm mb-2">{t.safetyTip}: {t.visitMechanic}</p>
    </div>
  </>
);

export default App;