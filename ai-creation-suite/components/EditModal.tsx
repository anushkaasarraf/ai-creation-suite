import React, { useRef } from 'react';
import { ImageEditor, ImageEditorRef } from './ImageEditor';
import { DownloadIcon } from './icons/DownloadIcon';
import { XIcon } from './icons/XIcon';

interface EditModalProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (newImageUrl: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ imageUrl, onClose, onSave }) => {
  const editorRef = useRef<ImageEditorRef>(null);

  const handleSave = async () => {
    if (editorRef.current) {
      const dataUrl = await editorRef.current.getEditedImage();
      if (dataUrl) {
        onSave(dataUrl);
      }
    }
  };

  const handleDownload = async () => {
    if (editorRef.current) {
      const dataUrl = await editorRef.current.getEditedImage();
      if (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `edited-image.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        aria-modal="true"
        role="dialog"
    >
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Edit Image</h2>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-grow p-4 overflow-y-auto">
            <ImageEditor ref={editorRef} imageUrl={imageUrl} />
        </main>
        <footer className="flex items-center justify-end p-4 border-t border-slate-700 gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Download</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};