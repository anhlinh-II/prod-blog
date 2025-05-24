// components/BannerSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useBanners } from "@/hooks/ReactQueries";


const BannerSlider = () => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const { data, isLoading, error } = useBanners();
	const prevRef = useRef(null);
	const nextRef = useRef(null);
	
	useEffect(() => {
		if (data?.result?.length && data.result.length > 0) {
			const preloadImages = data.result.slice(0, 2);
			preloadImages.forEach((banner) => {
				const img = new window.Image();
				img.src = `${apiUrl + banner.url}`;
			});
		}
	}, [data]);

	// Loading skeleton
	if (isLoading) {
		return (
			<div className="relative w-full aspect-[12/6] md:aspect-[16/6] overflow-hidden bg-gray-200 animate-pulse">
				<div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="relative w-full aspect-[12/6] md:aspect-[16/6] overflow-hidden bg-gray-100 flex items-center justify-center">
				<p className="text-gray-500">No banners available</p>
			</div>
		);
	}

	const banners = data?.result ?? [];

	return (
		<div className="relative w-full aspect-[12/6] md:aspect-[16/6] overflow-hidden">
			<Swiper
				modules={[Autoplay, Pagination, Navigation]}
				loop={banners.length > 1}
				autoplay={banners.length > 1 ? { delay: 5000, disableOnInteraction: false } : false}
				pagination={{
					clickable: true,
					bulletClass: "swiper-pagination-bullet",
					bulletActiveClass: "swiper-pagination-bullet-active",
				}}
				navigation={{
					prevEl: prevRef.current,
					nextEl: nextRef.current,
				}}
				onBeforeInit={(swiper) => {
					if (typeof swiper.params.navigation === "object") {
						const nav = swiper.params.navigation as { prevEl: any; nextEl: any };
						nav.prevEl = prevRef.current;
						nav.nextEl = nextRef.current;
					}
				}}
				className="w-full h-full"
			>
				{banners.map((banner, index) => (
					<SwiperSlide key={banner.id}>
						<div className="relative w-full h-full">
							<Image
								src={`${apiUrl + banner.url}`}
								alt={`banner ${banner.id}`}
								fill
								className="object-cover"
								// Priority cho slide đầu tiên
								priority={index === 0}
								// Eager loading cho 2 slide đầu
								loading={index < 2 ? "eager" : "lazy"}
								// Tối ưu sizes cho responsive
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
								// Placeholder cho loading state
								placeholder="blur"
								blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
							/>
						</div>
					</SwiperSlide>
				))}

				{/* Custom Navigation Buttons - chỉ hiện khi có nhiều hơn 1 slide */}
				{banners.length > 1 && (
					<>
						<button
							ref={prevRef}
							className="absolute h-full left-0 top-1/2 z-10 -translate-y-1/2 text-4xl cursor-pointer rounded-full p-2 ps-6
							hover:text-red-600 transition-all ease-in duration-150"
							aria-label="Previous slide"
						>
							<IoIosArrowBack />
						</button>
						<button
							ref={nextRef}
							className="absolute h-full right-0 top-1/2 z-10 -translate-y-1/2 text-4xl cursor-pointer rounded-full p-2 pe-6
							hover:text-red-600 transition-all ease-in duration-150"
							aria-label="Next slide"
						>
							<IoIosArrowForward />
						</button>
					</>
				)}
			</Swiper>

			{/* Custom Pagination Styling */}
			<style jsx global>{`
				.swiper-pagination-bullet {
					background-color: rgba(255, 255, 255, 0.7);
					border: 1px solid gray;
					width: 14px;
					height: 14px;
					margin: 0 6px !important;
					opacity: 1;
				}
				.swiper-pagination-bullet-active {
					background-color: #2563eb;
				}
			`}
			</style>
		</div>
	);
};

export default BannerSlider;