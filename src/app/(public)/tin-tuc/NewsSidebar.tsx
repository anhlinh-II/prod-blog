// components/NewsSidebar.tsx
import Link from 'next/link';

const categories = ['Công nghệ', 'Khuyến mãi', 'Thủ thuật', 'Sự kiện', 'Mẹo hay'];
const tips = [
  'Luôn kiểm tra nguồn tin.',
  'Đọc kỹ mô tả trước khi mua hàng.',
  'Theo dõi trang chủ để nhận ưu đãi.',
];

const latestNews = [
  {
    id: 1,
    title: 'Ra mắt sản phẩm mới 2025',
    createdAt: '2025-05-12',
  },
  {
    id: 2,
    title: 'Khuyến mãi mùa hè 50%',
    createdAt: '2025-05-10',
  },
  {
    id: 3,
    title: '5 mẹo dùng điện thoại tiết kiệm pin',
    createdAt: '2025-05-08',
  },
  {
    id: 4,
    title: '5 mẹo dùng điện thoại tiết kiệm pin',
    createdAt: '2025-05-08',
  },
  {
    id: 5,
    title: '5 mẹo dùng điện thoại tiết kiệm pin',
    createdAt: '2025-05-08',
  },
  {
    id: 6,
    title: '5 mẹo dùng điện thoại tiết kiệm pin',
    createdAt: '2025-05-08',
  },
  {
    id: 7,
    title: '5 mẹo dùng điện thoại tiết kiệm pin',
    createdAt: '2025-05-08',
  },
  {
    id: 8,
    title: '5 mẹo dùng điện thoại tiết kiệm pin',
    createdAt: '2025-05-08',
  },
];

export default function NewsSidebar() {
  return (
    <aside className="w-full md:w-80 px-4 py-2 border-s border-gray-300 space-y-4">
      {/* Danh mục */}
      <div className=''>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Danh mục</h2>
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

      {/* Tin mới nhất */}
      <div className=''>
        <h2 className="text-lg font-semibold mb-1 text-gray-800">Tin mới nhất</h2>
        <div className='h-0.5 w-12 bg-black rounded-lg mb-2'></div>
        <ul className="space-y-2">
          {latestNews.map((news) => (
            <li key={news.id} className='w-full border-b border-gray-300 pb-1'>
              <div className='hover:translate-x-2 transition-all ease-in duration-150'>
                <Link
                  href={`/news?category=${encodeURIComponent(news.title)}`}
                  className="text-gray-700 text-lg font-light uppercase"
                >
                  {news.title}
                </Link>
              </div>
                <p className="text-gray-400 text-xs">{formatDate(news.createdAt)}</p>
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
