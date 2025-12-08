import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Search, Globe, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-emerald-100 rounded-full blur-3xl opacity-50 z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-100 rounded-full blur-3xl opacity-50 z-0"></div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">T</div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">TruthBite</h1>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed">
            Scan labels. Reveal the truth.<br/>
            <span className="text-emerald-700 font-medium">Eat better, today.</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-auto">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-emerald-50 flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-full text-emerald-700">
              <Scan size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Check Sugar Spoons</h3>
              <p className="text-sm text-gray-500 mt-1">See exactly how many teaspoons of sugar are in that biscuit pack.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-orange-50 flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-700">
              <Search size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Truth vs Hype</h3>
              <p className="text-sm text-gray-500 mt-1">Does that "Cashew Cookie" actually contain cashews? Find out.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-blue-50 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-700">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Local Language</h3>
              <p className="text-sm text-gray-500 mt-1">Translate tricky ingredients into Hindi, Tamil, Telugu, and more.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Button 
            fullWidth 
            onClick={() => navigate('/scan')}
            className="h-14 text-lg shadow-emerald-200 shadow-lg"
          >
            Start Scanning <ChevronRight size={20} />
          </Button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Works with any packaged food in India.
          </p>
        </div>
      </div>
    </div>
  );
};