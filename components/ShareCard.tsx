import React, { forwardRef } from 'react';
import { AnalysisResult, NutriScore } from '../types';
import { Logo } from './Logo';

interface ShareCardProps {
  result: AnalysisResult;
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(({ result }, ref) => {
  // Use semantic colors for scores (Green = Good, Red = Bad)
  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 40) return 'text-orange-700 bg-orange-50 border-orange-100';
    return 'text-rose-700 bg-rose-50 border-rose-100';
  };

  const nutriScoreColors: Record<NutriScore, string> = {
    'A': 'bg-emerald-600',
    'B': 'bg-emerald-500',
    'C': 'bg-yellow-400',
    'D': 'bg-orange-500',
    'E': 'bg-rose-600',
  };

  return (
    <div 
      ref={ref} 
      className="fixed top-0 left-0 -z-50 w-[350px] bg-[#FDFBF7] p-6 flex flex-col gap-5 border border-gray-100"
      // Note: We use z-index -50 to keep it rendered in the DOM (so html2canvas can see it) 
      // but hidden behind the main app background.
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Logo className="w-10 h-10" />
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">TruthBite</h1>
      </div>

      {/* Product Name */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
          {result.productName}
        </h2>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Analysis Summary
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Health Score */}
        <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center aspect-square ${getHealthScoreColor(result.healthScore)}`}>
           <span className="text-5xl font-black mb-1 tracking-tighter">{result.healthScore}</span>
           <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Health Score</span>
        </div>

        {/* Nutri-Score */}
        <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col items-center justify-center text-center aspect-square shadow-sm">
           {result.nutriScore ? (
             <>
               <span className={`text-4xl font-black text-white w-14 h-14 flex items-center justify-center rounded-xl mb-2 shadow-sm ${nutriScoreColors[result.nutriScore]}`}>
                 {result.nutriScore}
               </span>
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nutri-Score</span>
             </>
           ) : (
             <>
               <span className="text-2xl font-bold text-gray-300 mb-1">N/A</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nutri-Score</span>
             </>
           )}
        </div>
      </div>

      {/* Sugar Highlight */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Sugar Level</span>
          <span className="text-xs text-gray-400 font-medium">Per serving</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-black text-rose-600">{result.sugarTeaspoons}</span>
          <span className="text-lg font-bold text-rose-800">Teaspoons</span>
        </div>
        
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: Math.min(Math.ceil(result.sugarTeaspoons), 8) }).map((_, i) => (
             <div key={i} className="w-8 h-2 bg-rose-500 rounded-full" />
          ))}
          {result.sugarTeaspoons > 8 && <span className="text-rose-400 text-xs self-center">+</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-2 pt-4 border-t border-gray-200 flex justify-between items-center">
        <p className="text-xs font-bold text-red-600">Scan at truthbite.app</p>
        <p className="text-[9px] text-gray-400">AI Generated • Not Medical Advice</p>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';