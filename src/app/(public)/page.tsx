'use client';

import { Container } from '@mui/material';
import ProductCarousel from '@/components/product/ProductCarousel';
import BannerSlider from '@/components/BannerSlider';
import ProductGrid from '@/components/product/ProductGrid';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import { NewsResponse } from '@/types/News';
import { getAllNews } from '@/services/NewsService';
import Post from '@/components/news/Post';
import { useNewProducts, useOtherProducts, usePopularProducts, useSaleProducts } from '@/hooks/ReactQueries';

// Skeleton Components để giữ layout ổn định
const SectionSkeleton = ({ title }: { title: string }) => (
  <section className="mb-10">
    <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
      <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
        <h2 className="text-base md:text-2xl font-semibold">{title}</h2>
      </div>
      <div className='flex items-center'>
        <span className="text-sm mb-1 md:text-lg md:me-2 text-gray-400">Xem tất cả</span>
        <span className="text-gray-400"><IoIosArrowForward /></span>
      </div>
    </div>
    {/* Fixed height skeleton để tránh layout shift */}
    <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
  </section>
);

const NewsSectionSkeleton = () => (
  <section className="mb-10">
    <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
      <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
        <h2 className="text-base md:text-2xl font-semibold">Tin tức mới nhất</h2>
      </div>
      <div className='flex items-center'>
        <span className="text-sm mb-1 md:text-lg md:me-2 text-gray-400">Đi tới bảng tin</span>
        <span className="text-gray-400"><IoIosArrowForward /></span>
      </div>
    </div>
    <div className='w-full flex items-center justify-center'>
      <div className='flex flex-row justify-center w-full border border-gray-300 rounded-2xl p-4'>
        <div className='flex flex-col items-center gap-4 w-full'>
          {[1, 2].map((i) => (
            <div key={i} className="w-full h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className='flex flex-col items-center gap-4 w-full'>
          {[1, 2].map((i) => (
            <div key={i} className="w-full h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default function Home() {
  const [newsList, setNewsList] = useState<NewsResponse[]>([]);

  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [size, setSize] = useState(10);

  const {
    data: popularProducts,
    isLoading: isLoadingPopular,
  } = usePopularProducts(size);

  const {
    data: newProducts,
    isLoading: isLoadingNew,
  } = useNewProducts(size);

  const {
    data: saleProducts,
    isLoading: isLoadingSale,
  } = useSaleProducts(size);

  const {
    data: otherProducts,
    isLoading: isLoadingOther,
  } = useOtherProducts(size);

  const isLoadingProducts = isLoadingPopular || isLoadingNew || isLoadingSale || isLoadingOther;

  const quarter = Math.ceil(newsList.length / 4);
  const part1 = newsList.slice(0, quarter);
  const part2 = newsList.slice(quarter, quarter * 2);
  const part3 = newsList.slice(quarter * 2, quarter * 3);
  const part4 = newsList.slice(quarter * 3);

  useEffect(() => {
    const checkMode = () => {
      const isMobile = window.innerWidth <= 1024;
      setSize(isMobile ? 8 : 10);
    };

    // Set initial size
    checkMode();
    
    // Add resize listener
    const handleResize = () => checkMode();
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoadingNews(true);
        const res = await getAllNews(0, 8);
        setNewsList(res.result.content);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="">

      <div className="w-full aspect-[12/6] md:aspect-[16/6]">
        <BannerSlider />
      </div>

      <main className="flex-grow bg-gray-50 py-6">
        <Container maxWidth="lg">
          
          {/* Sản phẩm nổi bật */}
          {isLoadingProducts ? (
            <SectionSkeleton title="Sản phẩm nổi bật" />
          ) : (
            <section className="my-10">
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
              <div className="min-h-60"> {/* Fixed min-height */}
                <ProductCarousel products={popularProducts} isLoading={false}/>
              </div>
            </section>
          )}

          {/* Sản phẩm mới */}
          {isLoadingProducts ? (
            <SectionSkeleton title="Sản phẩm mới" />
          ) : (
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
              <div className="min-h-60"> {/* Fixed min-height */}
                <ProductCarousel products={newProducts} isLoading={false}/>
              </div>
            </section>
          )}
          
          {/* Tin tức */}
          {isLoadingNews ? (
            <NewsSectionSkeleton />
          ) : newsList.length > 0 ? (
            <section className="mb-10">
              <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
                <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
                  <h2 className="text-base md:text-2xl font-semibold">Tin tức mới nhất</h2>
                </div>
                <Link href={`/tin-tuc`} className='flex items-center hover:text-red-600'>
                  <span className="text-sm mb-1 md:text-lg md:me-2">Đi tới bảng tin</span>
                  <span className="arrow arrow-1"><IoIosArrowForward /></span>
                  <span className="arrow arrow-2"><IoIosArrowForward /></span>
                  <span className="arrow arrow-3"><IoIosArrowForward /></span>
                </Link>
              </div>
              <div className='w-full flex items-center justify-center'>
                <div className='flex flex-col lg:flex-row justify-center w-full border border-gray-300 rounded-2xl p-4 min-h-64'>
                  
                  {/* Cột bên trái */}
                  <div className='flex flex-col items-center gap-4 w-full'>
                    {part1.map((news) => (
                      <div key={news.id} className="w-full flex items-center justify-center">
                        <Post
                          createdAt={news.createdAt}
                          title={news.title}
                          content={news.content}
                          images={news.images}
                          width={500}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Cột bên phải */}
                  <div className='flex flex-col items-center gap-4 w-full'>
                    {part2.map((news) => (
                      <div key={news.id} className="w-full flex items-center justify-center">
                        <Post
                          createdAt={news.createdAt}
                          title={news.title}
                          content={news.content}
                          images={news.images}
                          width={500}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {/* Giảm giá sốc */}
          {isLoadingProducts ? (
            <SectionSkeleton title="Giảm giá sốc" />
          ) : (
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
              <div className="min-h-60"> {/* Fixed min-height */}
                <ProductCarousel products={saleProducts} isLoading={false}/>
              </div>
            </section>
          )}

          {/* Sản phẩm khác */}
          {isLoadingProducts ? (
            <SectionSkeleton title="Sản phẩm khác" />
          ) : (
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
              <div className="min-h-96"> {/* Fixed min-height cho grid */}
                <ProductGrid products={otherProducts} isLoading={false} />
              </div>
            </section>
          )}
          
          
          {/* Tin tức */}
          {isLoadingNews ? (
            <NewsSectionSkeleton />
          ) : newsList.length > 0 ? (
            <section className="mb-10">
              <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
                <div className='home-title w-max ps-8 pe-8 md:ps-16 md:pe-20 py-1 text-white'>
                  <h2 className="text-base md:text-2xl font-semibold">Tin tức mới nhất</h2>
                </div>
                <Link href={`/tin-tuc`} className='flex items-center hover:text-red-600'>
                  <span className="text-sm mb-1 md:text-lg md:me-2">Đi tới bảng tin</span>
                  <span className="arrow arrow-1"><IoIosArrowForward /></span>
                  <span className="arrow arrow-2"><IoIosArrowForward /></span>
                  <span className="arrow arrow-3"><IoIosArrowForward /></span>
                </Link>
              </div>
              <div className='w-full flex items-center justify-center'>
                <div className='flex flex-col lg:flex-row justify-center w-full border border-gray-300 rounded-2xl p-4 min-h-64'> {/* Fixed min-height */}
                  
                  {/* Cột bên trái */}
                  <div className='flex flex-col items-center gap-4 w-full'>
                    {part3.map((news) => (
                      <div key={news.id} className="w-full flex items-center justify-center">
                        <Post
                          createdAt={news.createdAt}
                          title={news.title}
                          content={news.content}
                          images={news.images}
                          width={500}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Cột bên phải */}
                  <div className='flex flex-col items-center gap-4 w-full'>
                    {part4.map((news) => (
                      <div key={news.id} className="w-full flex items-center justify-center">
                        <Post
                          createdAt={news.createdAt}
                          title={news.title}
                          content={news.content}
                          images={news.images}
                          width={500}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : null}

        </Container>
      </main>
    </div>
  );
}
