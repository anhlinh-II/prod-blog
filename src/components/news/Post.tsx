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

export default function Post({
    createdAt,
    title,
    content,
    images,
    width
}: PostProps) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [displayMediaIndex, setDisplayMediaIndex] = useState<number | null>(null);
    const imageUrls = images.filter(image => image && image.url).map(image => `${apiUrl}${image.url}`);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentPreviewLimit = 300;

    const shouldShowExpand = content.length > contentPreviewLimit;

    return (
        <div className={`flex flex-col bg-white rounded-2xl overflow-auto shadow min-w-full h-max mb-6`}
            style={{
                minWidth: window.innerWidth >= 768 ? width : '100%',
                maxWidth: window.innerWidth >= 768 ? width : '100%',
            }}>
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
                        <p className="text-sm text-gray-500">{formatDateTime(createdAt)}</p>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold mb-2">{title}</h2>

                {/* Content */}
                <div className="text-gray-800 whitespace-pre-line">
                    <p className={`${!isExpanded && 'line-clamp-4'} whitespace-pre-wrap`}>{content}</p>
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
                    title={title}
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

export function formatDateTime(isoString: string): string {
	const date = new Date(isoString);
	return new Intl.DateTimeFormat('vi-VN', {
		dateStyle: 'medium',
		timeStyle: 'short',
		hour12: false,
	}).format(date);
}