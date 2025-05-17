"use client";

import { useCallback, useEffect, useState } from "react";
import { Container } from "@mui/material";
import Breadcrumb from "@/components/common/Breadcrumb";
import StaticPageSidebar from "./StaticPageSidebar";
import PostViewer from "@/components/common/PostViewer";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import '@/styles/scrollbar.css'
import { StaticPageResponse } from "@/types/News";
import { getAllStaticPages, getStaticPageBySlug, increaseStaticPageViews } from "@/services/StaticPageService";


interface StaticPageProps {
  params: {
    staticPageSlug: string;
  };
}

export default function StaticPage({ params }: StaticPageProps) {
    const { staticPageSlug } = params;
    const [staticPage, setStaticPage] = useState<StaticPageResponse>();
    const [staticPageList, setStaticPageList] = useState<StaticPageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchStaticPage = async () => {
            try {
                setIsLoading(true);
                const res = await getStaticPageBySlug(staticPageSlug);
                setStaticPage(res.result);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchStaticPageList = async () => {
            try {
                setIsLoading(true);
                const res = await getAllStaticPages(0, 20);
                setStaticPageList(res.result.content);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStaticPage();

        fetchStaticPageList();
    }, [staticPageSlug]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            increaseStaticPageViews(staticPageSlug);
        }, 3000);

        return () => clearTimeout(timeout); 
    }, [staticPageSlug]);
    

    const breadcrumbItems = [
        { label: "🏠 Trang chủ", href: "/" },
        { label: staticPageSlug }
    ];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <main className="flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"}>
                  <div className="text-3xl text-gray-800 border-b border-gray-300 pb-2 mb-4">Chính sách / Về chúng tôi / Hướng dẫn</div>

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <section className="w-full lg:w-5/7 flex flex-col gap-12">
                        {staticPage && (
                            <PostViewer title={""} content={staticPage?.content} />
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

                        <section className="w-full lg:w-2/7 sticky top-0 h-60 md:h-screen overflow-y-auto pb-8 custom-2-scrollbar">
                            <StaticPageSidebar pageList={staticPageList} />
                        </section>
                    </div>
                </Container>
            </main>
        </div>
    );
}
