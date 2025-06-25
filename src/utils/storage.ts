import { ApiKeys } from '../types';

const STORAGE_KEY = 'ai-maps-api-keys';

export const saveApiKeys = (apiKeys: ApiKeys): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
  } catch (error) {
    console.error('Failed to save API keys to localStorage:', error);
  }
};

export const loadApiKeys = (): ApiKeys => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load API keys from localStorage:', error);
  }
  
  return {
    openai: '',
    googleMaps: ''
  };
};

export const clearApiKeys = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear API keys from localStorage:', error);
  }
};