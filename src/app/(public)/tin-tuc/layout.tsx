'use client'

import Breadcrumb from "@/components/common/Breadcrumb";
import NewsSidebar from "./NewsSidebar";
import { useEffect, useState } from "react";
import ProductRecommendSidebar from "./ProductRecommendSidebar";
import { getRandomProducts } from "@/services/ProductService";
import { ProductShortResponse } from "@/types/Product";
import { useOldNews } from "@/hooks/ReactQueries";
import Head from "next/head";
import { usePathname } from "next/navigation";


const useSlugFromPath = () => {
  const pathname = usePathname(); 
  const segments = pathname.split('/').filter(Boolean);

  if (segments[0] === 'tin-tuc' && segments.length > 1) {
    return segments[1];
  }

  return undefined;
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    const slug = useSlugFromPath();
    const [products, setProducts] = useState<ProductShortResponse[]>([]);
    const { data, isLoading, error } = useOldNews();

    const newsList = data?.result?.content ?? [];

    const breadcrumbItems = slug == undefined ? [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Bảng tin V Share" }
    ] : 
    [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Tin tức", href: "/tin-tuc" },
        { label: slug }
    ];
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getRandomProducts(0, 12);
                setProducts(res.result.content);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if(window.innerWidth > 640) {
            fetchProducts();
        }
    }, []);
    

    return (
        <div className="bg-gray-100">
            <Breadcrumb items={breadcrumbItems} />
            <main className="min-h-screen flex-grow py-6">
                    <div className="flex flex-col-reverse lg:flex-row justify-center gap-4">

                        <section className={`hidden md:block w-full lg:w-6/25 md:sticky top-4 h-80 md:h-screen overflow-y-auto 
                            pb-8 custom-2-scrollbar`}>
                            <ProductRecommendSidebar products={products} />
                        </section>

                        {children}

                        <section className={`hidden md:block w-full lg:w-6/25 md:sticky top-4 h-80 md:h-screen overflow-y-auto 
                            pb-8 custom-2-scrollbar`}>
                            <NewsSidebar newsList={newsList}/>
                        </section>
                    </div>
            </main>
        </div>
    );
}