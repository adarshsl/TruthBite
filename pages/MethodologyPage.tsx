
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, Table } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft />
        </button>
        <h1 className="text-lg font-bold ml-2">Methodology</h1>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full text-gray-800 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-emerald-900 mb-4">Transparency First</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At TruthBite, we don't guess. We use strict, transparent algorithms to calculate every score you see. 
            We do not accept payment from brands to alter these scores.
          </p>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            1. Nutri-Score (A–E)
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We use the standard <strong>European Nutri-Score algorithm</strong>. This score is calculated using nutritional values <strong>per 100g</strong> of the product.
          </p>
          
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-2">The Formula</h4>
            <div className="bg-gray-100 p-4 rounded-xl text-center font-mono text-sm text-gray-700 border border-gray-200">
              Final Score = (Negative Points) - (Positive Points)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h4 className="font-bold text-rose-600 mb-2 text-sm uppercase tracking-wide">Negative Points (0–40)</h4>
              <p className="text-xs text-gray-500 mb-2">Points are <strong>added</strong> for higher amounts of:</p>
              <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
                <li>Energy (Calories) <span className="text-gray-400 text-xs">(0-10 pts)</span></li>
                <li>Sugars <span className="text-gray-400 text-xs">(0-10 pts)</span></li>
                <li>Saturated Fat <span className="text-gray-400 text-xs">(0-10 pts)</span></li>
                <li>Sodium (Salt) <span className="text-gray-400 text-xs">(0-10 pts)</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-emerald-600 mb-2 text-sm uppercase tracking-wide">Positive Points (0–15)</h4>
              <p className="text-xs text-gray-500 mb-2">Points are <strong>subtracted</strong> for higher amounts of:</p>
              <ul className="text-sm space-y-1 text-gray-700 list-disc list-inside">
                <li>Fruits, Veg, Nuts % <span className="text-gray-400 text-xs">(0-5 pts)</span></li>
                <li>Fiber <span className="text-gray-400 text-xs">(0-5 pts)</span></li>
                <li>Protein <span className="text-gray-400 text-xs">(0-5 pts)</span></li>
              </ul>
            </div>
          </div>

          <h4 className="font-bold text-gray-800 mb-3">Grading Scale</h4>
          <div className="overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 font-semibold text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="p-3">Final Score</th>
                  <th className="p-3">Grade</th>
                  <th className="p-3">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-mono text-gray-500">≤ -1</td>
                  <td className="p-3"><span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-bold text-xs">A</span></td>
                  <td className="p-3 text-emerald-700 font-medium">Very Healthy</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-gray-500">0 to 2</td>
                  <td className="p-3"><span className="bg-emerald-500 text-white px-2 py-0.5 rounded font-bold text-xs">B</span></td>
                  <td className="p-3 text-emerald-600 font-medium">Healthy</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-gray-500">3 to 10</td>
                  <td className="p-3"><span className="bg-yellow-400 text-white px-2 py-0.5 rounded font-bold text-xs">C</span></td>
                  <td className="p-3 text-yellow-700 font-medium">Average</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-gray-500">11 to 18</td>
                  <td className="p-3"><span className="bg-orange-500 text-white px-2 py-0.5 rounded font-bold text-xs">D</span></td>
                  <td className="p-3 text-orange-700 font-medium">Low Quality</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-gray-500">≥ 19</td>
                  <td className="p-3"><span className="bg-rose-600 text-white px-2 py-0.5 rounded font-bold text-xs">E</span></td>
                  <td className="p-3 text-rose-700 font-medium">Poor Quality</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            2. TruthBite Health Score (0-100)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            While Nutri-Score looks at 100g, our Health Score looks at <strong>ingredient quality</strong> and <strong>serving size</strong>.
          </p>
          
          <ul className="space-y-3 text-sm">
             <li className="flex gap-3 items-start bg-blue-50 p-2 rounded-lg">
              <span className="font-bold text-blue-600 whitespace-nowrap">Check</span>
              <span>If we cannot identify the Ingredient List (e.g., blurry image), the <strong>Score defaults to 0</strong> to prevent false positives.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-emerald-600 whitespace-nowrap">Start</span>
              <span>Every product starts at <strong>100 points</strong>.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 whitespace-nowrap">-3.5 pts</span>
              <span>For every <strong>1g of sugar</strong> per serving.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 whitespace-nowrap">-30 pts</span>
              <span>If the <strong>first ingredient</strong> is Sugar, Maida, Palm Oil, Glucose Syrup, Maltodextrin, or Liquid Glucose.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 whitespace-nowrap">-20 pts</span>
              <span>For every ingredient flagged as <strong>"Avoid"</strong> (e.g., Trans fats, certain artificial additives).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-rose-500 whitespace-nowrap">-10 pts</span>
              <span>If the product is <strong>Ultra-Processed</strong> (contains more than 10 ingredients).</span>
            </li>
             <li className="flex gap-3">
              <span className="font-bold text-emerald-600 whitespace-nowrap">+5 pts</span>
              <span>Bonus for High Protein (>5g) per serving.</span>
            </li>
          </ul>
        </section>

        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            3. Sugar Spoons
          </h3>
          <p className="text-sm text-gray-600">
            We divide the total grams of sugar per serving by <strong>4.2</strong> (the standard weight of sugar in one teaspoon) to give you a visual representation.
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
          <p>
            <strong>Note:</strong> Our system relies on OCR (reading text from images). If the photo is blurry or the label is damaged, the data extracted might be incomplete, leading to an approximate score.
          </p>
        </div>
      </div>
    </div>
  );
};
