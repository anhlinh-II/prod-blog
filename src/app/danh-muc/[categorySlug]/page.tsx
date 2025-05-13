"use client";

import { ProductShortResponse } from "@/types/Product";
import FilterSidebar from "../../../components/common/FilterSidebar";
import ProductGrid from "../../../components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";
import { useEffect, useState } from "react";
import { getProductsWithMultiSort } from "@/services/ProductService";
import CategoryTreeMenu from "@/components/CategoryTreeMenu";

interface ProductListPageProps {
  params: {
    categorySlug: string;
  };
}

export default function ProductListPage({ params }: ProductListPageProps) {
    const { categorySlug } = params;
	const [products, setProducts] = useState<ProductShortResponse[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Nếu có filter/sort:
	const [sortOption, setSortOption] = useState(['price-desc']);

	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setIsLoading(true);
				const res = await getProductsWithMultiSort(sortOption, categorySlug, currentPage - 1, 12);
				setProducts(res.result.content);
				setTotalPages(res.result.page.totalPages);
			} catch (error) {
				console.error("Error fetching products:", error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchProducts();
	}, [currentPage, sortOption, categorySlug]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [currentPage, sortOption]);


	return (
		<div className="">
			<div className="flex flex-col w-full lg:flex-row px-4 lg:px-20 py-8 gap-6">
				{/* Sidebar */}
				<aside className="w-full lg:w-1/4">
					<CategoryTreeMenu />
				</aside>

				<section className="w-full lg:w-3/4 flex flex-col gap-4">
					<section className="w-full">
						<FilterSidebar
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
