"use client";
import { ProductShortResponse } from "@/types/Product";
import ProductItem from "./ProductItem";

type ProductGridProps = {
	products?: ProductShortResponse[];
  isLoading: boolean;
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
    return (
      <div className="md:min-h-94 grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-2">
        {products && products.map((p, idx) => (
          <ProductItem key={idx} product={p} />
        ))}
        {!isLoading && products && products.length < 1 && (
          <div>Không có sản phẩm nào thuộc danh mục này</div>
        )}
      </div>
    );
  }

export default ProductGrid;