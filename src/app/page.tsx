'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@mui/material';
import ProductCarousel from '@/components/product/ProductCarousel';
import BannerSlider2 from '@/components/BannerSlider';

export default function Home() {
  const handleSubmit = (data: { title: string; content: string }) => {
    console.log("Bài viết gửi đi:", data);
    // TODO: Gửi API lưu bài viết vào database
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Banner */}
      <BannerSlider2 />

      <main className="flex-grow bg-gray-50 py-6">
        <Container maxWidth="lg">

          {/* Danh mục sản phẩm */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {['Bánh ngọt', 'Bánh mì', 'Đồ uống'].map((item) => (
                <div
                  key={item}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          {/* Bài viết */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                >
                  <h3 className="text-lg font-medium">Tiêu đề bài viết {id}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Đây là phần mô tả ngắn cho bài viết số {id}. Click để xem chi tiết.
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Editer */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <ProductCarousel />
          </section>

          {/* Chia sẻ kinh nghiệm */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Chia sẻ kinh nghiệm</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((id) => (
                <div
                  key={id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                >
                  <h4 className="font-medium">Kinh nghiệm {id}</h4>
                  <p className="text-sm text-gray-600">
                    Một vài dòng chia sẻ hữu ích dành cho bạn đọc...
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
