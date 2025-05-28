"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import '@/styles/scrollbar.css'
import { NewsResponse } from "@/types/News";
import { getNewsBySlug } from "@/services/NewsService";
import Post from "@/components/news/Post";


interface NewsPageProps {
  params: {
    newsSlug: string;
  };
}

export default function NewsPage({ params }: NewsPageProps) {
    const { newsSlug } = params;
    const [news, setNews] = useState<NewsResponse>();
	const [isLoading, setIsLoading] = useState(true);
    const newsRef = useRef<HTMLDivElement>(null);
    const prevLoadingRef = useRef(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                setIsLoading(true);
                const res = await getNewsBySlug(newsSlug);
                setNews(res.result);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, []);

    // If not desktop
    useEffect(() => {
        if (prevLoadingRef.current && !isLoading) {
            if (window.innerWidth < 1024 && newsRef.current) {
                newsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        prevLoadingRef.current = isLoading;
    }, [isLoading]);

    return (
        <section className="w-full lg:w-13/25 flex flex-col items-center gap-12" ref={newsRef}>
        {news && (
            <Post
                key={news.id}
                createdAt={news.createdAt}
                title={news.title}
                content={news.content}
                images={news.images}
                width={600}
            />
        )}
            <div className="flex flex-col items-center justify-center gap-4">
                <div className='h-1 w-20 bg-black rounded-lg mb-2'></div>
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4
                    p-3 border-y border-gray-300 text-lg">
                    <div className="flex items-center gap-2 hover:-translate-x-4 transition-all ease-in duration-150">
                        <FiChevronLeft className="text-2xl"/>
                        <Link href={`/tin-tuc`} className="">
                            <p className="line-clamp-1 min-h-[1.5rem] font-serif">Đi tới Bảng tin tức | Điện máy V Share</p>
                        </Link>
                    </div>

                    <div className='h-12 w-0.25 bg-gray-300 rounded-lg'></div>

                    <div className="flex items-center gap-2 hover:translate-x-4 transition-all ease-in duration-150">
                        <Link href={`/danh-muc`} className="">
                            <p className="line-clamp-1 min-h-[1.5rem] font-serif">Danh mục sản phẩm | Điện máy V Share</p>
                        </Link>
                        <FiChevronRight className="text-2xl"/>
                    </div>
                </div>
            </div>
        </section>
    );
}
