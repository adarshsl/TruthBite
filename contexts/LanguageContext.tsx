
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);

  const t = (key: string): string => {
    // 1. Try to find the translation in the selected language
    const langData = translations[language];
    if (langData && langData[key]) {
      return langData[key];
    }
    
    // 2. Fallback to English
    const englishData = translations[Language.ENGLISH];
    if (englishData && englishData[key]) {
      return englishData[key];
    }

    // 3. Fallback to key itself if all else fails
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
