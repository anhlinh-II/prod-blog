// components/NewsSidebar.tsx
'use client'
import { ProductShortResponse } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

type Props = {
	products: ProductShortResponse[];
};

const ProductRecommendSidebar: React.FC<Props> = ({ products }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
				{products.map((product) => (
                    <Link key={product.id} 
                        href={`/san-pham/${product.slug}`} 
                        className=''>
					<div
						className="flex items-center justify-between pb-2  border-b border-gray-300 mb-2
                            text-gray-800 hover:text-red-700 hover:scale-105 transition-all ease-in duration-150"
					>
						<span className="text-base font-semibold line-clamp-2">{product.name}</span>
						{product.image && product.image != '' ? (
                        <Image
							src={apiUrl + product.image}
							alt={product.name}
                            width={64}
                            height={64}
							className="w-16 h-16 object-cover rounded"
						/>
                        ) : (
                        <div className='min-w-16 max-w-16 h-16 bg-gray-200 animate-pulse'>
                        
                        </div>
                        )}
					</div>
                    </Link>
				))}
			</div>
		</div>
	);
};

export default ProductRecommendSidebar;
