import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageGenerator } from './components/ImageGenerator';
import { CareerRoadmap } from './components/CareerRoadmap';
import { StoryWriter } from './components/StoryWriter';
import { PhotoIcon } from './components/icons/PhotoIcon';
import { RoadmapIcon } from './components/icons/RoadmapIcon';
import { BookIcon } from './components/icons/BookIcon';

type Tool = 'image' | 'roadmap' | 'story';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>('image');

  const navButtonClasses = (tool: Tool) => 
    `flex items-center gap-3 px-6 py-3 font-medium rounded-t-lg border-b-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 ` +
    (activeTool === tool
      ? 'text-amber-400 bg-slate-800/50 border-amber-400'
      : 'text-slate-400 bg-transparent border-transparent hover:bg-slate-800/30 hover:text-slate-200');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <Header />

        <nav className="flex items-center justify-center border-b border-slate-700 flex-wrap">
            <button
                onClick={() => setActiveTool('image')}
                className={navButtonClasses('image')}
                aria-current={activeTool === 'image' ? 'page' : undefined}
            >
                <PhotoIcon className="w-6 h-6" />
                <span>Image Generator</span>
            </button>
            <button
                onClick={() => setActiveTool('roadmap')}
                className={navButtonClasses('roadmap')}
                aria-current={activeTool === 'roadmap' ? 'page' : undefined}
            >
                <RoadmapIcon className="w-6 h-6" />
                <span>Career Compass</span>
            </button>
            <button
                onClick={() => setActiveTool('story')}
                className={navButtonClasses('story')}
                aria-current={activeTool === 'story' ? 'page' : undefined}
            >
                <BookIcon className="w-6 h-6" />
                <span>Story Writer</span>
            </button>
        </nav>
        
        {activeTool === 'image' && <ImageGenerator />}
        {activeTool === 'roadmap' && <CareerRoadmap />}
        {activeTool === 'story' && <StoryWriter />}
        
      </div>
    </div>
  );
};

export default App;