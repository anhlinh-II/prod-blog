'use client';

import Image from 'next/image';
import '../../app/globals.css'

export interface News {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

type Props = {
  news: News;
};

export default function NewsItem({ news }: Props) {
  return (
    <div className="relative flex flex-col md:flex-row justify-start gap-4 bg-white rounded-xl cursor-pointer
      shadow hover:shadow-lg transition group">
      <div className="relative">
        <div className='relative min-h-48 w-full md:min-w-68 md:max-w-68 md:h-auto overflow-hidden rounded-s-xl'>
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-all ease-in duration-50"
          />
        </div>
        {/* 🔥 Tag HOT */}
        <div className="absolute top-4 -left-6">
          <div className="star-five bg-red-600 text-white text-xs font-bold  animate-wiggle">
            HOT
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700">{news.title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-3 min-h-[4rem]">{news.description}</p>
      </div>
      <div className='absolute bottom-4 right-4 px-2 py-4 rounded-full bg-red-700 flex items-center justify-center'>
        <p className="text-gray-200 text-xs font-bold">{formatDate(news.createdAt)}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ca-CA', {
    day: '2-digit',
    month: '2-digit'
  });
}
