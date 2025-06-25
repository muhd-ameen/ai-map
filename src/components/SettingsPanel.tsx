import React, { useState } from 'react';
import { Settings, X, Key, Save, Eye, EyeOff } from 'lucide-react';
import { ApiKeys } from '../types';
import { saveApiKeys } from '../utils/storage';

interface SettingsPanelProps {
  apiKeys: ApiKeys;
  onApiKeysChange: (keys: ApiKeys) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  apiKeys,
  onApiKeysChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showGoogleMaps, setShowGoogleMaps] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleKeyChange = (key: keyof ApiKeys, value: string) => {
    onApiKeysChange({
      ...apiKeys,
      [key]: value.trim()
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      saveApiKeys(apiKeys);
      setSaveMessage('API keys saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save API keys. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const isConfigured = apiKeys.openai && apiKeys.googleMaps;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-6 right-6 z-40 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group ${
          isConfigured 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : 'bg-white text-gray-600 hover:text-indigo-600'
        }`}
      >
        <Settings className="w-6 h-6 transition-colors duration-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  <Key className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">API Configuration</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs"
                  >
                    (Get your key)
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showOpenAI ? "text" : "password"}
                    placeholder="sk-..."
                    value={apiKeys.openai}
                    onChange={(e) => handleKeyChange('openai', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenAI(!showOpenAI)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOpenAI ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps API Key
                  <a 
                    href="https://console.cloud.google.com/apis/credentials" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs"
                  >
                    (Get your key)
                  </a>
                </label>
                <div className="relative">
                  <input
                    type={showGoogleMaps ? "text" : "password"}
                    placeholder="AIza..."
                    value={apiKeys.googleMaps}
                    onChange={(e) => handleKeyChange('googleMaps', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGoogleMaps(!showGoogleMaps)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showGoogleMaps ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || (!apiKeys.openai && !apiKeys.googleMaps)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isSaving ? 'Saving...' : 'Save API Keys'}
              </button>

              {saveMessage && (
                <div className={`text-center text-sm font-medium ${
                  saveMessage.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {saveMessage}
                </div>
              )}

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2">
                  🔒 Your API keys are stored locally in your browser and never sent to our servers.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• OpenAI API: Used for interpreting your search queries</p>
                  <p>• Google Maps API: Used for finding places near you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};