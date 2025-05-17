"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PostViewer from "@/components/common/PostViewer";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import '../../../styles/scrollbar.css'
import { NewsResponse } from "@/types/News";
import { getNewsBySlug } from "@/services/NewsService";


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
        <section className="w-full lg:w-5/7 flex flex-col gap-12" ref={newsRef}>
        {news && (
            <PostViewer title={""} content={news?.content} />
        )}
            <div className="flex flex-col items-center justify-center gap-4">
                <div className='h-1 w-20 bg-black rounded-lg mb-2'></div>
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4
                    p-3 border-y border-gray-300 text-lg">
                    <div className="flex items-center gap-2 hover:-translate-x-4 transition-all ease-in duration-150">
                        <FiChevronLeft className="text-2xl"/>
                        <Link href={`/news/slug`} className="">
                            <p className="line-clamp-2 min-h-[3rem] font-serif">Giới thiệu sản phẩm mới: Tai nghe không dây X-Pro</p>
                        </Link>
                    </div>

                    <div className='h-12 w-0.25 bg-gray-300 rounded-lg'></div>

                    <div className="flex items-center gap-2 hover:translate-x-4 transition-all ease-in duration-150">
                        <Link href={`/news/slug`} className="">
                            <p className="line-clamp-2 min-h-[3rem] font-serif">Giới thiệu sản phẩm mới: Tai nghe không dây Y-Pro</p>
                        </Link>
                        <FiChevronRight className="text-2xl"/>
                    </div>
                </div>
            </div>
        </section>
    );
}
