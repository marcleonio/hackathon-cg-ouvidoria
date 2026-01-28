import React, { useState } from 'react';
import { Image, Video, X } from 'lucide-react';

export default function MediaUpload({ onMediaSelect, type = 'image', label }) {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if ((type === 'image' && !file.type.startsWith('image/')) || 
          (type === 'video' && !file.type.startsWith('video/'))) {
        alert(`Por favor selecione um arquivo válido do tipo ${type === 'image' ? 'Imagem' : 'Vídeo'}.`);
        return;
      }
      
      const url = URL.createObjectURL(file);
      setPreview(url);
      onMediaSelect(file);
    }
  };

  const clearMedia = () => {
    setPreview(null);
    onMediaSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      
      {!preview ? (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center">
            <input
                type="file"
                accept={type === 'image' ? "image/*" : "video/*"}
                capture={type === 'image' ? "environment" : undefined} // Sugerir câmera em mobile
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={`Upload de ${label}`}
            />
            <div className="flex flex-col items-center text-gray-400">
                {type === 'image' ? <Image size={32} /> : <Video size={32} />}
                <span className="mt-2 text-sm">Toque para adicionar {type === 'image' ? 'foto' : 'vídeo'}</span>
            </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={clearMedia}
            type="button"
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 z-10"
            aria-label="Remover arquivo"
          >
            <X size={16} />
          </button>
          
          {type === 'image' ? (
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          ) : (
            <video src={preview} controls className="w-full h-48 bg-black" />
          )}
        </div>
      )}
    </div>
  );
}
