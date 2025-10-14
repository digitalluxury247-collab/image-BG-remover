
import React from 'react';
import { PhotoIcon } from './Icon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto text-center mb-8">
      <div className="flex items-center justify-center gap-4">
        <PhotoIcon className="w-12 h-12 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
          Image BG Remover
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400">
        Effortlessly erase backgrounds from your images with the power of AI.
      </p>
    </header>
  );
};

export default Header;
