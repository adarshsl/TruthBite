
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
      <div className="max-w-lg mx-auto px-6 text-center">
        <div className="flex justify-center gap-6 mb-4 text-sm font-medium text-gray-500">
          <Link to="/" className="hover:text-emerald-600">Home</Link>
          <Link to="/methodology" className="hover:text-emerald-600">How we calculate scores</Link>
        </div>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} TruthBite. NOT Medical Advice.
        </p>
      </div>
    </footer>
  );
};
