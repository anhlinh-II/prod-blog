"use client";
import { ProductShortResponse } from '@/types/Product';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProductItemProps = {
  product: ProductShortResponse;
};

export default function ProductItem({ product }: ProductItemProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [isNew, setIsNew] = useState(false);
  const [price, setPrice] = useState(0);
  
  useEffect(() => {
    
    const now = new Date();
    const createdAt = new Date(product.createdAt);
    const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    setIsNew(diffInDays <= 7);
    
    setPrice(product.price * (100 - product.discountPercent) / 100);
  }, [product]);

  return (
    <div className="w-full max-w-[224px] border rounded-xl overflow-hidden shadow-sm bg-white 
      hover:shadow-xl hover:text-red-800 group">
      <Link href={`/san-pham/${product.slug}`}>
      <div className="relative overflow-hidden">
        {isNew && (
          <div className="absolute top-2 left-2 bg-[#a21212] text-white text-xs font-bold px-2 py-1 rounded z-5">
            MỚI
          </div>
        )}
        {product.image ? (
        <div className='overflow-hidden'>
          <Image
            src={`${apiUrl}${product.image}`}
            alt={product.name}
            width={200}
            height={150}
            className="object-cover w-full cursor-pointer aspect-[4/3] min-h-[170px] group-hover:scale-105 transition-transform duration-200"
            priority={true}
          />
        </div>
        ) : (
        <div className='w-full h-[170px] bg-gray-100 animate-pulse'></div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <p className="text-base font-medium line-clamp-3 min-h-[4.5rem] cursor-pointer">{product.name} </p>

        <div className="relative flex items-center justify-between">
          <span className="text-gray-500 line-through text-sm">
            {product.price.toLocaleString()} VND
          </span>
          
          {product.discountPercent && product.discountPercent != 0 && (
          <span className="absolute -bottom-1 right-0 bg-red-600 text-white text-sm p-1 rounded-lg">
            -{product.discountPercent}%
          </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[#a00404]">
            {price.toLocaleString()} VND
          </span>
        </div>

        <button className="w-full mt-2 py-2 border border-gray-500 rounded font-medium 
            text-sm hover:bg-red-900 hover:text-white cursor-pointer transition-all ease-in duration-150">
          Liên hệ
        </button>
      </div>
      </Link>
    </div>
  );
}
