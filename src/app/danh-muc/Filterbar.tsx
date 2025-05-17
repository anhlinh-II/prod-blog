"use client";

interface FilterbarProps {
  selectedSort: string[];
  setSelectedSort: (sort: string[]) => void;
}

export default function Filterbar({
  selectedSort,
  setSelectedSort,
}: FilterbarProps) {
  const sortOptions = [
    { label: "Mới nhất", value: "latest" },
    { label: "Bán chạy", value: "most-sold" },
    { label: "Phổ biến", value: "popularity" },
    { label: "Giá tăng dần", value: "price-asc" },
    { label: "Giá giảm dần", value: "price-desc" },
  ];

  const priceOptions = ["price-asc", "price-desc"];
  const otherOptions = ["latest", "most-sold", "popularity"];

  const handleChange = (value: string) => {
    const isPrice = priceOptions.includes(value);
    const isOther = otherOptions.includes(value);

    if (isPrice) {
      const otherSelected = selectedSort.find((v) => otherOptions.includes(v));
      setSelectedSort([value, ...(otherSelected ? [otherSelected] : [])]);
    } else if (isOther) {
      const priceSelected = selectedSort.find((v) => priceOptions.includes(v));
      setSelectedSort([value, ...(priceSelected ? [priceSelected] : [])]);
    }
  };

  return (
    <div className="border-b p-2 bg-white w-full flex flex-col md:flex-row items-start gap-4">
      <h3 className="text-lg font-semibold">Sắp xếp theo</h3>
      <div className="flex flex-wrap max-w-full md:flex-row items-start md:items-center md:justify-center gap-4 w-max">
        {sortOptions.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              name={priceOptions.includes(option.value) ? "price-sort" : "other-sort"}
              value={option.value}
              checked={selectedSort.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="peer hidden"
            />
            <span
              className={`
                inline-block px-3 py-1 rounded-full transition-all duration-300
                cursor-pointer border border-gray-400
                peer-checked:bg-red-600 peer-checked:text-white peer-checked:border-red-600
                hover:border-red-600
              `}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
