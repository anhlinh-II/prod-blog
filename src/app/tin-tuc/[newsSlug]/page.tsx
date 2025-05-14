"use client";

import { useCallback, useState } from "react";
import { Container } from "@mui/material";
import Breadcrumb from "@/components/common/Breadcrumb";
import NewsSidebar from "../NewsSidebar";
import PostViewer from "@/components/common/PostViewer";

export default function NewsPage() {

    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
        { label: "Tin tức", href: "/tin-tuc" },
        { label: "Tin tức" }
    ];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <main className="min-h-screen flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"}>

                    <div className="flex flex-col lg:flex-row justify-center gap-4">
                        <section className="w-full lg:w-5/7">
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
