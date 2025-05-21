'use client';

import { Container } from '@mui/material';
import ProductCarousel from '@/components/product/ProductCarousel';
import BannerSlider from '@/components/BannerSlider';
import NewsItem from '@/components/news/NewsItem';
import ProductGrid from '@/components/product/ProductGrid';
import { ProductShortResponse } from '@/types/Product';
import { useEffect, useState } from 'react';
import { getAllProducts } from '@/services/ProductService';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import CardLayout from '@/components/news/CardLayout';
import { NewsResponse } from '@/types/News';
import { getAllNews } from '@/services/NewsService';
import Post from '@/components/news/Post';

export default function Home() {

  const [products, setProducts] = useState<ProductShortResponse[]>([]);
  const [newsList, setNewsList] = useState<NewsResponse[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState(10);


  useEffect(() => {
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await getAllProducts(0, size);
        console.log(res)
      setProducts(res.result.content);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchNews = async () => {
    try {
        setIsLoading(true);
        const res = await getAllNews(0, 12);
        console.log(res)
        setNewsList(res.result.content);
    } catch (error) {
        console.error("Error fetching news:", error);
    } finally {
        setIsLoading(false);
    }
  };

    const checkMode = () => {
        if (products) {
            const isMobile = window.innerWidth < 640;
            setSize(isMobile ? 8 : 20)
        }
    };

    checkMode();
    window.addEventListener("resize", checkMode);

    fetchProducts();
    fetchNews();

    window.removeEventListener("resize", checkMode);
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
            <ProductCarousel products={products} isLoading={isLoadingProducts}/>
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
            <ProductCarousel products={products} isLoading={isLoadingProducts}/>
          </section>
          
          {/* Tin tức mới nhất */}
          {newsList.length == 4 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tin tức mới nhất</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-[21fr_22fr] gap-4 max-w-6xl mx-auto">
                {/* Card lớn bên trái */}
                <div className="">
                  <NewsItem news={newsList[0]} orientation='col'/>
                </div>

                {/* 4 card nhỏ bên phải */}
                <div className="flex flex-col">
                  <div className="grid grid-cols-2 gap-4 mb-4 md:mb-auto">
                    <NewsItem news={newsList[1]} orientation='col'/>
                    <NewsItem news={newsList[2]} orientation='col'/>
                  </div>
                  <NewsItem news={newsList[3]} orientation='row'/>
                </div>
              </div>
            </div>
          </section>
          )}


          <section className="mb-10">
              <h2 className="text-base md:text-2xl font-semibold mb-4">Tin tức mới nhất</h2>
              <div className='flex flex-row flex-wrap justify-center gap-4 w-full border border-gray-300 rounded-2xl p-4'>
                <Post
                    avatarUrl="/test2.jpg"
                    userName="Nguyễn Văn A"
                    postedAt="2 giờ trước"
                    title="Chuyến đi Đà Lạt thật tuyệt!"
                    content="Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍"
                    images={[
                    '/test6.jpg',
                    ]}
                />
                
                <Post
                    avatarUrl="/test2.jpg"
                    userName="Nguyễn Văn A"
                    postedAt="2 giờ trước"
                    title="Chuyến đi Đà Lạt thật tuyệt!"
                    content="Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍Cảnh đẹp, không khí trong lành, đồ ăn ngon 😍"
                    images={[
                    '/news.jpg',
                    '/news.jpg',
                    '/news.jpg',
                    '/news.jpg',
                    '/news.jpg',
                    '/news.jpg',
                    ]}
                />
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
            <ProductCarousel products={products} isLoading={isLoadingProducts}/>
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
          {newsList.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bài viết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsList.map((news) => (
                <NewsItem key={news.id} news={news} orientation='row'/>
              ))}
            </div>
          </section>
          )}

        </Container>
      </main>
    </div>
  );
}
