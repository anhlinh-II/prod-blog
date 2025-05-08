// components/Footer.tsx
'use client';
import React from 'react';

// components/Footer.tsx
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-sm text-gray-800 py-10 px-4 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Logo & Bộ Công Thương */}
        <div className="space-y-4">
          <img src="" alt="Logo" className="w-24" />
          <img src="" alt="Bộ Công Thương" className="w-36" />
        </div>

        {/* Về MUJI */}
        <div>
          <h3 className="font-semibold mb-2">Về MUJI</h3>
          <ul className="space-y-1">
            <li>MUJI là gì?</li>
            <li>Thông báo</li>
            <li>Cơ hội nghề nghiệp</li>
            <li>Câu hỏi thường gặp</li>
            <li>MUJI Catalog Hàng Gia Dụng</li>
          </ul>
        </div>

        {/* Cửa hàng bán lẻ */}
        <div>
          <h3 className="font-semibold mb-2">Cửa hàng Bán lẻ</h3>
          <ul className="space-y-1">
            <li>Chính sách Đổi, Trả, Hoàn tiền</li>
            <li>Danh sách cửa hàng</li>
          </ul>
        </div>

        {/* Cửa hàng trực tuyến */}
        <div>
          <h3 className="font-semibold mb-2">Cửa hàng Trực tuyến</h3>
          <ul className="space-y-1">
            <li>Chính sách Bán hàng</li>
            <li>Chính sách Giao hàng</li>
            <li>Chính sách Trả hàng, Hoàn tiền</li>
            <li>Chính sách Đổi hàng</li>
            <li>Chính sách Bảo hành</li>
            <li>Chính sách Bảo mật</li>
          </ul>
        </div>

        {/* Đăng ký nhận tin + Mạng xã hội */}
        <div className="space-y-4">
          <h3 className="font-semibold">Đăng ký nhận bản tin từ MUJI</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="p-2 border border-gray-300 rounded-l w-full"
            />
            <button className="bg-red-800 text-white px-4 rounded-r">Đăng ký</button>
          </div>
          <div className="flex space-x-4 mt-4 text-2xl">
            <SiZalo />
            <FaFacebookF />
            <FaInstagram />
            <FaTiktok />
          </div>
        </div>
      </div>
    </footer>
  );
}

