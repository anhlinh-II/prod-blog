import Image from 'next/image';
import { useState, useEffect } from 'react';

type ImageGridProps = {
  images: string[];
  setIsDisplayMedia: (index: number | null) => void;
};

export default function ImageGrid({ images, setIsDisplayMedia }: ImageGridProps) {
  const displayImages = images.length > 5 ? images.slice(0, 5) : images;
  const extraCount = images.length - 5;
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (images.length === 1) {
      const img = new window.Image();
      img.src = images[0];
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const isPortrait = naturalHeight >= naturalWidth;

        if (isPortrait) {
          // ảnh dọc → set height = 450px, width cố định 500px
          const ratio = naturalWidth / naturalHeight;
          setDimensions({ width: 500, height: 500 });
        } else {
          // ảnh ngang → tính height theo tỷ lệ
          const ratio = naturalHeight / naturalWidth;
          setDimensions({ width: 600, height: 600 * ratio });
        }
      };
    }
  }, [images]);
  
  const handleClick = (index: number) => {
    setIsDisplayMedia(index);
  };

  if (images.length === 1 && dimensions) {
    return (
        <div
            className="relative flex items-center justify-center w-full overflow-hidden"
            style={{
                width: 600,
                height: dimensions.height,
            }}
        >
        {/* Nền mờ */}
        <Image
            src={images[0]}
            alt="blur-bg"
            fill
            className="absolute top-0 left-0 object-cover filter blur-2xl"
        />

        {/* Ảnh chính */}
        <Image
            src={images[0]}
            alt="main image"
            width={dimensions.width}
            height={dimensions.height}
            priority
            className="relative z-10 object-contain cursor-pointer"
            onClick={() => handleClick(0)}
        />
        </div>
    );
    }

  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-0.5 w-[600px] h-[299px]">
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image src={img} alt={`img-${i}`} fill priority className="object-cover cursor-pointer aspect-[1/1]" onClick={() => handleClick(i)}/>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-cols-2 gap-0.5 h-80">
        <div className="relative w-full h-full overflow-hidden">
          <Image src={images[0]} alt="img-0" fill priority className="object-cover cursor-pointer" onClick={() => handleClick(0)}/>
        </div>
        <div className="grid grid-rows-2 gap-0.5">
          {[images[1], images[2]].map((img, i) => (
            <div key={i} className="relative w-full h-full overflow-hidden">
              <Image src={img} alt={`img-${i + 1}`} fill priority className="object-cover cursor-pointer" onClick={() => handleClick(i)}/>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 4) {
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-120">
        {images.map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image src={img} alt={`img-${i}`} fill priority className="object-cover cursor-pointer" onClick={() => handleClick(i)}/>
          </div>
        ))}
      </div>
    );
  }

  // 5 or more images
  return (
    <div className="grid gap-0.5">
      {/* Top row: 2 images */}
      <div className="grid grid-cols-2 gap-0.5 h-60">
        {[displayImages[0], displayImages[1]].map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image src={img} alt={`img-${i}`} fill priority className="object-cover cursor-pointer" onClick={() => handleClick(i)}/>
          </div>
        ))}
      </div>

      {/* Bottom row: 3 images */}
      <div className="grid grid-cols-3 gap-0.5 h-50">
        {displayImages.slice(2).map((img, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden">
            <Image src={img} alt={`img-${i + 2}`} fill priority className="object-cover cursor-pointer" onClick={() => handleClick(i)}/>
            {i === 2 && extraCount > 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-xl font-semibold">+{extraCount}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
