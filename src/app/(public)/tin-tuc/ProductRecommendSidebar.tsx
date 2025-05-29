'use client'
import { getRandomProducts } from '@/services/ProductService';
import { ProductShortResponse } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';

const ProductRecommendSidebar = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [products, setProducts] = useState<ProductShortResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getRandomProducts(0, 12);
                setProducts(res.result.content);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (window.innerWidth > 640) {
            fetchProducts();
        } else {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="w-full max-w-sm rounded-lg p-4">
            <div className='border-b border-red-700 mb-4 flex justify-between items-end'>
                <div className='home-title w-max ps-8 pe-8 py-1 text-white'>
                    <h2 className="text-base font-semibold">Sản phẩm gợi ý</h2>
                </div>
                <Link href={`/danh-muc`} className='flex items-center hover:text-red-600'>
                    <span className="text-sm mb-1 md:me-2">Tất cả</span>
                    <span className="arrow arrow-1"><IoIosArrowForward /></span>
                    <span className="arrow arrow-2"><IoIosArrowForward /></span>
                    <span className="arrow arrow-3"><IoIosArrowForward /></span>
                </Link>
            </div>

            <div className="space-y-4">
                {isLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between pb-2 border-b border-gray-300 mb-2 animate-pulse"
                        >
                            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                            <div className="min-w-16 max-w-16 h-16 bg-gray-200"></div>
                        </div>
                    ))
                    : products.map((product) => (
                        <Link key={product.id} href={`/san-pham/${product.slug}`}>
                            <div
                                className="flex items-center justify-between pb-2 border-b border-gray-300 mb-2
                                    text-gray-800 hover:text-red-700 hover:scale-105 transition-all ease-in duration-150"
                            >
                                <span className="text-sm font-semibold line-clamp-2">{product.name}</span>
                                {product.image ? (
                                    <Image
                                        src={apiUrl + product.image}
                                        alt={product.name}
                                        width={64}
                                        height={64}
                                        className="object-contain min-w-16 min-h-16"
                                        sizes="(max-width: 64px) 64px 64px"
                                    />
                                ) : (
                                    <div className='min-w-16 max-w-16 h-16 bg-gray-200'></div>
                                )}
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default ProductRecommendSidebar;
