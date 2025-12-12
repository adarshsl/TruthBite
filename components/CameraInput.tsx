
import React, { useRef } from 'react';
import { Camera, X, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CameraInputProps {
  label: string;
  subLabel?: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  required?: boolean;
  maxImages?: number;
}

export const CameraInput: React.FC<CameraInputProps> = ({ 
  label, 
  subLabel, 
  images, 
  onImagesChange, 
  required,
  maxImages = 3 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Append new image to the array
        if (images.length < maxImages) {
          onImagesChange([...images, base64]);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-gray-800 flex items-center gap-2">
          {label}
          {required && <span className="text-rose-500 text-xs font-bold bg-rose-50 px-2 py-0.5 rounded-full">{t('required')}</span>}
        </label>
        <span className="text-xs text-gray-400">
          {images.length}/{maxImages} {t('photos')}
        </span>
      </div>
      
      {subLabel && <p className="text-sm text-gray-500 mb-3">{subLabel}</p>}

      {/* Image Grid / List */}
      <div className="flex flex-wrap gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
            <img 
              src={img} 
              alt={`Scan ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-rose-500 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {/* Add Button */}
        {images.length < maxImages && (
          <div 
            className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors
            ${images.length === 0 && required 
              ? 'border-gray-300 bg-white hover:bg-gray-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {images.length === 0 ? (
              <>
                <Camera className="text-red-500 mb-1" size={24} />
                <span className="text-xs font-medium text-gray-600">{t('scanAction')}</span>
              </>
            ) : (
              <>
                <Plus className="text-gray-400 mb-1" size={24} />
                <span className="text-xs font-medium text-gray-500">{t('addAction')}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden Input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
