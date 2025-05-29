// src/app/(public)/layout.tsx
import PublicLayout from '@/components/layouts/BaseLayoutComponent'; // Điều chỉnh đường dẫn nếu cần
import { Metadata } from 'next';
import React from 'react';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Trang chủ | Điện máy V Share`,
    description: '',
    openGraph: {
      title: `Trang chủ | Điện máy V Share`,
      description: '',
      images: 'logo.jpg',
    },
  };
}


export default function LayoutForPublicPages({ children }: { children: React.ReactNode }) {
  console.log('[LayoutForPublicPages] Wrapping with PublicLayout.');
  return <PublicLayout>{children}</PublicLayout>;
}