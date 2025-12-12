
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Search, Globe, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FDFBF7]">
      {/* Decorative background blobs - Warmer tones */}
      <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-red-100 rounded-full blur-3xl opacity-40 z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-100 rounded-full blur-3xl opacity-40 z-0"></div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-6">
        
        {/* Language Selector Top Bar */}
        <div className="flex justify-end mb-4">
          <div className="relative group">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="appearance-none bg-white/80 backdrop-blur-sm border border-red-100 text-gray-700 font-semibold text-sm pl-4 pr-10 py-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
            >
              {Object.values(Language).map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>

        {/* Header with Logo */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            {/* Brand Logo */}
            <Logo className="w-12 h-12 drop-shadow-md" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('appTitle')}</h1>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed">
            {t('scanTitle')}<br/>
            <span className="text-red-500 font-medium">{t('scanSubtitle')}</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-red-50 flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
              <Scan size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{t('featSugar')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('featSugarDesc')}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-orange-50 flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600 shrink-0">
              <Search size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{t('featTruth')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('featTruthDesc')}</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-blue-50 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{t('featLang')}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('featLangDesc')}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pb-8">
          <Button 
            fullWidth 
            onClick={() => navigate('/scan')}
            className="h-14 text-lg shadow-red-200 shadow-lg"
          >
            {t('startScanning')} <ChevronRight size={20} />
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4">
            {t('worksWith')}
          </p>
        </div>
      </div>
    </div>
  );
};
