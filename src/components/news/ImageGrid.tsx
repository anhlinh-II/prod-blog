import Image from 'next/image';
import { useState, useEffect } from 'react';

type ImageGridProps = {
  images: string[];
  title: string;
  setIsDisplayMedia: (index: number | null) => void;
  className?: string; // Cho phép custom styling từ bên ngoài
};

export default function ImageGrid({ images, title, setIsDisplayMedia, className = '' }: ImageGridProps) {
  // Filter out empty/invalid images
  const validImages = images ? images.filter(img => img && img.trim() !== '') : [];
  
  if (validImages.length === 0) {
    return null;
  }

  const displayImages = validImages.length > 5 ? validImages.slice(0, 5) : validImages;
  const extraCount = validImages.length - 5;
  const [dimensions, setDimensions] = useState<{ aspectRatio: number } | null>(null);

  useEffect(() => {
    if (validImages.length === 1) {
      const img = new window.Image();
      img.src = validImages[0];
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const aspectRatio = naturalWidth / naturalHeight;
        setDimensions({ aspectRatio });
      };
    }
  }, [validImages]);
  
  const handleClick = (index: number) => {
    setIsDisplayMedia(index);
  };

  // Single image with dynamic aspect ratio
  if (validImages.length === 1 && dimensions) {
    const { aspectRatio } = dimensions;
    const isPortrait = aspectRatio < 1;
    
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        {/* Container với aspect ratio động */}
        <div 
          className="relative w-full"
          style={{
            aspectRatio: isPortrait ? '4/5' : aspectRatio.toString(),
            maxHeight: isPortrait ? '500px' : '400px'
          }}
        >
          {/* Nền mờ */}
          <Image
            src={validImages[0]}
            alt={title}
            fill
            className="absolute top-0 left-0 object-cover filter blur-2xl"
          />

          {/* Ảnh chính */}
          <Image
            src={validImages[0]}
            alt={title}
            fill
            priority={true}
            className="relative z-10 object-contain cursor-pointer"
            onClick={() => handleClick(0)}
          />
        </div>
      </div>
    );
  }

  // Two images - side by side
  if (validImages.length === 2) {
    return (
      <div className={`grid grid-cols-2 gap-0.5 w-full ${className}`} style={{ aspectRatio: '2/1' }}>
        {validImages.map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image 
              src={img} 
              alt={title}
              fill 
              priority={true} 
              className="object-cover cursor-pointer" 
              onClick={() => handleClick(i)}
            />
          </div>
        ))}
      </div>
    );
  }

  // Three images - one large on left, two small on right
  if (validImages.length === 3) {
    return (
      <div className={`grid grid-cols-2 gap-0.5 w-full ${className}`} style={{ aspectRatio: '2/1' }}>
        <div className="relative w-full h-full overflow-hidden">
          <Image 
            src={validImages[0]} 
            alt={title}
            fill 
            priority={true} 
            className="object-cover cursor-pointer" 
            onClick={() => handleClick(0)}
          />
        </div>
        <div className="grid grid-rows-2 gap-0.5 h-full">
          {[validImages[1], validImages[2]].map((img, i) => (
            <div key={i} className="relative w-full h-full overflow-hidden">
              <Image 
                src={img} 
                alt={title}
                fill 
                priority={true} 
                className="object-cover cursor-pointer" 
                onClick={() => handleClick(i + 1)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Four images - 2x2 grid
  if (validImages.length === 4) {
    return (
      <div className={`grid grid-cols-2 grid-rows-2 gap-0.5 w-full ${className}`} style={{ aspectRatio: '1/1' }}>
        {validImages.map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image 
              src={img} 
              alt={title}
              fill 
              priority={true} 
              className="object-cover cursor-pointer" 
              onClick={() => handleClick(i)}
            />
          </div>
        ))}
      </div>
    );
  }

  // 5 or more images - 2 on top, 3 on bottom
  return (
    <div className={`grid gap-0.5 w-full ${className}`}>
      {/* Top row: 2 images */}
      <div className="grid grid-cols-2 gap-0.5 w-full" style={{ aspectRatio: '2/1' }}>
        {[displayImages[0], displayImages[1]].map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image 
              src={img} 
              alt={title}
              fill 
              priority={true} 
              className="object-cover cursor-pointer" 
              onClick={() => handleClick(i)}
            />
          </div>
        ))}
      </div>

      {/* Bottom row: 3 images */}
      <div className="grid grid-cols-3 gap-0.5 w-full" style={{ aspectRatio: '3/1' }}>
        {displayImages.slice(2).map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image 
              src={img} 
              alt={title}
              fill 
              priority={true} 
              className="object-cover cursor-pointer" 
              onClick={() => handleClick(i + 2)}
            />
            {i === 2 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer" onClick={() => handleClick(i + 2)}>
                <span className="text-white text-xl font-semibold">+{extraCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}