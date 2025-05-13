"use client";
import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface DisplayMediaProps {
    images: string[];
    index: number;
    setIsDisplayMedia: (index: number | null) => void;
}

const DisplayMedia: React.FC<DisplayMediaProps> = ({ images, index, setIsDisplayMedia }) => {
    const [currentIndex, setCurrentIndex] = useState(index);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        setCurrentIndex(prev => prev);
    }, []);

    const isVideoUrl = (url: string): boolean => {
        const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
        return videoExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const delta = e.deltaY;

        setScale(prev => {
            let newScale = prev - delta * 0.001;
            newScale = Math.min(Math.max(newScale, 0.5), 3); // Giới hạn zoom từ 0.5x đến 3x
            return newScale;
        });
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);    

    return (
        <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#050E15]/50 z-50"
            onClick={() => setIsDisplayMedia(null)}
        >
            <div
                className="flex flex-col items-center justify-center w-full md:max-w-[90vw] max-h-[70vh] md:max-h-[94vh] md:p-4 rounded-lg"
            >
                <button
                    className="absolute top-16 md:top-4 left-6 text-3xl text-black bg-gray-100 hover:bg-gray-200 
                    rounded-full p-1 cursor-pointer"
                    onClick={() => setIsDisplayMedia(null)}
                >
                    <IoClose />
                </button>

                {/* Media display */}
                <div className="flex items-center justify-center max-h-[70vh] min-h-[70vh] md:max-h-[94vh] md:min-h-[94vh] w-full"
                    onClick={(e) => e.stopPropagation()}
                    onWheel={handleWheel}>
                    {isVideoUrl(images[currentIndex]) ? (
                        <video src={images[currentIndex]} controls className="max-w-full max-h-[80vh] rounded-lg" />
                    ) : (
                        <img
                            src={images[currentIndex]}
                            alt="Media"
                            className="w-auto max-w-[90vw] h-full max-h-[70vh] min-h-[70vh] md:max-h-[94vh] md:min-h-[94vh] rounded-lg transition-transform duration-150 ease-in-out"
                            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
                        />
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="absolute flex items-center justify-between w-full max-w-[96vw] h-full mt-4">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                        }} 
                        className="text-white bg-black/20 md:bg-transparent h-fit rounded-full md:h-full text-4xl p-2 md:ps-10 cursor-pointer hover:text-red-500">
                        <FiChevronLeft />
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                        }} 
                        className="text-white bg-black/20 md:bg-transparent h-fit rounded-full md:h-full text-4xl p-2 md:pe-10 cursor-pointer hover:text-red-500">
                        <FiChevronRight />
                    </button>
                </div>

                {/* Thumbnails */}
                {/* <div className="mt-4 flex space-x-2"
                    onClick={(e) => e.stopPropagation()}>
                    {images.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className="cursor-pointer"
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index}`}
                                className={`w-20 h-20 object-cover rounded-md ${
                                    index === currentIndex ? 'border-2 border-blue-500 brightness-75' : ''
                                }`}
                            />
                        </div>
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default DisplayMedia;