import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const exampleQueries = [
    "It's raining, I want soup",
    "Best coffee near me",
    "Gym with pool",
    "Late night food",
    "Romantic dinner spot",
    "Kid-friendly restaurant"
  ];

  const handleExampleClick = (example: string) => {
    if (!isLoading) {
      setQuery(example);
      onSearch(example);
    }
  };

  return (
<div className="w-full max-w-2xl mx-auto mb-12 px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="It's raining, I want soup..."
            disabled={isLoading}
className="w-full px-6 py-4 pl-14 pr-24 sm:pr-32 text-base sm:text-lg bg-white border-2 border-gray-200 rounded-2xl focus:border-transparent focus:ring-4 focus:ring-indigo-200 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 hover:from-indigo-600 hover:via-purple-600 hover:to-teal-500 text-white px-3 sm:px-6 py-2 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span className="hidden xs:inline sm:inline">
  {isLoading ? 'Searching...' : 'Search'}
</span>
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <p className="text-gray-500 text-sm text-center mb-3">
          ✨ Try these examples:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-100 hover:border-indigo-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};