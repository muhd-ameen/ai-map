import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { SearchInput } from './components/SearchInput';
import { LoadingAnimation } from './components/LoadingAnimation';
import { ResultCard } from './components/ResultCard';
import { interpretPrompt, searchPlaces, getCurrentLocation } from './utils/api';
import { loadApiKeys } from './utils/storage';
import { ApiKeys, SearchResult } from './types';

function App() {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: '',
    googleMaps: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const savedKeys = loadApiKeys();
    setApiKeys(savedKeys);
  }, []);

  const handleSearch = async (query: string) => {
    // Check both user input AND environment variables
    const hasOpenAI = apiKeys.openai?.trim() || import.meta.env.VITE_OPENAI_API_KEY;
    const hasGoogle = apiKeys.googleMaps?.trim() || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!hasOpenAI || !hasGoogle) {
      setError('Please configure your API keys in settings first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Get user location
      const location = await getCurrentLocation();
      
      // Interpret the prompt with AI
      const interpretation = await interpretPrompt(query, apiKeys.openai);
      
      // Search for places
      const places = await searchPlaces(interpretation, location, apiKeys.googleMaps);
      
      setResults({
        query,
        interpretation,
        places
      });
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <SettingsPanel apiKeys={apiKeys} onApiKeysChange={setApiKeys} />
      
      <div className="container mx-auto px-4 py-12">
        <Header />
        
        <SearchInput onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {isLoading && <LoadingAnimation />}
        
        {results && !isLoading && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-teal-50 rounded-2xl border border-indigo-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                AI Interpretation
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {results.interpretation}
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {results.places.length > 0 
                  ? `Found ${results.places.length} amazing places for you`
                  : 'No places found matching your search'
                }
              </h2>
              
              {results.places.map((place, index) => (
                <ResultCard key={place.place_id} place={place} index={index} />
              ))}
            </div>
          </div>
        )}
        
       {!isLoading && !results && !error && (
  (() => {
    // Check if we have API keys (either from user or environment)
    const hasOpenAI = apiKeys.openai?.trim() || import.meta.env.VITE_OPENAI_API_KEY;
    const hasGoogle = apiKeys.googleMaps?.trim() || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    // Only show if no API keys are available
    if (!hasOpenAI || !hasGoogle) {
      return (
        <div className="text-center max-w-lg mx-auto">
          <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Ready to explore?
            </h3>
            <p className="text-gray-600">
              Configure your API keys in settings and start discovering amazing places with AI.
            </p>
          </div>
        </div>
      );
    }
    return null; // Don't show anything if keys are available
  })()
)}
      </div>
    </div>
  );
}

export default App;