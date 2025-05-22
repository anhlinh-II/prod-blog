'use client';

import Image from 'next/image';
import ImageGrid from './ImageGrid';
import { useState } from 'react';
import DisplayMedia from '../common/DisplayMedia';
import { MediaResponse } from '@/types';

type PostProps = {
    createdAt: string;
    title: string;
    content: string;
    images: MediaResponse[];
    width?: number;
};

const API_BASE_URL = "http://localhost:8080";

export default function Post({
    createdAt,
    title,
    content,
    images,
    width
}: PostProps) {
    const [displayMediaIndex, setDisplayMediaIndex] = useState<number | null>(null);
    const imageUrls = images.filter(image => image && image.url).map(image => `${API_BASE_URL}${image.url}`);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentPreviewLimit = 300;

    const shouldShowExpand = content.length > contentPreviewLimit;

    return (
        <div className={`flex flex-col bg-white rounded-2xl overflow-auto shadow min-w-full md:min-w-[${width}px] max-w-[${width}px] h-max mb-6`}>
            <div className='border-b border-gray-300 p-4'>
                {/* Header */}
                <div className="flex items-center mb-2">
                    <Image
                        src={`/logo.jpg`}
                        alt={'logo'}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="ml-3">
                        <p className="font-semibold">Điện máy V Share</p>
                        <p className="text-sm text-gray-500">{createdAt}</p>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold mb-2">{title}</h2>

                {/* Content */}
                <div className="text-gray-800 whitespace-pre-line">
                    <p className={`${!isExpanded && 'line-clamp-4'}`}>{content}</p>
                    {shouldShowExpand && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                            {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
                        </button>
                    )}
                </div>
            </div>

            <div className={`w-full max-w-[${width}px]`}>
                <ImageGrid 
                    images={imageUrls} 
                    setIsDisplayMedia={setDisplayMediaIndex}
                    className="rounded-lg"
                />
            </div>

            {displayMediaIndex !== null && (
                <DisplayMedia 
                    images={imageUrls} 
                    index={displayMediaIndex}
                    setIsDisplayMedia={setDisplayMediaIndex} 
                />
            )}
        </div>
    );
}
