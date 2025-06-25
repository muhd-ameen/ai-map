import React, { useState, useEffect } from 'react';
import { Star, Phone, Navigation, Clock, MapPin } from 'lucide-react';
import { Place } from '../types';

interface ResultCardProps {
  place: Place;
  index: number;
}

export const ResultCard: React.FC<ResultCardProps> = ({ place, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  const handleCall = () => {
    if (place.formatted_phone_number) {
      window.open(`tel:${place.formatted_phone_number}`, '_self');
    }
  };

  const handleNavigate = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`;
    window.open(url, '_blank');
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  const getOpenStatus = () => {
    if (!place.opening_hours) return null;
    return place.opening_hours.open_now ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
        <Clock className="w-3 h-3" />
        Open Now
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
        <Clock className="w-3 h-3" />
        Closed
      </span>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h3 className="text-xl font-semibold text-gray-800 break-words">
              {place.name}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-3 line-clamp-2">
            {place.formatted_address}
          </p>
          
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {getOpenStatus()}
            
            {place.rating && (
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-yellow-700">
                  {place.rating.toFixed(1)}
                </span>
              </div>
            )}
            
            {place.price_level && (
              <span className="text-sm text-gray-500 font-medium">
                {getPriceLevel(place.price_level)}
              </span>
            )}
          </div>
          
          <div className="flex gap-3">
            {place.formatted_phone_number && (
              <button
                onClick={handleCall}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
            )}
            
            <button
              onClick={handleNavigate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};