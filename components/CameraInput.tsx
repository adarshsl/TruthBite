import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';

interface CameraInputProps {
  label: string;
  subLabel?: string;
  onImageSelected: (base64: string | null) => void;
  required?: boolean;
}

export const CameraInput: React.FC<CameraInputProps> = ({ label, subLabel, onImageSelected, required }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelected(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-gray-800 flex items-center gap-2">
          {label}
          {required && <span className="text-rose-500 text-xs font-bold bg-rose-50 px-2 py-0.5 rounded-full">REQUIRED</span>}
        </label>
        {preview && (
          <button onClick={clearImage} className="text-xs text-rose-600 font-medium flex items-center hover:underline">
            <X size={14} className="mr-1" /> Remove
          </button>
        )}
      </div>
      
      {subLabel && <p className="text-sm text-gray-500 mb-3">{subLabel}</p>}

      <div 
        className={`relative h-48 rounded-2xl border-2 border-dashed transition-colors overflow-hidden
        ${preview ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
              <Camera className="text-emerald-600" size={24} />
            </div>
            <p className="text-sm font-medium text-gray-600">Tap to Scan</p>
            <p className="text-xs text-gray-400 mt-1">or upload photo</p>
          </div>
        )}

        {/* Hidden Input */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
            <Check size={16} />
          </div>
        )}
      </div>
    </div>
  );
};
