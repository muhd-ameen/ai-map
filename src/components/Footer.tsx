import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 mt-16">
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Hobby . {' '}
          <a 
            href="https://x.com/emeenx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
          >
            emeenx
          </a>
        </p>
      </div>
    </footer>
  );
};