'use client'

import Breadcrumb from "@/components/common/Breadcrumb";
import { Container } from "@mui/material";
import NewsSidebar from "./NewsSidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NewsResponse } from "@/types/News";
import { getPopularNews } from "@/services/NewsService";
import { useQuery } from '@tanstack/react-query';

const useSlugFromPath = () => {
  const pathname = usePathname(); 
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'tin-tuc' && segments.length > 1) {
    return segments[1];
  }

  return undefined;
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    const slug = useSlugFromPath();
    const { data, error, isLoading } = useQuery({
        queryKey: ['popularNews', 0, 20],
        queryFn: () => getPopularNews(0, 20),
    });

    const newsList = data?.result?.content ?? [];

    const breadcrumbItems = slug == undefined ? [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Bảng tin V Share" }
    ] : 
    [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Tin tức", href: "/tin-tuc" },
        { label: slug }
    ];
    
    // useEffect(() => {
    //     const fetchNewsList = async () => {
    //         try {
    //             const res = await getPopularNews(0, 20);
    //             setNewsList(res.result.content);
    //         } catch (error) {
    //             console.error("Error fetching news:", error);
    //         }
    //     };
    //     fetchNewsList();
    // }, []);

    return (
        <div className="bg-gray-100">
            <Breadcrumb items={breadcrumbItems} />
            <main className="min-h-screen flex-grow py-6">
                    <div className="flex flex-col-reverse lg:flex-row justify-center gap-4">

                        <section className={`w-full lg:w-6/25 md:sticky top-4 h-80 md:h-screen overflow-y-auto 
                            pb-8 custom-2-scrollbar ${slug ? '' : ''}`}>
                            <NewsSidebar newsList={newsList}/>
                        </section>

                        {children}

                        <section className={`w-full lg:w-6/25 md:sticky top-4 h-80 md:h-screen overflow-y-auto 
                            pb-8 custom-2-scrollbar ${slug ? '' : ''}`}>
                            <NewsSidebar newsList={newsList}/>
                        </section>
                    </div>
            </main>
        </div>
    );
}