"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ThumbnailSlider from './ThumbnaiSlider';
import '../../styles/scrollbar.css'

interface ProductGalleryProps {
  images: string[];
  tag?: string;
  setIsDisplayMedia: (index: number | null) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, tag, setIsDisplayMedia }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainSliderRef = useRef<HTMLDivElement>(null);
  const mainImageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to image on index change
  useEffect(() => {
    const target = mainImageRefs.current[currentIndex];
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex]);


  const handleClick = (index: number) => {
    setIsDisplayMedia(index);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="relative max-h-120">
        <div className='flex md:flex-col gap-2 max-h-120 w-full md:w-auto overflow-hidden'>
          <ThumbnailSlider images={images} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
        </div>

        {images.length > 6 && (
          <div>
            {/* Up button */}
            <button
              className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 z-10 text-2xl text-black p-2 
              rounded-full hover:text-red-500 hover:border hover:border-red-500 cursor-pointer"
              onClick={handlePrev}
            >
              <FiChevronUp />
            </button>

            {/* Down button */}
            <button
              className="hidden md:block absolute -bottom-24 left-1/2 -translate-x-1/2 z-10 text-2xl text-black p-2 
              rounded-full hover:text-red-500 hover:border hover:border-red-500 cursor-pointer"
              onClick={handleNext}
            >
              <FiChevronDown />
            </button>
          </div>
        )}
      </div>

      {/* Main image slider */}
      <div className="flex-1 w-full min-w-0 relative group overflow-hidden">
        <div
          className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory custom-scrollbar"
          ref={mainSliderRef}
        >
          {tag && (
            <div className="absolute top-2 left-2 bg-[#5c0a0a] text-white text-sm font-bold px-3 py-2 z-10">
              {tag}
            </div>
          )}
          {images.map((src, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-full aspect-square snap-start cursor-pointer"
              onClick={() => handleClick(i)}
              ref={(el) => { mainImageRefs.current[i] = el }}
            >
              <Image
                src={src}
                alt={`main-${i}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 450px 450px"
                priority={true}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 ps-5 cursor-pointer h-full
          rounded-full text-4xl hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 pe-5 cursor-pointer h-full
          rounded-full text-4xl hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default ProductGallery;