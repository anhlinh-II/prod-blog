"use client";

import { useCallback, useState } from "react";
import { Container } from "@mui/material";
import Breadcrumb from "@/components/common/Breadcrumb";
import NewsItem from "@/components/news/NewsItem";
import { News } from "@/components/news/NewsItem";
import NewsSidebar from "./NewsSidebar";

export default function NewsListPage() {


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
    title: 'Chương trình khuyến mãi mùa hè. Công ty chính thức mở rộng chi nhánh tại Quận 1, TP.HCM.',
    description: 'Giảm giá lên đến 50% cho tất cả các dịch vụ trong tháng 6.',
    imageUrl: '/test5.jpg',
    createdAt: '2025-05-01',
  },
];
    
    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
        { label: "Tin tức" }
    ];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <main className="min-h-screen flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"}>

                    <div className="flex flex-col lg:flex-row justify-center gap-4">
                        <section className="w-full lg:w-5/7">
                          <div className="flex flex-col gap-6">
                          {fakeNews.map((news) => (
                              <NewsItem key={news.id} news={news} />
                          ))}
                          </div>
                        </section>

                        <section className="w-full lg:w-2/7">
                          <NewsSidebar />
                        </section>
                    </div>
                </Container>
            </main>
        </div>
    );
}
