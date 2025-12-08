import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';
import { CameraInput } from '../components/CameraInput';
import { Button } from '../components/Button';
import { Language } from '../types';
import { analyzeImages } from '../services/geminiService';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>(Language.HINDI);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!backImage) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeImages(frontImage, backImage, language);
      navigate('/results', { state: { result: data } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold ml-2">New Scan</h1>
      </div>

      <div className="flex-1 p-6 max-w-lg mx-auto w-full">
        
        {/* Progress Steps (simplified) */}
        <div className="flex gap-2 mb-8">
          <div className="h-1 bg-emerald-500 flex-1 rounded-full"></div>
          <div className={`h-1 flex-1 rounded-full ${frontImage ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
          <div className="h-1 bg-gray-200 flex-1 rounded-full"></div>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          
          <CameraInput 
            label="1. Back of Pack" 
            subLabel="Capture the Nutrition Table & Ingredients list clearly."
            onImageSelected={setBackImage}
            required
          />

          <CameraInput 
            label="2. Front of Pack (Optional)" 
            subLabel="Capture claims like 'Made with Real Fruit' for verification."
            onImageSelected={setFrontImage}
          />

          <div className="bg-white p-4 rounded-xl border border-gray-200">
             <label className="block text-sm font-semibold text-gray-700 mb-2">
               Translate Results To
             </label>
             <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
             >
               {Object.values(Language).map((lang) => (
                 <option key={lang} value={lang}>{lang}</option>
               ))}
             </select>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm border border-rose-100 flex items-start gap-2">
              <Info size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

        </div>
      </div>

      {/* Footer Action */}
      <div className="bg-white p-4 border-t sticky bottom-0 z-20">
        <Button 
          fullWidth 
          onClick={handleAnalyze} 
          disabled={!backImage || isAnalyzing}
          className="max-w-lg mx-auto"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : "Analyze Product"}
        </Button>
      </div>
    </div>
  );
};
