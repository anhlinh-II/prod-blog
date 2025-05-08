"use client";
import ProductItem from "./ProductItem";

const sampleProducts = [
    {
      name: "Bút Bi Bấm 0.5mm - Xanh Dương MUJI",
      image: "/test.jpg",
      tag: "",
      oldPrice: 35000,
      price: 25000,
    },
    {
      name: "Hộp Đựng Đồ Trang Điểm Pp 1/2",
      image: "/test.jpg",
      tag: "",
      oldPrice: 65000,
      price: 58000,
    },
    {
      name: "Hộp Đựng Đồ Trang Điểm Pp 1/2",
      image: "/test.jpg",
      tag: "",
      oldPrice: 65000,
      price: 58000,
    },
    {
      name: "Hộp Đựng Đồ Trang Điểm Pp 1/2",
      image: "/test.jpg",
      tag: "",
      oldPrice: 65000,
      price: 58000,
    },
    {
      name: "Hộp Đựng Đồ Trang Điểm Pp 1/2",
      image: "/test.jpg",
      tag: "",
      oldPrice: 65000,
      price: 58000,
    },
    {
      name: "Hộp Đựng Đồ Trang Điểm Pp 1/2",
      image: "/test.jpg",
      tag: "",
      oldPrice: 65000,
      price: 58000,
    },
    // ...more products
  ];
  
  export default function ProductGrid() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {sampleProducts.map((p, idx) => (
          <ProductItem {...p} />
        ))}
      </div>
    );
  }
  