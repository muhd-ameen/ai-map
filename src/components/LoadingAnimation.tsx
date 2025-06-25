import React from 'react';

export const LoadingAnimation: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="text-gray-600 font-medium ml-2">AI is thinking...</span>
        </div>
      </div>

      {/* Shimmer cards */}
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded-lg mb-3" style={{ width: '60%' }} />
              <div className="h-4 bg-gray-200 rounded mb-2" style={{ width: '80%' }} />
              <div className="h-4 bg-gray-200 rounded mb-4" style={{ width: '40%' }} />
              <div className="flex gap-3">
                <div className="h-10 bg-gray-200 rounded-xl" style={{ width: '100px' }} />
                <div className="h-10 bg-gray-200 rounded-xl" style={{ width: '120px' }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};