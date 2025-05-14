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
];

export default function NewsSidebar() {
  return (
    <aside className="w-full md:w-80 p-4 bg-white rounded-xl shadow space-y-6">
      {/* Danh mục */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Danh mục</h2>
        <ul className="space-y-2">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <Link
                href={`/news?category=${encodeURIComponent(cat)}`}
                className="text-blue-600 hover:underline text-sm"
              >
                • {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mẹo hay */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Mẹo hay</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Tin mới nhất */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Tin mới nhất</h2>
        <ul className="space-y-3">
          {latestNews.map((news) => (
            <li key={news.id} className="text-sm">
              <Link
                href={`/news/${news.id}`}
                className="text-gray-800 hover:text-blue-600 font-medium line-clamp-2"
              >
                {news.title}
              </Link>
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
