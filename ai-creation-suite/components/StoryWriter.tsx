import React, { useState, useCallback, useMemo } from 'react';
import { marked } from 'marked';
import { generateStory } from '../services/geminiService';
import { Spinner } from './Spinner';
import { BookIcon } from './icons/BookIcon';
import { SparklesIcon } from './icons/SparklesIcon';

export const StoryWriter: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [genre, setGenre] = useState('Fantasy');
    const [tone, setTone] = useState('Serious');
    const [story, setStory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (isLoading || !prompt.trim()) {
            return;
        }
        setIsLoading(true);
        setError(null);
        setStory(null);
        try {
            const result = await generateStory(prompt, genre, tone);
            setStory(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, prompt, genre, tone]);

    const parsedStory = useMemo(() => {
        if (!story) return null;
         // Basic sanitation
        const sanitizedHtml = (marked.parse(story) as string)
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/onerror/gi, '');
        return { __html: sanitizedHtml };
    }, [story]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-400">
                    <Spinner />
                    <p>Weaving your tale...</p>
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
        if (parsedStory) {
            return (
                 <div 
                    className="prose prose-dark max-w-none text-slate-300 p-4 w-full"
                    dangerouslySetInnerHTML={parsedStory} 
                 />
            );
        }
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500">
                <BookIcon className="w-24 h-24" />
                <p className="text-lg">Your generated story will appear here</p>
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <style>
                {`
                .prose-dark { color: #d1d5db; }
                /* Title of the story */
                .prose-dark h2 { 
                    color: #f59e0b; 
                    text-align: center;
                    font-size: 2.25rem; 
                    font-weight: 700; 
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #475569;
                }
                .prose-dark h3 { 
                    color: #e2e8f0; 
                    margin-top: 2.5em; 
                    margin-bottom: 1em; 
                    font-size: 1.5rem; 
                    font-weight: 600; 
                }
                /* Main story text */
                .prose-dark p {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    text-align: justify;
                    margin-bottom: 1.25rem;
                }
                /* Drop cap for the first paragraph */
                .prose-dark p:first-of-type::first-letter {
                    font-family: serif;
                    font-size: 4.5rem;
                    font-weight: bold;
                    float: left;
                    line-height: 0.8;
                    margin-right: 0.1em;
                    margin-top: 0.1em;
                    color: #f59e0b;
                }
                /* Styling for dialogue or quotes */
                .prose-dark blockquote {
                    font-style: italic;
                    color: #e2e8f0;
                    margin: 2rem 1rem;
                    padding: 1rem 1.5rem;
                    border-left: 4px solid #f59e0b;
                    background-color: #1e293b;
                    border-radius: 0 8px 8px 0;
                }
                .prose-dark blockquote p {
                    text-align: left; /* Keep quotes left aligned */
                    margin-bottom: 0;
                }
                /* Resetting list styles to be simple */
                .prose-dark ul {
                    list-style-type: disc;
                    padding-left: 2rem;
                }
                .prose-dark ul > li {
                    background-color: transparent;
                    border-left: none;
                    padding: 0.25rem 0;
                    margin-bottom: 0.5rem;
                    position: relative; /* ensure li is a positioning context */
                }
                .prose-dark ul > li::before {
                    content: ''; /* Remove card-style pseudo-elements */
                }

                /* Generic styles to keep */
                .prose-dark a { color: #fbbf24; font-weight: 500; text-decoration: none; border-bottom: 1px dashed #fbbf24; transition: all 0.2s ease-in-out; }
                .prose-dark a:hover { color: #ffffff; background-color: #d97706; border-bottom: 1px solid transparent; border-radius: 4px; padding: 2px 4px; }
                .prose-dark strong { color: #f1f5f9; }
                .prose-dark code { background-color: #1e293b; color: #f472b6; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
                .prose-dark pre { background-color: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 1rem; overflow-x: auto; }
                .prose-dark pre code { background-color: transparent; padding: 0; color: #cbd5e1; }
                `}
            </style>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-lg flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A lone astronaut discovers a mysterious signal from a supposedly barren moon..."
                    className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200 resize-y"
                    disabled={isLoading}
                    rows={4}
                    aria-label="Story Prompt"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-slate-400 mb-1">Genre</label>
                        <select
                            id="genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                        >
                            <option>Fantasy</option>
                            <option>Sci-Fi</option>
                            <option>Mystery</option>
                            <option>Horror</option>
                            <option>Romance</option>
                            <option>Adventure</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tone" className="block text-sm font-medium text-slate-400 mb-1">Tone</label>
                        <select
                            id="tone"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            disabled={isLoading}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
                        >
                            <option>Serious</option>
                            <option>Humorous</option>
                            <option>Whimsical</option>
                            <option>Dramatic</option>
                            <option>Uplifting</option>
                        </select>
                    </div>
                </div>
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200"
                    >
                    <SparklesIcon className="w-5 h-5" />
                    <span>{isLoading ? 'Generating...' : 'Generate Story'}</span>
                </button>
            </div>

            <div className="w-full bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex items-start justify-center p-4 transition-all duration-300 min-h-[400px] relative overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};