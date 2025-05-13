"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Swiper } from 'swiper/react';
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';

interface ProductGalleryProps {
    images: string[];
    tag?: string;
    setIsDisplayMedia: (open: boolean) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, tag, setIsDisplayMedia }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
            <Swiper
                direction="vertical"
                slidesPerView={6}
                spaceBetween={10}
                navigation
                modules={[Navigation]}
                className="h-120 w-18"
            >
            {images.map((src, i) => (
                <SwiperSlide key={i}
                  onClick={() => setCurrentIndex(i)}>
                <div className={`w-18 h-18 relative cursor-pointer border border-gray-200
                    ${i === currentIndex ? 'border-blue-500 brightness-75' : 'border-gray-200'}`}>
                    <Image src={src} alt={`thumb-${i}`} sizes='18' fill className="object-cover" />
                </div>
                </SwiperSlide>
            ))}
            </Swiper>
        </div>

        {images.length > 6 && (
          <div>
            {/* Up button */}
            <button
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-10 text-2xl text-black p-2 
              rounded hover:bg-gray-200 hover:text-red-500 cursor-pointer"
              onClick={handlePrev}
            >
              <FiChevronUp />
            </button>

            {/* Down button */}
            <button
              className="absolute -bottom-24 left-1/2 -translate-x-1/2 z-10 text-2xl text-black p-2 
              rounded hover:bg-gray-200 hover:text-red-500 cursor-pointer"
              onClick={handleNext}
            >
              <FiChevronDown />
            </button>
          </div>
        )}
      </div>

      {/* Main image */}
      <div className="flex-1 w-full min-w-0 relative aspect-square group">
        {tag && (
          <div className="absolute top-2 left-2 bg-[#5c0a0a] text-white text-sm font-bold px-3 py-2 z-10">
            {tag}
          </div>
        )}
        <Image
          src={images[currentIndex]}
          alt="main"
          priority
          sizes='full'
          fill
          className="object-contain cursor-pointer"
          onClick={() => setIsDisplayMedia(true)}
        />

        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 ps-5 cursor-pointer h-full
          rounded-full text-3xl hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 pe-5 cursor-pointer h-full
          rounded-full text-3xl hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default ProductGallery;