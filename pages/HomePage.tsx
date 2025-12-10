import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, Search, Globe, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#FDFBF7]">
      {/* Decorative background blobs - Warmer tones */}
      <div className="absolute top-[-20%] right-[-20%] w-[80vw] h-[80vw] bg-red-100 rounded-full blur-3xl opacity-40 z-0"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-100 rounded-full blur-3xl opacity-40 z-0"></div>

      <div className="relative z-10 flex-1 flex flex-col px-6 pt-12">
        
        {/* Header with Logo */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            {/* Brand Logo */}
            <Logo className="w-12 h-12 drop-shadow-md" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">TruthBite</h1>
          </div>
          <p className="text-gray-500 text-lg leading-relaxed">
            Scan labels. Reveal the truth.<br/>
            <span className="text-red-500 font-medium">Eat better, today.</span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-red-50 flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <Scan size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Check Sugar Spoons</h3>
              <p className="text-sm text-gray-500 mt-1">See exactly how many teaspoons of sugar are in that biscuit pack.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-orange-50 flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-full text-orange-600">
              <Search size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Truth vs Hype</h3>
              <p className="text-sm text-gray-500 mt-1">Does that "Cashew Cookie" actually contain cashews? Find out.</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-blue-50 flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <Globe size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Local Language</h3>
              <p className="text-sm text-gray-500 mt-1">Translate tricky ingredients into Hindi, Tamil, Telugu, and more.</p>
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