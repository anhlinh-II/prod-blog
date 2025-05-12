'use client';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import ProductItem from './ProductItem';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const products = [
    {
        name: 'MUJI Gối Soybean Fiber - L',
        image: '/test.jpg',
        tag: 'MỚI',
        oldPrice: 899000,
        price: 883000,
    },
    {
        name: 'MUJI Gối Cotton Soft MUJI Gối Soybean Fiber - L',
        image: '/test.jpg',
        tag: '',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton Soft',
        image: '/test.jpg',
        tag: 'MỚI',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton Soft MUJI Gối Soybean Fiber - L MUJI Gối Soybean Fiber - L',
        image: '/test.jpg',
        tag: '',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton SoftMUJI Gối Soybean Fiber - L',
        image: '/test.jpg',
        tag: '',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton Soft',
        image: '/test.jpg',
        tag: 'MỚI',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton Soft',
        image: '/test.jpg',
        tag: '',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton Soft',
        image: '/test.jpg',
        tag: 'MỚI',
        oldPrice: 750000,
        price: 715000,
    },
    {
        name: 'MUJI Gối Cotton Soft MUJI Gối Cotton Soft MUJI Gối Cotton SoftMUJI Gối Cotton Soft',
        image: '/test.jpg',
        tag: 'MỚI',
        oldPrice: 750000,
        price: 715000,
    },
    // Thêm các sản phẩm khác ở đây...
];

export default function ProductCarousel() {
    const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
        slides: {
            perView: 2,
            spacing: 8,
        },
        breakpoints: {
            '(min-width: 640px)': {
                slides: { perView: 2, spacing: 8 },
            },
            '(min-width: 1024px)': {
                slides: { perView: 3, spacing: 24 },
            },
            '(min-width: 1280px)': {
                slides: { perView: 5, spacing: 16 },
            },
        },
    });

    const prev = () => slider.current?.prev();
    const next = () => slider.current?.next();

    return (
        <div className="relative">
            {/* Buttons */}
            <button
                onClick={prev}
                className="hidden md:block absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 bg-white text-2xl
                shadow rounded-full hover:bg-red-900 hover:text-white cursor-pointer"
            >
                <IoIosArrowBack />
            </button>

            <button
                onClick={next}
                className="hidden md:block absolute -right-16 top-1/2 -translate-y-1/2 z-10 p-2 bg-white text-2xl
                shadow rounded-full hover:bg-red-900 hover:text-white cursor-pointer"
            >
                <IoIosArrowForward />
            </button>

            {/* Carousel */}
            <div className="sm:overflow-visible overflow-x-auto -mx-4 ps-4">
                <div ref={sliderRef} className="keen-slider">
                {products.map((product, index) => (
                    <div className="keen-slider__slide" key={index}>
                        <ProductItem {...product} />
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}