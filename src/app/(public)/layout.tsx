// src/app/(public)/layout.tsx
import PublicLayout from '@/components/layouts/BaseLayoutComponent'; // Điều chỉnh đường dẫn nếu cần
import React from 'react';

export default function LayoutForPublicPages({ children }: { children: React.ReactNode }) {
  console.log('[LayoutForPublicPages] Wrapping with PublicLayout.');
  return <PublicLayout>{children}</PublicLayout>;
}