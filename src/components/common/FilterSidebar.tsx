// components/common/FilterSidebar.tsx
export default function FilterSidebar() {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">🔧 Bộ Lọc</h2>
  
        {/* Price Filter */}
        <div>
          <h3 className="font-semibold mb-2">Giá (VND)</h3>
          <div className="flex gap-2 items-center">
            <input type="number" className="border w-1/2 p-1 rounded" placeholder="19.000" />
            <span>-</span>
            <input type="number" className="border w-1/2 p-1 rounded" placeholder="5.890.000" />
          </div>
          {/* Replace with real slider if needed */}
          <div className="h-1 bg-red-900 mt-2 rounded-full" />
        </div>
  
        {/* Size Filter */}
        <div>
          <h3 className="font-semibold mb-2">Kích Cỡ</h3>
          {["110", "120", "130", "140", "140*200Cm", "150"].map((size) => (
            <label key={size} className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>{size}</span>
            </label>
          ))}
        </div>
  
        {/* Color Filter */}
        <div>
          <h3 className="font-semibold mb-2">Màu Sắc</h3>
          {["Đỏ", "Xám", "Đen", "Trắng"].map((color) => (
            <label key={color} className="flex items-center space-x-2">
              <input type="checkbox" />
              <span>{color}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
  