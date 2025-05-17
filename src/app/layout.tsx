// src/app/layout.tsx
import Header from '@/components/Header';
import './globals.css'; // Các styles global của bạn
import Footer from '@/components/Footer';
import FloatingSocialIcons from '@/components/FloatingSocialIcon';
import { Providers } from './Providers';
import NewsPopup from '@/components/NewsPopup';

export const metadata = {
  title: 'Product Blog Web',
  description: 'A web application for product blogs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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