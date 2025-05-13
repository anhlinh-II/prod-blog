"use client";
import { ProductShortResponse } from "@/types/Product";
import ProductItem from "./ProductItem";

type ProductGridProps = {
	products: ProductShortResponse[];
  isLoading: boolean;
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p, idx) => (
          <ProductItem key={idx} product={p} />
        ))}
        {!isLoading && products.length < 1 && (
          <div>Không có sản phẩm nào thuộc danh mục này</div>
        )}
      </div>
    );
  }

export default ProductGrid;