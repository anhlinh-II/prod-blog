// src/components/layouts/PublicLayout.tsx
'use client'; // Nếu Header, Footer, hoặc các component con là Client Components

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingSocialIcons from '@/components/FloatingSocialIcon';
import NewsPopup from '@/components/NewsPopup';
// Bạn có thể import các component chung khác cho trang public ở đây

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  console.log('[PublicLayout] Rendering children.');
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main> {/* Thêm flex-grow để main chiếm không gian */}
      <Footer />
      <FloatingSocialIcons />
      <NewsPopup />
    </div>
  );
}