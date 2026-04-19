import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  numberOfImages: number;
  setNumberOfImages: (num: number) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading, numberOfImages, setNumberOfImages }) => {
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg flex flex-col sm:flex-row items-stretch gap-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., A majestic lion wearing a crown, photorealistic, 4k"
        className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200 resize-none"
        disabled={isLoading}
        rows={2}
      />
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
        <div className="flex items-center gap-2">
            <label htmlFor="image-count" className="text-sm font-medium text-slate-400 whitespace-nowrap">Variations:</label>
            <select
                id="image-count"
                value={numberOfImages}
                onChange={(e) => setNumberOfImages(parseInt(e.target.value, 10))}
                disabled={isLoading}
                className="bg-slate-900 border border-slate-600 rounded-md py-2 pl-3 pr-8 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </div>
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt.trim()}
          className="w-full sm:w-auto flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>{isLoading ? 'Generating...' : 'Generate'}</span>
        </button>
      </div>
    </div>
  );
};