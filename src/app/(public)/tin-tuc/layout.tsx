

import Breadcrumb from "@/components/common/Breadcrumb";
import NewsSidebar from "./NewsSidebar";
import ProductRecommendSidebar from "./ProductRecommendSidebar";
import { Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Bảng tin | Điện máy V Share`,
    description: '',
    openGraph: {
      title: `Bảng tin | Điện máy V Share`,
      description: '',
      images: 'logo.jpg',
    },
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {

    const breadcrumbItems = [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Bảng tin V Share" }
    ];
    
    return (
        <div className="bg-gray-100">
            <Breadcrumb items={breadcrumbItems} />
            <main className="min-h-screen flex-grow py-6">
                    <div className="flex flex-col-reverse lg:flex-row justify-center gap-4">

                        <section className={`hidden md:block w-full lg:w-6/25 md:sticky top-4 h-80 md:h-screen overflow-y-auto 
                            pb-8 custom-2-scrollbar`}>
                            <ProductRecommendSidebar />
                        </section>

                        {children}

                        <section className={`hidden md:block w-full lg:w-6/25 md:sticky top-4 h-80 md:h-screen overflow-y-auto 
                            pb-8 custom-2-scrollbar`}>
                            <NewsSidebar />
                        </section>
                    </div>
            </main>
        </div>
    );
}