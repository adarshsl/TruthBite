
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft, Share2, AlertTriangle, CheckCircle, Info, Ban, AlertCircle, Loader2, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AnalysisResult, NutriScore } from '../types';
import { SugarMeter } from '../components/SugarMeter';
import { Button } from '../components/Button';
import { ShareCard } from '../components/ShareCard';
import { useLanguage } from '../contexts/LanguageContext';

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Retrieve result and hasFrontImage from location state
  const state = location.state as { result: AnalysisResult; hasFrontImage: boolean } | undefined;
  const result = state?.result;
  const hasFrontImage = state?.hasFrontImage;
  
  // Ref for the hidden share card
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  if (!result) {
    return <Navigate to="/" />;
  }

  // Calculate totals and prepare data with explicit colors
  const totalMacros = result.macros.protein + result.macros.fat + result.macros.carbs;
  
  const macroData = [
    { name: t('protein'), value: result.macros.protein, color: '#10b981' }, // Emerald
    { name: t('fat'), value: result.macros.fat, color: '#f59e0b' },     // Amber
    { name: t('carbs'), value: result.macros.carbs, color: '#ef4444' },   // Red
  ].filter(d => d.value > 0);

  // Keep Semantic Green/Red for Health Scores
  const getHealthScoreColor = (score: number) => {
    // New: Handle missing data (score 0)
    if (score === 0) return 'text-gray-600 bg-gray-100';

    if (score >= 70) return 'text-emerald-600 bg-emerald-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-rose-600 bg-rose-50';
  };

  const nutriScoreColors: Record<NutriScore, string> = {
    'A': 'bg-emerald-600',
    'B': 'bg-emerald-500',
    'C': 'bg-yellow-400',
    'D': 'bg-orange-500',
    'E': 'bg-rose-600',
  };

  const nutriScoreTextColors: Record<NutriScore, string> = {
    'A': 'text-emerald-700',
    'B': 'text-emerald-600',
    'C': 'text-yellow-600',
    'D': 'text-orange-600',
    'E': 'text-rose-600',
  };

  const nutriScoreInfo: Record<NutriScore, { label: string; description: string }> = {
    'A': { label: 'Very Healthy', description: 'Highest nutritional quality. Great for daily consumption.' },
    'B': { label: 'Healthy', description: 'Good nutritional quality. A solid choice.' },
    'C': { label: 'Average', description: 'Acceptable in moderation, but check sugar/fat levels.' },
    'D': { label: 'Low Quality', description: 'Lower nutritional quality. Best enjoyed occasionally.' },
    'E': { label: 'Poor Quality', description: 'High in calories, sugar, or fat. Limit significantly.' },
  };

  const handleShare = async () => {
    if (!shareCardRef.current || isSharing) return;
    
    setIsSharing(true);
    
    try {
      // 1. Generate Canvas from the hidden component
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2, // Retine quality
        backgroundColor: '#FDFBF7', // Match the card bg
        useCORS: true,
        logging: false
      });

      // 2. Convert to Blob
      // Using toDataURL -> fetch -> blob is often more robust across browsers than toBlob directly
      const dataUrl = canvas.toDataURL('image/png');
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      // Simple alphanumeric filename to avoid email client issues
      const cleanName = result.productName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 20);
      const file = new File([blob], `truthbite_${cleanName}.png`, { type: 'image/png' });

      // 3. Share logic
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          // Note: We cannot strictly force "WhatsApp only" via navigator.share,
          // but we can encourage it via UI. The OS handles the app selection.
          await navigator.share({
            files: [file],
            title: `TruthBite: ${result.productName}`,
            text: `Analyzed with TruthBite. Check out this food analysis!`,
          });
        } catch (shareError) {
            // Ignore abort errors (user cancelled share sheet)
            if ((shareError as Error).name !== 'AbortError') {
              console.error('Share failed', shareError);
              alert("Share failed. Try taking a screenshot instead.");
            }
        }
      } else {
        // Fallback: Download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `truthbite_${cleanName}.png`;
        link.click();
        alert("Image downloaded. You can now share it on WhatsApp Web.");
      }
    } catch (error) {
      console.error("Error generating share image:", error);
      alert("Could not generate image. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col pb-8">
      {/* Hidden Share Card Component */}
      <ShareCard ref={shareCardRef} result={result} />

      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => navigate('/scan')} className="p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-full">
          <ArrowLeft />
        </button>
        <h1 className="text-sm font-bold text-gray-800 truncate max-w-[150px]">{result.productName}</h1>
        <button 
          onClick={handleShare} 
          disabled={isSharing}
          // Changed to WhatsApp Green styling
          className="flex items-center gap-2 px-3 py-1.5 bg-[#25D366] text-white rounded-full text-xs font-bold hover:bg-[#20bd5a] transition-colors shadow-sm disabled:opacity-50"
        >
          {isSharing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Share2 size={16} />
              <span>{t('shareWhatsapp')}</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto w-full">
        
        {/* Caveat / Disclaimer + Image Source Info */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl shadow-sm">
          <div className="flex gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 leading-relaxed">
              <p className="font-bold mb-1 uppercase tracking-wide">{t('accuracyNote')}</p>
              <p>
                {t('accuracyDesc')} 
                <span className="font-semibold"> Consult a professional for dietary advice.</span>
              </p>
            </div>
          </div>
          
          {/* Image Source Indicator */}
          <div className="flex items-center gap-2 pt-3 border-t border-blue-100">
            <Camera size={14} className="text-blue-400" />
            <span className="text-xs font-medium text-blue-600">
              {t('analyzed')} 
              {hasFrontImage ? (
                <span className="ml-1 text-emerald-600 font-bold">{t('frontAndBack')}</span>
              ) : (
                <span className="ml-1 text-orange-600 font-bold">{t('backOnly')}</span>
              )}
            </span>
          </div>
          {!hasFrontImage && (
            <p className="text-[10px] text-blue-400 mt-1 ml-6">
              {t('uploadFrontTip')}
            </p>
          )}
        </div>

        {/* Nutri-Score Badge */}
        {result.nutriScore && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                {(['A', 'B', 'C', 'D', 'E'] as NutriScore[]).map((score) => (
                    <div 
                    key={score}
                    className={`
                        w-8 h-8 flex items-center justify-center font-black text-white rounded-md transition-all
                        ${result.nutriScore === score ? nutriScoreColors[score] + ' scale-125 z-10 shadow-lg' : 'bg-gray-200 opacity-30 text-xs'}
                    `}
                    >
                    {score}
                    </div>
                ))}
                </div>
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{t('nutriScore')}</p>
                    <p className={`text-lg font-bold leading-none ${nutriScoreTextColors[result.nutriScore]}`}>
                        {nutriScoreInfo[result.nutriScore].label}
                    </p>
                </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-semibold">Verdict:</span> {nutriScoreInfo[result.nutriScore].description}
                </p>
                <div className="mt-2 pt-2 border-t border-gray-200 flex items-start gap-1.5 text-[10px] text-gray-400">
                    <Info size={12} className="mt-0.5 shrink-0" />
                    <p>Based on nutrients per 100g (Energy, Sugar, Fat vs Fiber, Protein).</p>
                </div>
            </div>
          </div>
        )}

        {!result.nutriScore && result.nutriScoreReason && (
          <div className="bg-gray-100 p-3 rounded-xl border border-gray-200 text-xs text-gray-500">
            <p className="font-semibold mb-1 uppercase tracking-tight">Nutri-Score Unavailable</p>
            {result.nutriScoreReason}
          </div>
        )}

        {/* Health Score Banner */}
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-sm border border-transparent ${getHealthScoreColor(result.healthScore)}`}>
           {result.healthScore > 0 ? (
             <>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider opacity-80">{t('healthScore')}</span>
                  <h2 className="text-3xl font-bold">{result.healthScore}/100</h2>
                </div>
                <div className="text-right max-w-[60%]">
                  <p className="text-sm font-medium leading-tight">{result.summary}</p>
                </div>
             </>
           ) : (
             <>
               <div className="flex items-center gap-3">
                 <AlertTriangle size={32} className="text-gray-400" />
                 <div>
                   <span className="text-xs uppercase font-bold tracking-wider opacity-80 text-gray-500">{t('scanFailed')}</span>
                   <h2 className="text-xl font-bold text-gray-700">{t('dataMissing')}</h2>
                 </div>
               </div>
               <div className="text-right max-w-[50%]">
                 <p className="text-xs text-gray-500 leading-tight">We couldn't read the ingredients. Please retake the photo.</p>
               </div>
             </>
           )}
        </div>

        {/* Sugar Section */}
        <section>
          <SugarMeter teaspoons={result.sugarTeaspoons} grams={result.sugarPerServingGrams} />
        </section>

        {/* Marketing Claims vs Reality */}
        {result.claims.length > 0 && (
          <section>
            <h3 className="text-gray-800 font-bold text-lg mb-3 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 p-1 rounded-md"><Info size={16}/></span>
              {t('truthVsHypeTitle')}
            </h3>
            <div className="space-y-3">
              {result.claims.map((claim, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-semibold uppercase mb-1">{t('claim')}</p>
                      <p className="font-medium text-gray-900">"{claim.claim}"</p>
                    </div>
                    <div className="w-px bg-gray-200 self-stretch mx-1"></div>
                    <div className="flex-1">
                      <p className="text-indigo-600 text-xs font-semibold uppercase mb-1">{t('reality')}</p>
                      <p className="font-medium text-indigo-900">{claim.reality}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm">
                    {claim.verdict === 'misleading' ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle size={14}/> {t('misleading')}</span>
                    ) : claim.verdict === 'verified' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> {t('verified')}</span>
                    ) : (
                      <span className="text-gray-500 font-medium">{t('unclear')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Macro Chart & Table */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
           <h3 className="text-gray-800 font-bold text-lg mb-4">{t('macroTitle')}</h3>
           
           <div className="flex flex-col sm:flex-row items-center gap-6">
             {/* Chart Section */}
             <div className="h-48 w-48 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       formatter={(value: number) => [`${value}g`, '']}
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
             </div>

             {/* Table Section */}
             <div className="w-full">
                <div className="overflow-hidden border border-gray-100 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">Macro</th>
                        <th className="px-4 py-2 text-right text-xs uppercase tracking-wider">Qty</th>
                        <th className="px-4 py-2 text-right text-xs uppercase tracking-wider">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {macroData.map((entry) => {
                        const percent = totalMacros > 0 ? (entry.value / totalMacros) * 100 : 0;
                        return (
                          <tr key={entry.name}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-gray-700 font-medium">{entry.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-600">
                              {entry.value}g
                            </td>
                            <td className="px-4 py-3 text-right text-gray-500 font-mono">
                              {percent.toFixed(0)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
             </div>
           </div>
           
           <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">{t('perServing')} ({result.servingSize})</p>
        </section>

        {/* Ingredients List */}
        <section>
          <h3 className="text-gray-800 font-bold text-lg mb-3">{t('ingredientsTitle')}</h3>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {result.ingredients.map((ing, idx) => (
              <div 
                key={idx} 
                className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${ing.riskLevel === 'avoid' ? 'bg-rose-50/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{ing.translatedName}</h4>
                  {ing.riskLevel !== 'safe' && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase
                      ${ing.riskLevel === 'avoid' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}
                    `}>
                      {ing.riskLevel}
                    </span>
                  )}
                </div>
                {ing.originalName !== ing.translatedName && (
                  <p className="text-xs text-gray-400 font-mono mb-2">{ing.originalName}</p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ing.description}
                </p>
                
                {ing.bannedIn && ing.bannedIn.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 bg-rose-100/60 p-2.5 rounded-lg border border-rose-200">
                    <Ban className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-rose-800 font-bold mb-0.5">
                        {t('bannedIn')} {ing.bannedIn.join(', ')}
                      </p>
                      <p className="text-[10px] text-rose-700 leading-tight">
                        This ingredient is prohibited in these regions due to safety concerns.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {result.ingredients.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">We couldn't read the ingredients list.</p>
                <p className="text-xs mt-1">Try scanning closer to the back of the pack.</p>
              </div>
            )}
          </div>
        </section>

        <div className="pt-4">
          <Button fullWidth variant="outline" onClick={() => navigate('/scan')}>
            {t('scanAnother')}
          </Button>
        </div>
      </div>
    </div>
  );
};
