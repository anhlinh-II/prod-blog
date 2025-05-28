// components/Footer.tsx
'use client';
import Image from 'next/image';
import React from 'react';
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAllStaticPages } from '@/services/StaticPageService';
import { StaticPageResponse, StaticPageType } from '@/types/News';

export default function Footer() {
  const [pagesByType, setPagesByType] = useState<Record<StaticPageType, StaticPageResponse[]>>({
    ABOUT: [],
    POLICY: [],
    GUIDE: [],
  });

  useEffect(() => {
    async function fetchPages() {
      const res = await getAllStaticPages(0, 100);
      const grouped: Record<StaticPageType, StaticPageResponse[]> = {
        ABOUT: [],
        POLICY: [],
        GUIDE: [],
      };
      res.result.content.forEach((page: StaticPageResponse) => {
        if (grouped[page.type]) grouped[page.type].push(page);
      });
      setPagesByType(grouped);
    }
    fetchPages();
  }, []);

  return (
    <footer className="sticky top-full bg-gray-100 text-sm text-gray-800 py-10 px-4 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Logo & Bộ Công Thương */}
        <div className="space-y-6">
        </div>

        {/* Về MUJI */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">Về chúng tôi</h3>
          <ul className="space-y-2">
            {/* Static pages ABOUT */}
            {pagesByType.ABOUT.map(page => (
              <li key={page.id}>
                <Link href={`/${page.slug}`} className="hover:text-red-800 transition-colors">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cửa hàng bán lẻ */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">Chính sách</h3>
          <ul className="space-y-2">
            {/* Static pages POLICY */}
            {pagesByType.POLICY.map(page => (
              <li key={page.id}>
                <Link href={`/${page.slug}`} className="hover:text-red-800 transition-colors">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cửa hàng trực tuyến */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-3">Hướng dẫn</h3>
          <ul className="space-y-2">
            {/* Static pages GUIDE */}
            {pagesByType.GUIDE.map(page => (
              <li key={page.id}>
                <Link href={`/${page.slug}`} className="hover:text-red-800 transition-colors">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Đăng ký nhận tin + Mạng xã hội */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-3">Đăng ký nhận bản tin</h3>
          <div className="flex">
            <input
              type="email"
              placeholder="Nhập địa chỉ email"
              className="p-2 border border-gray-300 rounded-l w-full focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <button className="bg-red-800 text-white px-4 rounded-r hover:bg-red-700 transition-colors">
              Đăng ký
            </button>
          </div>
          <div className="flex space-x-6 mt-4 text-2xl">
            <SiZalo className="hover:text-red-800 transition-colors" />
            <FaFacebookF className="hover:text-red-800 transition-colors" />
            <FaInstagram className="hover:text-red-800 transition-colors" />
            <FaTiktok className="hover:text-red-800 transition-colors" />
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        <p>&copy; 2025 . All rights reserved.</p>
      </div>
    </footer>
  );
}

