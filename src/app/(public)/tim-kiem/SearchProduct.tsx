'use client';

import { ProductShortResponse } from "@/types/Product";
import Pagination from "@/components/common/Pagination";
import { useEffect, useRef, useState } from "react";
import { getProductsWithMultiSort, searchProductsWithKeyword } from "@/services/ProductService";
import '@/app/globals.css';
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import { CategoryResponse } from "@/types";
import CategoryTreeMenuWrapper from "../danh-muc/CategoryWrapper";
import Filterbar from "../danh-muc/Filterbar";


interface SearchProps {
  params: {
    keyword?: string;
  };
}

export default function SearchProduct({ params }: SearchProps) {
    const keyword = params.keyword ? decodeURIComponent(params.keyword) : undefined;

    const [category, setCategory] = useState<CategoryResponse>();
    const [products, setProducts] = useState<ProductShortResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState(['price-asc']);
    const [currentPage, setCurrentPage] = useState(1);
    
    const productListRef = useRef<HTMLDivElement>(null);
    const prevLoadingRef = useRef(true);

    useEffect(() => {
        const fetchProducts = async () => {

            setIsLoading(true);
            try {
                if(keyword) {
                    const response = await searchProductsWithKeyword(keyword, currentPage - 1, 20);
                    setProducts(response.result.content);
                    setTotalPages(response.result.page.totalPages);
                } else {
                    const res = await getProductsWithMultiSort(
                        sortOption, 
                        'all', 
                        currentPage - 1, 
                        20);
                    setProducts(res.result.content);
                    setTotalPages(res.result.page.totalPages);
                }
            } catch (error) {
                console.error('Lỗi khi tìm kiếm sản phẩm:', error);
            } finally {
                setIsLoading(false);
            }
        };
        console.log(keyword)


        fetchProducts();
    }, [keyword, currentPage, sortOption]);


     // Scroll to top when filters/page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage, sortOption]);

    // If not desktop
    useEffect(() => {
        if (prevLoadingRef.current && !isLoading) {
            if (window.innerWidth < 1024 && productListRef.current) {
                productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        prevLoadingRef.current = isLoading;
    }, [isLoading]);

    const breadcrumbItems = !keyword ? [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Tìm kiếm sản phẩm"}
    ] : [
        { label: "🏠 Trang chủ", href: "/" },
        { label: `Kết quả tìm kiếm cho ${keyword}`}
    ];

    return (
        <div className="min-h-screen">
            <Breadcrumb items={breadcrumbItems} title={`${category?.name ? category?.name : 'SẢN PHẨM'}`}/>

            <div className="flex flex-col w-full lg:flex-row px-4 lg:px-20 py-8 gap-6">
                {/* Sidebar */}
                <aside className="w-full lg:w-9/40">
                    <CategoryTreeMenuWrapper categorySlug={undefined} setCategory={setCategory} />
                </aside>

                <section className="w-full lg:w-31/40 flex flex-col gap-4">
                    <section className="w-full" ref={productListRef}>
                        <Filterbar
                            selectedSort={sortOption}
                            setSelectedSort={setSortOption}
                        />
                    </section>

                    {/* Product Grid */}
                    <section className="w-full">
                        <ProductGrid products={products} isLoading={isLoading}/>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </section>
                </section>

            </div>
        </div>
    );
}
