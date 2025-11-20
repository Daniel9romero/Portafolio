import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, User } from 'lucide-react';

export default function ProfilePhoto({ 
  initialImage,
  onImageChange 
}: { 
  initialImage?: string;
  onImageChange?: (image: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState(initialImage || '');
  const [isHovered, setIsHovered] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageUrl(result);
        onImageChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    noClick: !!imageUrl, // Deshabilitar click si ya hay imagen
    noDrag: !!imageUrl   // Deshabilitar drag si ya hay imagen
  });

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        {...(imageUrl ? {} : getRootProps())}
        className={`
          relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden 
          ${!imageUrl ? 'cursor-pointer' : ''} transition-all duration-300 mx-auto
          ${isDragActive ? 'ring-4 ring-blue-500 ring-offset-4' : ''}
          ${isHovered && !imageUrl ? 'transform scale-105' : ''}
          border-4 border-white dark:border-gray-800
          shadow-2xl
        `}
      >
        {!imageUrl && <input {...getInputProps()} />}
        
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Daniel Romero - Perfil Profesional" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="w-20 h-20 md:w-24 md:h-24 text-white/80" />
          </div>
        )}

        {/* Overlay on hover - solo mostrar si NO hay imagen */}
        {!imageUrl && (
          <div className={`
            absolute inset-0 bg-black/50 flex items-center justify-center
            transition-opacity duration-300
            ${isHovered || isDragActive ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="text-center text-white">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">
                {isDragActive ? 'Suelta aquí' : 'Click o arrastra'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
