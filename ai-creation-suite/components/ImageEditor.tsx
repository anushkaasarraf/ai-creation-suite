import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';

interface ImageEditorProps {
  imageUrl: string;
}

export interface ImageEditorRef {
  getEditedImage: () => Promise<string | null>;
}

interface Filters {
    brightness: number;
    contrast: number;
    saturate: number;
    grayscale: number;
}

export const ImageEditor = forwardRef<ImageEditorRef, ImageEditorProps>(({ imageUrl }, ref) => {
    const [filters, setFilters] = useState<Filters>({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
    });

    const handleFilterChange = (filterName: keyof Filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: parseInt(value, 10) }));
    };

    const resetFilters = () => {
        setFilters({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0 });
    }

    useImperativeHandle(ref, () => ({
        getEditedImage: () => {
            return new Promise((resolve) => {
                const image = new Image();
                image.crossOrigin = 'anonymous';
                image.src = imageUrl;
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.naturalWidth;
                    canvas.height = image.naturalHeight;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        resolve(null);
                        return;
                    }
                    
                    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%)`;
                    ctx.drawImage(image, 0, 0);
                    
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                };
                image.onerror = () => resolve(null);
            });
        }
    }));
    
    const filterStyle = {
        filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%)`
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2 bg-slate-900/50 rounded-lg flex items-center justify-center overflow-hidden h-[50vh] md:h-auto">
                <img src={imageUrl} alt="Editing preview" style={filterStyle} className="max-w-full max-h-[calc(90vh-200px)] object-contain block"/>
            </div>
            <div className="md:col-span-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Tools</h3>
                    <button onClick={resetFilters} className="text-sm text-amber-400 hover:text-amber-300">Reset</button>
                </div>

                <div className="space-y-4">
                    <FilterSlider label="Brightness" value={filters.brightness} onChange={(e) => handleFilterChange('brightness', e.target.value)} min="0" max="200" />
                    <FilterSlider label="Contrast" value={filters.contrast} onChange={(e) => handleFilterChange('contrast', e.target.value)} min="0" max="200" />
                    <FilterSlider label="Saturation" value={filters.saturate} onChange={(e) => handleFilterChange('saturate', e.target.value)} min="0" max="200" />
                    <FilterSlider label="Grayscale" value={filters.grayscale} onChange={(e) => handleFilterChange('grayscale', e.target.value)} min="0" max="100" />
                </div>
            </div>
        </div>
    );
});

const FilterSlider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min?: string; max?: string; }> = ({ label, value, onChange, min = "0", max = "200" }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300">{label} ({value})</label>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
    </div>
);