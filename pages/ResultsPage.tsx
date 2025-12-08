import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeft, Share2, AlertTriangle, CheckCircle, Info, Ban } from 'lucide-react';
import { AnalysisResult } from '../types';
import { SugarMeter } from '../components/SugarMeter';
import { Button } from '../components/Button';

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as AnalysisResult | undefined;

  if (!result) {
    return <Navigate to="/" />;
  }

  // Colors for Pie Chart
  const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Green, Amber, Red (Protein, Fat, Carbs approx)
  
  const macroData = [
    { name: 'Protein', value: result.macros.protein },
    { name: 'Fat', value: result.macros.fat },
    { name: 'Carbs', value: result.macros.carbs },
  ].filter(d => d.value > 0);

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600 bg-emerald-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => navigate('/scan')} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft />
        </button>
        <h1 className="text-sm font-bold text-gray-800 truncate max-w-[200px]">{result.productName}</h1>
        <button className="p-2 text-gray-600">
          <Share2 size={20} />
        </button>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto w-full">
        
        {/* Health Score Banner */}
        <div className={`p-4 rounded-2xl flex items-center justify-between ${getHealthScoreColor(result.healthScore)}`}>
           <div>
             <span className="text-xs uppercase font-bold tracking-wider opacity-80">Health Score</span>
             <h2 className="text-3xl font-bold">{result.healthScore}/100</h2>
           </div>
           <div className="text-right max-w-[60%]">
             <p className="text-sm font-medium leading-tight">{result.summary}</p>
           </div>
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
              Truth vs Hype
            </h3>
            <div className="space-y-3">
              {result.claims.map((claim, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Claim</p>
                      <p className="font-medium text-gray-900">"{claim.claim}"</p>
                    </div>
                    <div className="w-px bg-gray-200 self-stretch mx-1"></div>
                    <div className="flex-1">
                      <p className="text-indigo-600 text-xs font-semibold uppercase mb-1">Reality</p>
                      <p className="font-medium text-indigo-900">{claim.reality}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-sm">
                    {claim.verdict === 'misleading' ? (
                      <span className="text-rose-600 font-bold flex items-center gap-1"><AlertTriangle size={14}/> Potentially Misleading</span>
                    ) : claim.verdict === 'verified' ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={14}/> Verified</span>
                    ) : (
                      <span className="text-gray-500 font-medium">Unclear disclosure</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Macro Chart */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
           <h3 className="text-gray-800 font-bold text-lg mb-4">Macro Balance</h3>
           <div className="flex items-center">
             <div className="h-32 w-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={macroData}
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="ml-6 space-y-2 flex-1">
                {macroData.map((entry, index) => (
                  <div key={entry.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                      <span className="text-gray-600">{entry.name}</span>
                    </div>
                    <span className="font-semibold">{entry.value}g</span>
                  </div>
                ))}
             </div>
           </div>
           <p className="text-xs text-gray-400 mt-4 text-center">Values per serving ({result.servingSize})</p>
        </section>

        {/* Ingredients List */}
        <section>
          <h3 className="text-gray-800 font-bold text-lg mb-3">Ingredients Decoder</h3>
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
                
                {/* Banned In Warning */}
                {ing.bannedIn && ing.bannedIn.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 bg-rose-100/60 p-2.5 rounded-lg border border-rose-200">
                    <Ban className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-rose-800 font-bold mb-0.5">
                        Banned in {ing.bannedIn.join(', ')}
                      </p>
                      <p className="text-[10px] text-rose-700 leading-tight">
                        This ingredient is prohibited in these regions due to safety concerns.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4">
          <Button fullWidth variant="outline" onClick={() => navigate('/scan')}>
            Scan Another Product
          </Button>
        </div>
      </div>
    </div>
  );
};