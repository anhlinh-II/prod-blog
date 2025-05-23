// components/NewsSidebar.tsx
'use client'

import { NewsResponse } from '@/types/News';
import Link from 'next/link';

interface NewsSidebarProps {
  newsList: NewsResponse[];
}

export default function NewsSidebar({newsList} : NewsSidebarProps) {
  return (
    <aside className="hidden md:block w-full md:w-80 px-4 py-2 border-s border-gray-300 space-y-4">

      {/* Tin cũ */}
      <div className=''>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Tin tức cũ</h2>
        <div className='h-0.5 w-12 bg-black rounded-lg mb-2'></div>
        <ul className="space-y-2">
          {newsList.map((news) => (
            <li key={news.id} className='w-full border-b border-gray-300 pb-1'>
              <div className='hover:translate-x-2 transition-all ease-in duration-150'>
                <Link
                  href={`/tin-tuc/${news.slug}`}
                  className="text-gray-800 text-lg font-light uppercase"
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
