'use client'

import { useOldNews } from '@/hooks/ReactQueries';
import Link from 'next/link';

export default function NewsSidebar() {
  const { data, isLoading, error } = useOldNews();
  const newsList = data?.result?.content ?? [];

  return (
    <aside className="hidden md:block w-full  px-4 py-2 border-s border-gray-300 space-y-4">

      {/* Tin cũ */}
      <div>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Bài viết cũ hơn</h2>
        <div className='h-0.5 w-12 bg-black rounded-lg mb-2'></div>

        <ul className="space-y-2">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="w-full border-b border-gray-300 my-2 animate-pulse">
                  <div className="h-12 bg-gray-300 rounded w-4/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </li>
              ))
            : newsList.map((news) => (
                <li key={news.id} className="w-full border-b border-gray-300 pb-1">
                  <div className="hover:translate-x-2 transition-all ease-in duration-150">
                    <Link
                      href={`/tin-tuc/${news.slug}`}
                      className="text-gray-800 text-lg font-light uppercase line-clamp-2"
                    >
                      {news.title}
                    </Link>
                  </div>
                  <p className="text-gray-500 text-xs">{formatDate(news.createdAt)}</p>
                </li>
              ))}
        </ul>
      </div>
    </aside>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
