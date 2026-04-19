import React from 'react';
import { Spinner } from './Spinner';
import { PhotoIcon } from './icons/PhotoIcon';
import { EditIcon } from './icons/EditIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  generatedImages: string[] | null;
  isLoading: boolean;
  error: string | null;
  prompt: string;
  onEdit: (url: string, index: number) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ generatedImages, isLoading, error, prompt, onEdit }) => {

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    const cleanPrompt = prompt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30);
    link.download = `${cleanPrompt}_${index + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-400">
          <Spinner />
          <p>Generating your masterpiece...</p>
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
    if (generatedImages && generatedImages.length > 0) {
      return (
        <div className={`grid gap-4 ${generatedImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {generatedImages.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img 
                src={image} 
                alt={`${prompt} - variation ${index + 1}`}
                className="rounded-lg shadow-2xl object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                <button onClick={() => onEdit(image, index)} className="p-3 bg-slate-800/80 rounded-full text-white hover:bg-amber-600 transition-colors">
                  <EditIcon className="w-6 h-6" />
                </button>
                <button onClick={() => handleDownload(image, index)} className="p-3 bg-slate-800/80 rounded-full text-white hover:bg-green-600 transition-colors">
                  <DownloadIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-slate-500">
        <PhotoIcon className="w-24 h-24" />
        <p className="text-lg">Your generated images will appear here</p>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center p-4 transition-all duration-300 min-h-[400px] relative">
      {renderContent()}
    </div>
  );
};