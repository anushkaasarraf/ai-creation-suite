import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
        <SparklesIcon className="w-6 h-6 text-amber-400" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
          AI Creation Suite
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        Your one-stop platform for generative AI. Bring your ideas to life, from stunning visuals and personalized career plans to captivating stories.
      </p>
    </header>
  );
};