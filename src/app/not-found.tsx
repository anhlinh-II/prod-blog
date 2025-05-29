// app/not-found.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-6">Trang bạn tìm không tồn tại</p>
            <p onClick={() => router.back()} className="text-blue-500 hover:underline text-lg cursor-pointer mb-4">Trở lại trang trước</p>
            <Link href="/" className="text-blue-500 hover:underline text-lg">
                Về trang chủ
            </Link>
            <div className='flex items-center gap-2'>
                <Link href="/danh-muc" className="text-blue-500 hover:underline text-lg">
                    Danh mục sản phẩm
                </Link>
                <hr className='h-4 w-0.25 bg-gray-500'></hr>
                <Link href="/tin-tuc" className="text-blue-500 hover:underline text-lg">
                    Đến Bảng tin V Share
                </Link>
            </div>
        </div>
    );
}
