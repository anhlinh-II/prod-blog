'use client';

import Image from 'next/image';
import ImageGrid from './ImageGrid';
import { useState } from 'react';
import DisplayMedia from '../common/DisplayMedia';

type PostProps = {
    avatarUrl: string;
    userName: string;
    postedAt: string;
    title: string;
    content: string;
    images: string[];
};

export default function Post({
    avatarUrl,
    userName,
    postedAt,
    title,
    content,
    images,
}: PostProps) {
    const [displayMediaIndex, setDisplayMediaIndex] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const contentPreviewLimit = 300;

    const shouldShowExpand = content.length > contentPreviewLimit;

    return (
        <div className="flex flex-col bg-white rounded-2xl overflow-auto shadow min-w-full md:min-w-[600px] max-w-[600px] h-max mb-6">
            <div className='border-b border-gray-300 p-4'>
                {/* Header */}
                <div className="flex items-center mb-2">
                    <Image
                        src={`/logo.jpg`}
                        alt={userName}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="ml-3">
                        <p className="font-semibold">Điện máy V Share</p>
                        <p className="text-sm text-gray-500">{postedAt}</p>
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

            <ImageGrid images={images} setIsDisplayMedia={setDisplayMediaIndex}/>

            {displayMediaIndex !== null && (
                <DisplayMedia 
                    images={images} 
                    index={displayMediaIndex}
                    setIsDisplayMedia={setDisplayMediaIndex} 
                />
            )}
        </div>
    );
}
