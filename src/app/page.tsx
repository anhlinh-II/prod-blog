'use client';

import { Container } from '@mui/material';
import ProductCarousel from '@/components/product/ProductCarousel';
import BannerSlider from '@/components/BannerSlider';
import NewsItem, { News } from '@/components/news/NewsItem';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductShortResponse } from '@/types/Product';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/services/ProductService';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import CardLayout from '@/components/news/CardLayout';


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
  {
    id: 3,
    title: 'Khai trương chi nhánh mới tại TP.HCM',
    description: 'Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.',
    imageUrl: '/news.jpg',
    createdAt: '2024-05-10',
  },
  {
    id: 4,
    title: 'Ra mắt sản phẩm mới 2025',
    description: 'Chúng tôi vừa giới thiệu dòng sản phẩm mới với nhiều cải tiến.',
    imageUrl: '/test4.jpg',
    createdAt: '2024-12-20',
  },
]

export default function Home() {

  const [products, setProducts] = useState<ProductShortResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState(10);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await getAllProducts(0, size);
        setProducts(res.result.content);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const checkMode = () => {
        if (products) {
            const isMobile = window.innerWidth < 640;
            setSize(isMobile ? 8 : 10)
        }
    };

    checkMode();
    window.addEventListener("resize", checkMode);
    return () => window.removeEventListener("resize", checkMode);
  }, []);

  return (
    <div className="">

      {/* Banner */}
      <BannerSlider />

      <main className="flex-grow bg-gray-50 py-6">
        <Container maxWidth="lg">

          {/* Products */}
          <section className="mb-10">
            <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
              <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
                <h2 className="text-base md:text-2xl font-semibold">Sản phẩm nổi bật</h2>
              </div>
              <Link href={`/danh-muc`} className='flex items-center hover:text-red-600'>
                  <span className="text-sm mb-1 md:text-lg md:me-2">Xem tất cả</span>
                  <span className="arrow arrow-1"><IoIosArrowForward /></span>
                  <span className="arrow arrow-2"><IoIosArrowForward /></span>
                  <span className="arrow arrow-3"><IoIosArrowForward /></span>
              </Link>
            </div>
            <ProductCarousel products={products} />
          </section>

          {/* Products */}
          <section className="mb-10">
            <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
              <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
                <h2 className="text-base md:text-2xl font-semibold">Sản phẩm mới</h2>
              </div>
              <Link href={`/danh-muc`} className='flex items-center hover:text-red-600'>
                  <span className="text-sm mb-1 md:text-lg md:me-2">Xem tất cả</span>
                  <span className="arrow arrow-1"><IoIosArrowForward /></span>
                  <span className="arrow arrow-2"><IoIosArrowForward /></span>
                  <span className="arrow arrow-3"><IoIosArrowForward /></span>
              </Link>
            </div>
            <ProductCarousel products={products} />
          </section>
          
          {/* Tin tức mới nhất */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tin tức mới nhất</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-[21fr_22fr] gap-4 max-w-6xl mx-auto">
                {/* Card lớn bên trái */}
                <div className="">
                  <NewsItem news={fakeNews[0]} orientation='col'/>
                </div>

                {/* 4 card nhỏ bên phải */}
                <div className="flex flex-col">
                  <div className="grid grid-cols-2 gap-4 mb-4 md:mb-auto">
                    <NewsItem news={fakeNews[1]} orientation='col'/>
                    <NewsItem news={fakeNews[2]} orientation='col'/>
                  </div>
                  <NewsItem news={fakeNews[3]} orientation='row'/>
                </div>
              </div>
            </div>
          </section>

          {/* Products */}
          <section className="mb-10">
            <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
              <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
                <h2 className="text-base md:text-2xl font-semibold">Giảm giá sốc</h2>
              </div>
              <Link href={`/danh-muc`} className='flex items-center hover:text-red-600'>
                  <span className="text-sm mb-1 md:text-lg md:me-2">Xem tất cả</span>
                  <span className="arrow arrow-1"><IoIosArrowForward /></span>
                  <span className="arrow arrow-2"><IoIosArrowForward /></span>
                  <span className="arrow arrow-3"><IoIosArrowForward /></span>
              </Link>
            </div>
            <ProductCarousel products={products} />
          </section>

          <section className="mb-10">
            <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
              <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
                <h2 className="text-base md:text-2xl font-semibold">Sản phẩm khác</h2>
              </div>
              <Link href={`/danh-muc`} className='flex items-center hover:text-red-600'>
                  <span className="text-sm mb-1 md:text-lg md:me-2">Xem tất cả</span>
                  <span className="arrow arrow-1"><IoIosArrowForward /></span>
                  <span className="arrow arrow-2"><IoIosArrowForward /></span>
                  <span className="arrow arrow-3"><IoIosArrowForward /></span>
              </Link>
            </div>
            <ProductGrid products={products} isLoading={isLoading} />
          </section>
          
          {/* Mẹo đời sống */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Mẹo đời sống</h2>
            <div className="space-y-4">
              <CardLayout
                mainCard={
                  <div className="h-full bg-red-100 rounded-xl p-6 shadow hover:shadow-lg transition-all">
                    <h2 className="text-xl font-bold mb-2">Mẹo nổi bật</h2>
                    <p className="text-gray-700">Đây là mẹo chính có nhiều nội dung và hình ảnh nổi bật...</p>
                  </div>
                }
                sideCards={
                  <>
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="bg-blue-100 rounded-xl p-4 shadow hover:shadow-md transition-all">
                        <h3 className="text-md font-semibold">Mẹo #{item}</h3>
                        <p className="text-sm text-gray-600">Mô tả ngắn cho mẹo này...</p>
                      </div>
                    ))}
                  </>
                }
              />
            </div>
          </section>
          
          {/* Bài viết */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài viết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fakeNews.map((news) => (
                <NewsItem key={news.id} news={news} orientation='row'/>
              ))}
            </div>
          </section>

        </Container>
      </main>
    </div>
  );
}
