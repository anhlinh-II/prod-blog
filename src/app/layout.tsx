// src/app/layout.tsx
import './globals.css'; // Các styles global của bạn
import { Providers } from './Providers';
import Head from 'next/head';

export const metadata = {
  title: 'Product Blog Web',
  description: 'A web application for product blogs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* DNS prefetch cho API server */}
        <link rel="dns-prefetch" href="http://localhost:8080" />
        
        {/* Preconnect để thiết lập kết nối sớm */}
        <link rel="preconnect" href="http://localhost:8080" crossOrigin="anonymous" />
        
        {/* Resource hints cho critical resources */}
        <link rel="prefetch" href="/api/medias/images/banners" />
      </Head>
      <body suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}