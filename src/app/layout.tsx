import Header from '@/components/Header';
import './globals.css';
import Footer from '@/components/Footer';
import FloatingSocialIcons from '@/components/FloatingSocialIcon';
import { Providers } from './Providers';

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
              <Header />
              {children}
              <Footer />
              <FloatingSocialIcons />
            </div>
          </Providers>
        </body>
    </html>
  );
}