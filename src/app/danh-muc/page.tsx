"use client";

import Header from "@/components/Header";
import FilterSidebar from "../../components/FilterSidebar";
import ProductGrid from "../../components/product/ProductGrid";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import { useState } from "react";

export default function ProductListPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 6;

	return (
		<div className="flex flex-col min-h-screen">
		  <Header />
			<div className="flex flex-col w-full lg:flex-row px-4 lg:px-20 py-8 gap-6">
				{/* Sidebar */}
				<aside className="w-full lg:w-1/4">
					<FilterSidebar />
				</aside>

				{/* Product Grid */}
				<section className="w-full lg:w-3/4">
					<ProductGrid />
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={(page) => setCurrentPage(page)}
					/>
				</section>
			</div>
	  		<Footer />
		</div>
	);
}
