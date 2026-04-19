import React, { useState, useCallback, useMemo } from 'react';
import { marked } from 'marked';
import { generateCareerRoadmap } from '../services/geminiService';
import { Spinner } from './Spinner';
import { RoadmapIcon } from './icons/RoadmapIcon';
import { SparklesIcon } from './icons/SparklesIcon';

export const CareerRoadmap: React.FC = () => {
    const [currentSkills, setCurrentSkills] = useState('');
    const [desiredCareer, setDesiredCareer] = useState('');
    const [roadmap, setRoadmap] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (isLoading || !currentSkills.trim() || !desiredCareer.trim()) {
            return;
        }
        setIsLoading(true);
        setError(null);
        setRoadmap(null);
        try {
            const result = await generateCareerRoadmap(currentSkills, desiredCareer);
            setRoadmap(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, currentSkills, desiredCareer]);
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && (event.target as HTMLElement).tagName !== 'TEXTAREA') {
            event.preventDefault();
            handleGenerate();
        }
    };

    const parsedRoadmap = useMemo(() => {
        if (!roadmap) return null;
        // Basic sanitation
        const sanitizedHtml = (marked.parse(roadmap) as string)
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/onerror/gi, '');
        return { __html: sanitizedHtml };
    }, [roadmap]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Spinner />
                    <p>Crafting your personalized path...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center text-red-400 p-4 bg-red-900/20 border border-red-800 rounded-lg">
                        <p className="font-semibold">Generation Failed</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            );
        }
        if (parsedRoadmap) {
            return (
                 <div 
                    className="prose prose-dark max-w-none text-slate-300 p-4 w-full"
                    dangerouslySetInnerHTML={parsedRoadmap} 
                 />
            );
        }
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500">
                <RoadmapIcon className="w-24 h-24" />
                <p className="text-lg">Your personalized career roadmap will appear here</p>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <style>
                {`
                .prose-dark { color: #d1d5db; }
                .prose-dark h2 { color: #f59e0b; border-bottom: 1px solid #475569; padding-bottom: 0.5rem; margin-top: 2em; margin-bottom: 1em; font-size: 1.75rem; font-weight: 700; }
                .prose-dark h3 { color: #e2e8f0; margin-top: 2em; margin-bottom: 0.75em; font-size: 1.25rem; font-weight: 600; }
                .prose-dark a { color: #fbbf24; font-weight: 500; text-decoration: none; border-bottom: 1px dashed #fbbf24; transition: all 0.2s ease-in-out; }
                .prose-dark a:hover { color: #ffffff; background-color: #d97706; border-bottom: 1px solid transparent; border-radius: 4px; padding: 2px 4px; }
                .prose-dark strong { color: #f1f5f9; }
                .prose-dark ul { padding-left: 0; list-style-type: none; }
                .prose-dark ul > li { position: relative; background-color: rgba(30, 41, 59, 0.5); border-left: 4px solid #f59e0b; padding: 1rem 1rem 1rem 1.5rem; margin-bottom: 1rem; border-radius: 0 8px 8px 0; }
                .prose-dark ul > li::before { content: none; }
                .prose-dark p, .prose-dark li { font-size: 1rem; line-height: 1.75; }
                .prose-dark blockquote { border-left-color: #64748b; color: #94a3b8; padding-left: 1rem; font-style: italic; }
                .prose-dark code { background-color: #1e293b; color: #f472b6; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
                .prose-dark pre { background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 1rem; overflow-x: auto; }
                .prose-dark pre code { background-color: transparent; padding: 0; color: #cbd5e1; }
                `}
            </style>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg flex flex-col gap-4">
                <textarea
                    value={currentSkills}
                    onChange={(e) => setCurrentSkills(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Python, data analysis, project management..."
                    className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200 resize-y"
                    disabled={isLoading}
                    rows={3}
                    aria-label="Your Current Skills"
                />
                <input
                    type="text"
                    value={desiredCareer}
                    onChange={(e) => setDesiredCareer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Full Stack Developer, Data Scientist, UX Designer..."
                    className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                    disabled={isLoading}
                    aria-label="Your Dream Career"
                />
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !currentSkills.trim() || !desiredCareer.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200"
                    >
                    <SparklesIcon className="w-5 h-5" />
                    <span>{isLoading ? 'Generating...' : 'Generate My Roadmap'}</span>
                </button>
            </div>

            <div className="w-full bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex items-start justify-center p-4 transition-all duration-300 min-h-[400px] relative overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};