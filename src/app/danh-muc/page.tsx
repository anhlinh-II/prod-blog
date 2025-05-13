"use client";

import FilterSidebar from "../../components/common/FilterSidebar";
import ProductGrid from "../../components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";
import { useState } from "react";

export default function ProductListPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = 8;

	return (
		<div className="">
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
		</div>
	);
}
