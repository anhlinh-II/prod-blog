"use client";

import { useCallback, useState } from "react";
import { Container } from "@mui/material";
import Breadcrumb from "@/components/common/Breadcrumb";
import StaticPageSidebar from "./StaticPageSidebar";
import PostViewer from "@/components/common/PostViewer";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import '../../styles/scrollbar.css'

export default function StaticPage() {

    const breadcrumbItems = [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Slug" }
    ];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <main className="flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"}>
                  <div className="text-3xl text-gray-800 border-b border-gray-300 pb-2 mb-4">Chính sách / Về chúng tôi / Hướng dẫn</div>

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <section className="w-full lg:w-5/7 flex flex-col gap-12">
                            <PostViewer title={""} content={`<h1><strong>Giới thiệu sản phẩm mới: Tai nghe không dây X-Pro</strong></h1>

<p><em>Ngày đăng: 14/05/2025</em></p>

<p>Tai nghe không dây <strong>X-Pro</strong> là sự kết hợp hoàn hảo giữa thiết kế hiện đại và công nghệ âm thanh tiên tiến, mang đến trải nghiệm nghe nhạc tuyệt vời cho người dùng hiện đại.</p>

<h2>🔊 Âm thanh chất lượng cao</h2>
<p>Với driver 12mm mạnh mẽ và công nghệ chống ồn chủ động (ANC), X-Pro cho âm bass sâu, treble rõ ràng và âm thanh sống động trong mọi môi trường.</p>

<h2>🕒 Thời lượng pin ấn tượng</h2>
<p>Tai nghe có thể sử dụng liên tục lên đến <strong>8 giờ</strong> chỉ với một lần sạc. Kèm theo hộp sạc giúp kéo dài tổng thời gian sử dụng lên đến <strong>30 giờ</strong>.</p>

<h2>📶 Kết nối ổn định</h2>
<p>Sử dụng công nghệ <strong>Bluetooth 5.3</strong> mới nhất, X-Pro đảm bảo kết nối nhanh chóng, ổn định và tiết kiệm năng lượng.</p>

<blockquote><em>"Đây là mẫu tai nghe tốt nhất tôi từng sử dụng trong tầm giá!" – Khách hàng thực tế</em></blockquote>

<h2>🎧 Thiết kế tiện dụng</h2>
<p>Thiết kế công thái học, nhỏ gọn, vừa vặn và thoải mái khi đeo trong thời gian dài. Chống nước chuẩn <strong>IPX5</strong> – phù hợp khi tập luyện, chơi thể thao.</p>

<h2>📦 Trong hộp gồm:</h2>
<ul>
  <li>1 cặp tai nghe X-Pro</li>
  <li>Hộp sạc không dây</li>
  <li>Dây sạc USB-C</li>
  <li>3 bộ nút tai với kích cỡ khác nhau</li>
  <li>Sách hướng dẫn</li>
</ul>

<h2>💰 Giá bán: <span style="color: red;">1.290.000đ</span></h2>
<p><strong>Ưu đãi:</strong> Giảm ngay 10% cho 100 khách hàng đầu tiên khi đặt mua trong hôm nay!</p>

<p><a href="/products/x-pro" style="color: blue; text-decoration: underline;">👉 Đặt mua ngay</a></p>
`} />
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
                            <StaticPageSidebar />
                        </section>
                    </div>
                </Container>
            </main>
        </div>
    );
}
