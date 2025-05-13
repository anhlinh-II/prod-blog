// components/BannerSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const banners = [
	{ id: 1, src: "/banner1.jpg", alt: "Banner 1" },
	{ id: 2, src: "/banner2.webp", alt: "Banner 2" },
	{ id: 3, src: "/banner3.webp", alt: "Banner 3" },
];

const BannerSlider = () => {
	const prevRef = useRef(null);
	const nextRef = useRef(null);

	return (
		<div className="relative w-full aspect-[16/6] overflow-hidden">
			<Swiper
				modules={[Autoplay, Pagination, Navigation]}
				loop={true}
				autoplay={{ delay: 5000, disableOnInteraction: false }}
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
				{banners.map((banner) => (
					<SwiperSlide key={banner.id}>
						<div className="relative w-full h-full">
							<Image
								src={banner.src}
								alt={banner.alt}
								fill
								className="object-cover"
								priority
							/>
						</div>
					</SwiperSlide>
				))}

				{/* Custom Navigation Buttons */}
				<button
					ref={prevRef}
					className="absolute h-full left-0 top-1/2 z-10 -translate-y-1/2 text-4xl cursor-pointer rounded-full p-2 ps-6
					hover:text-red-600 transition-all ease-in duration-150"
				>
					<IoIosArrowBack />
				</button>
				<button
					ref={nextRef}
					className="absolute h-full right-0 top-1/2 z-10 -translate-y-1/2 text-4xl cursor-pointer rounded-full p-2 pe-6
					hover:text-red-600 transition-all ease-in duration-150"
				>
					<IoIosArrowForward />
				</button>
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
