// src/components/layouts/PublicLayout.tsx
'use client'; // Nếu Header, Footer, hoặc các component con là Client Components

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LinearProgress } from '@mui/material';

const Header = dynamic(() => import('@/components/Header').then(mod => mod.default), {
  ssr: false,
  loading: () => <LinearProgress sx={{ position: 'sticky', top: 0, zIndex: 1201 }} />
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false
});

const FloatingSocialIcons = dynamic(() => import('@/components/FloatingSocialIcon'), {
  ssr: false
});

const NewsPopup = dynamic(() => import('@/components/NewsPopup'), {
  ssr: false
});

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<LinearProgress sx={{ position: 'sticky', top: 0, zIndex: 1201 }} />}>
        <Header />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingSocialIcons />
      <NewsPopup />
    </div>
  );
}