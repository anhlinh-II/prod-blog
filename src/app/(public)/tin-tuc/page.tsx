"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NewsItem from "@/components/news/NewsItem";
import Pagination from "@/components/common/Pagination";
import '@/styles/scrollbar.css'
import { NewsResponse } from "@/types/News";
import { getAllNews } from "@/services/NewsService";

export default function NewsListPage() {
	const [newsList, setNewsList] = useState<NewsResponse[]>([]);
	const [totalPages, setTotalPages] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
    const newsListRef = useRef<HTMLDivElement>(null);
    const prevLoadingRef = useRef(true);
    
    useEffect(() => {
        const fetchNewsList = async () => {
            try {
                setIsLoading(true);
                const res = await getAllNews(currentPage - 1, 12);
                setNewsList(res.result.content);
                setTotalPages(res.result.page.totalPages);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNewsList();
    }, [currentPage]);
    
     // Scroll to top when filters/page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // If not desktop
    useEffect(() => {
        if (prevLoadingRef.current && !isLoading) {
            if (window.innerWidth < 1024 && newsListRef.current) {
                newsListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        prevLoadingRef.current = isLoading;
    }, [isLoading]);

    return (
        <section className="w-full lg:w-5/7 flex flex-col">
            <div className="text-3xl text-gray-800 border-b border-gray-300 pb-2 mb-4">Tin tức / Mẹo sử dụng, đời sống</div>
            
            <div className="flex flex-col gap-6" ref={newsListRef}>
                <div className="flex flex-col gap-6">
                {newsList.map((news) => (
                    <NewsItem key={news.id} news={news} orientation="row"/>
                ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </section>
    );
}
