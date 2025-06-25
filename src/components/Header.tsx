import React from 'react';
import { MapPin, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 rounded-2xl">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500 bg-clip-text text-transparent">
          AI Maps
        </h1>
      </div>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Discover amazing places with the power of AI. Just tell us what you're looking for, 
        and we'll find the perfect spots nearby.
      </p>
      
      <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <span className="text-sm font-medium text-gray-700">
          Smart • Fast • Personalized
        </span>
      </div>
    </header>
  );
};