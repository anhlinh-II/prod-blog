"use client";

import { useState } from "react";

interface FilterSidebarProps {
  selectedSort: string[];
  setSelectedSort: (sort: string[]) => void;
}
export default function FilterSidebar({
  selectedSort,
  setSelectedSort,
}: FilterSidebarProps) {
  const sortOptions = [
    { label: "Mới nhất", value: "latest" },
    { label: "Bán chạy", value: "most-sold" },
    { label: "Phổ biến", value: "popularity" },
    { label: "Giá tăng dần", value: "price-asc" },
    { label: "Giá giảm dần", value: "price-desc" },
  ];

  return (
    <div className="border-b p-4 bg-white w-full">
      <div className="flex items-center justify-center gap-4 w-max">
        <h3 className="text-lg font-semibold">Sắp xếp sản phẩm</h3>
        {sortOptions.map((option) => (
          <label key={option.value} className="flex items-center justify-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="sort"
              value={option.value}
              checked={selectedSort.includes(option.value)}
              onChange={() => setSelectedSort([option.value])}
              className="accent-red-600 w-4 h-4"
            />
            <span className="text-base w-max">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

