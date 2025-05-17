'use client';

import { Container } from '@mui/material';
import ProductCarousel from '@/components/product/ProductCarousel';
import BannerSlider from '@/components/BannerSlider';
import NewsItem, { News } from '@/components/news/NewsItem';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductShortResponse } from '@/types/Product';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/services/ProductService';


const fakeNews: News[] = [
  {
    id: 1,
    title: 'Khai trương chi nhánh mới tại TP.HCM',
    description: 'Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.',
    imageUrl: '/news.jpg',
    createdAt: '2024-05-10',
  },
  {
    id: 2,
    title: 'Ra mắt sản phẩm mới 2025',
    description: 'Chúng tôi vừa giới thiệu dòng sản phẩm mới với nhiều cải tiến.',
    imageUrl: '/test4.jpg',
    createdAt: '2024-12-20',
  },
]

export default function Home() {

  
  const [products, setProducts] = useState<ProductShortResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = (data: { title: string; content: string }) => {
    console.log("Bài viết gửi đi:", data);
    // TODO: Gửi API lưu bài viết vào database
  };

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await getAllProducts(0, 12);
            setProducts(res.result.content);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchProducts();
  }, []);

  return (
    <div className="">

      {/* Banner */}
      <BannerSlider />

      <main className="flex-grow bg-gray-50 py-6">
        <Container maxWidth="lg">

          {/* Bài viết */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài viết nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fakeNews.map((news) => (
                  <NewsItem key={news.id} news={news} />
              ))}
            </div>
          </section>

          {/* Products */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
            <ProductCarousel products={products}/>
          </section>

          {/* Products */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Sản phẩm mới</h2>
            <ProductCarousel products={products}/>
          </section>

          {/* Products */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Giảm giá sốc</h2>
            <ProductCarousel products={products}/>
          </section>

          <section>
            <ProductGrid products={products} isLoading={isLoading}/>
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
    </div>
  );
}
