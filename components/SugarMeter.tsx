import React from 'react';

interface SugarMeterProps {
  teaspoons: number;
  grams: number;
}

export const SugarMeter: React.FC<SugarMeterProps> = ({ teaspoons, grams }) => {
  // Round to nearest 0.5 for display
  const displaySpoons = Math.round(teaspoons * 2) / 2;
  const isHigh = teaspoons > 2; // Arbitrary threshold for visual alarm

  return (
    <div className={`p-6 rounded-2xl ${isHigh ? 'bg-rose-50 border border-rose-100' : 'bg-emerald-50 border border-emerald-100'}`}>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-3">Sugar Reality Check</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {Array.from({ length: Math.ceil(displaySpoons) }).map((_, i) => {
          // Check if this is a half spoon (last item if value is x.5)
          const isHalf = (i === Math.floor(displaySpoons)) && (displaySpoons % 1 !== 0);
          
          return (
            <div key={i} className="relative w-8 h-8 sm:w-10 sm:h-10">
               {/* Spoon Icon SVG */}
               <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className={`${isHigh ? 'text-rose-500' : 'text-emerald-500'} drop-shadow-sm`}
                style={{ clipPath: isHalf ? 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' : 'none' }}
               >
                 <path d="M16.5 6c0 3.59-2.91 6.5-6.5 6.5C7.91 12.5 5 9.59 5 6s2.91-6.5 6.5-6.5S18 3 18 6c0 3.59-2.91 6.5-6.5 6.5z" transform="translate(3,3) scale(0.8)"/>
                 <path d="M11 14v8h2v-8h-2z" transform="translate(0,0)"/>
               </svg>
            </div>
          );
        })}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-bold ${isHigh ? 'text-rose-700' : 'text-emerald-700'}`}>
          {displaySpoons}
        </span>
        <span className="text-lg text-gray-700 font-medium">teaspoons</span>
        <span className="text-gray-400 text-sm ml-auto">({grams}g)</span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">
        Per serving. {isHigh ? 'This is considered high for a snack.' : 'This is a moderate amount.'}
      </p>
    </div>
  );
};
