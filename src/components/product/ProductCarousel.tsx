'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import ProductItem from './ProductItem';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ProductShortResponse } from '@/types/Product';
import { useEffect, useState } from 'react';

type ProductCarouseltProps = {
    products?: ProductShortResponse[];
    isLoading?: boolean;
};

export default function ProductCarousel({ products, isLoading }: ProductCarouseltProps) {
    const getCurrentPerView = () => {
        if (typeof window === "undefined") return 2;
        if (window.innerWidth >= 1280) return 5;
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 640) return 4;
        return 2;
    };

    const [isSliderMode, setIsSliderMode] = useState(true);

    useEffect(() => {
        const checkMode = () => {
            if (products) {
                const isMobile = window.innerWidth < 640;
                const shouldSlider =
                    products.length > (isMobile ? 999 : getCurrentPerView());
                setIsSliderMode(shouldSlider);
            }
        };

        checkMode();
        window.addEventListener("resize", checkMode);
        return () => window.removeEventListener("resize", checkMode);
    }, [products]);

    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        slides: {
            perView: 2,
            spacing: 8,
        },
        breakpoints: {
            '(min-width: 640px)': {
                slides: { perView: 4, spacing: 8 },
            },
            '(min-width: 1024px)': {
                slides: { perView: 4, spacing: 8 },
            },
            '(min-width: 1280px)': {
                slides: { perView: 5, spacing: 8 },
            },
        },
    });

    const prev = () => slider.current?.prev();
    const next = () => slider.current?.next();

    return (
        !isLoading ? (
            
        <div className="relative">

            {isSliderMode && products?.length && products?.length > 5 && (
                <button
                    onClick={prev}
                    className="hidden lg:block absolute h-fit left-24 md:-left-12 -bottom-16 md:top-1/2 -translate-y-1/2 z-10 p-2 text-2xl
                    rounded-full hover:bg-red-900 hover:text-white cursor-pointer transition-all ease-in duration-150
                    bg-red-800 text-white md:text-black md:bg-transparent"
                >
                    <IoIosArrowBack />
                </button>
            )}
            
            {isSliderMode && products?.length && products?.length > 5 && (
                <button
                    onClick={next}
                    className="hidden lg:block absolute h-fit right-24 md:-right-12 -bottom-16 md:top-1/2 -translate-y-1/2 z-10 p-2 text-2xl
                    rounded-full hover:bg-red-900 hover:text-white cursor-pointer transition-all ease-in duration-150
                    bg-red-800 text-white md:text-black md:bg-transparent"
                >
                    <IoIosArrowForward />
                </button>
            )}

            {products && (
                isSliderMode ? (
                    <div ref={sliderRef} className="keen-slider">
                        {products.map((product, index) => (
                            <div className="keen-slider__slide" key={index}>
                                <ProductItem product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {products.map((product, index) => (
                            <ProductItem key={index} product={product} />
                        ))}
                    </div>
                )
            )}

        </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[1,2,3,4,5].map((index) => (
                    <div key={index} className="w-[224px] h-[300px] rounded-xl bg-gray-200 animate-pulse"></div>
                ))}
            </div>
        )
    );
}