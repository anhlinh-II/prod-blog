// src/app/layout.tsx
import './globals.css'; // Các styles global của bạn
import { Providers } from './Providers';

export const metadata = {
  title: 'Product Blog Web',
  description: 'A web application for product blogs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch cho API server */}
        <link rel="dns-prefetch" href={apiUrl} />
        
        {/* Preconnect để thiết lập kết nối sớm */}
        <link rel="preconnect" href={apiUrl} crossOrigin="anonymous" />
        
        {/* Resource hints cho critical resources */}
        <link rel="prefetch" href={`${apiUrl}/api/medias/images/banner`} />
      </head>
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