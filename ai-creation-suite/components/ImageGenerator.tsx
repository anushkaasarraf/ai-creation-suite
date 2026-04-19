import React, { useState, useCallback } from 'react';
import { PromptInput } from './PromptInput';
import { ImageDisplay } from './ImageDisplay';
import { EditModal } from './EditModal';
import { generateImageFromPrompt } from '../services/geminiService';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<{ url: string; index: number } | null>(null);

  const handleGenerate = useCallback(async () => {
    if (isLoading || !prompt.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const imageUrls = await generateImageFromPrompt(prompt, numberOfImages);
      setGeneratedImages(imageUrls);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred while generating the image.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, numberOfImages]);

  const handleEdit = (url: string, index: number) => {
    setEditingImage({ url, index });
  };

  const handleCloseModal = () => {
    setEditingImage(null);
  };

  const handleSave = (newImageUrl: string) => {
    if (editingImage === null) return;
    setGeneratedImages(prev => {
      if (!prev) return null;
      const newImages = [...prev];
      newImages[editingImage.index] = newImageUrl;
      return newImages;
    });
    setEditingImage(null);
  };


  return (
    <div className="w-full flex flex-col gap-8">
      <main className="flex flex-col gap-8">
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
          onSubmit={handleGenerate}
          isLoading={isLoading}
          numberOfImages={numberOfImages}
          setNumberOfImages={setNumberOfImages}
        />
        <ImageDisplay
          generatedImages={generatedImages}
          isLoading={isLoading}
          error={error}
          prompt={prompt}
          onEdit={handleEdit}
        />
      </main>
      {editingImage && (
        <EditModal 
          imageUrl={editingImage.url}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};
