"use client";

import { useEffect, useRef, useState } from "react";
import Pagination from "@/components/common/Pagination";
import '@/styles/scrollbar.css'
import { NewsResponse } from "@/types/News";
import { getAllNews, getNewsByType } from "@/services/NewsService";
import Post from "@/components/news/Post";

export default function NewsListPage() {
	const [newsList, setNewsList] = useState<NewsResponse[]>([]);
    const [selectedType, setSelectedType] = useState<string>("ALL");
	const [totalPages, setTotalPages] = useState(8);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
    const newsListRef = useRef<HTMLDivElement>(null);
    const prevLoadingRef = useRef(true);
    
    useEffect(() => {
        const fetchNewsList = async () => {
            try {
                setIsLoading(true);
                let res;
                if (selectedType === "ALL") {
                    res = await getAllNews(currentPage - 1, 12);
                } else {
                    res = await getNewsByType(selectedType, currentPage - 1, 12);
                }
                setNewsList(res.result.content);
                setTotalPages(res.result.page.totalPages);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNewsList();
    }, [currentPage, selectedType]);
    
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

    const types = [
        { label: "Tất cả", value: "ALL" },
        { label: "Tin tức", value: "NEWS" },
        { label: "Mẹo", value: "TIPS" },
        { label: "Thông báo", value: "ANNOUNCEMENT" },
    ];

    return (
        <section className="w-full lg:w-13/25 flex flex-col">
            {/* <div className="text-3xl text-gray-800 border-b border-gray-300 pb-2 mb-4">Tin tức / Mẹo sử dụng, đời sống</div> */}
            
            <div className="flex flex-col gap-6" ref={newsListRef}>
                <div className="flex flex-col items-center gap-4 w-full px-4">
                    <div className="flex flex-wrap gap-3 justify-center border-b border-gray-300 pb-2 w-full">
                        {types.map((type) => (
                            <button
                                key={type.value}
                                className={`px-4 py-2 rounded-full border cursor-pointer ${
                                    selectedType === type.value
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                } transition`}
                                onClick={() => {
                                    setSelectedType(type.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                    
                    {isLoading ? (
                    // Hiển thị placeholder khi đang loading
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="w-full animate-pulse border-b border-gray-300 pb-4">
                        <div className="h-4 w-4 bg-gray-300 rounded-full mb-2"></div>
                        <div className="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        <div className="mt-2 w-full h-48 bg-gray-200 rounded"></div>
                        </div>
                    ))
                    ) : newsList && newsList.length > 0 ? (
                        newsList.map((news) => (
                            <Post
                                key={news.id}
                                createdAt={news.createdAt}
                                title={news.title}
                                content={news.content}
                                images={news.images}
                                width={600}
                            />
                        ))
                    ) : (
                        <p>Không tìm thấy bài viết nào.</p>
                    )}
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
