// components/NewsSidebar.tsx
'use client'

import { StaticPageResponse } from '@/types/News';
import Link from 'next/link';

const categories = ['Công nghệ', 'Khuyến mãi', 'Thủ thuật', 'Sự kiện', 'Mẹo hay'];
const tips = [
  'Luôn kiểm tra nguồn tin.',
  'Đọc kỹ mô tả trước khi mua hàng.',
  'Theo dõi trang chủ để nhận ưu đãi.',
];

interface StaticPageSidebarProps {
  pageList: StaticPageResponse[];
}

export default function StaticPageSidebar({pageList}: StaticPageSidebarProps) {
  return (
    <aside className="w-full md:w-80 px-4 py-2 border-s border-gray-300 space-y-4">
      {/* Hướng dẫn */}
      <div className=''>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Hướng dẫn</h2>
        <div className='h-0.5 w-12 bg-black rounded-lg mb-2'></div>
        <ul className="space-y-2">
          {categories.map((cat, idx) => (
            <li key={idx} className='w-full border-b border-gray-300 pb-1'>
              <div className='hover:translate-x-2 transition-all ease-in duration-150'>
                <Link
                  href={`/news?category=${encodeURIComponent(cat)}`}
                  className="text-gray-700 text-lg font-light uppercase"
                >
                  {cat}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Mẹo hay */}
      <div>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Mẹo hay</h2>
        <div className='h-0.5 w-12 bg-black rounded-lg mb-2'></div>
        <ul className="space-y-2">
          {tips.map((tip, idx) => (
            <li key={idx} className='w-full border-b border-gray-300 pb-1'>
              <div className='hover:translate-x-2 transition-all ease-in duration-150'>
                <Link
                  href={`/news?category=${encodeURIComponent(tip)}`}
                  className="text-gray-700 text-lg font-light uppercase"
                >
                  {tip}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chính sách */}
      <div className=''>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Chính sách</h2>
        <div className='h-0.5 w-12 bg-black rounded-lg mb-2'></div>
        <ul className="space-y-2">
          {pageList.map((page) => (
            <li key={page.id} className='w-full border-b border-gray-300 pb-1'>
              <div className='hover:translate-x-2 transition-all ease-in duration-150'>
                <Link
                  href={`/${page.slug}`}
                  className="text-gray-700 text-lg font-light uppercase"
                >
                  {page.title}
                </Link>
              </div>
                <p className="text-gray-400 text-xs">{formatDate(page.createdAt)}</p>
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
