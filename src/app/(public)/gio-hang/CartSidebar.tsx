// components/gio-hang/CartSidebar.tsx

import { useAppContext } from "@/utils/AppContext";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CartSidebar = () => {
  const { cart, isCartVisible, toggleCart } = useAppContext();

  if (!isCartVisible) return null;

  return (
    <div className="fixed top-16 right-0 w-80 bg-white shadow-lg z-50 p-4 overflow-y-auto rounded-bl-2xl border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Giỏ hàng</h2>
        <button onClick={toggleCart} className=" cursor-pointer">
          <X size={20} />
        </button>
      </div>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <div>
        <ul className="space-y-4">
          {cart.map(item => (
            <li key={item.id} className="flex items-center justify-between border-t border-gray-300 py-2 ">
              <div className="flex items-center gap-2">
                {item.image && item.image != '' ? (
                <Image src={item.image} alt={item.name} width={48} height={48} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 object-cover rounded bg-gray-100 animate-pulse" />
                )}
                <div>
                  <p className="font-semibold line-clamp-2 max-w-60">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} × {item.price.toLocaleString()}đ</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        

      <Link href={`/gio-hang`} onClick={toggleCart}>
        <button className="w-full mt-2 py-2 border border-gray-500 rounded font-medium 
            text-sm hover:bg-[#00A650] hover:text-white cursor-pointer transition-all ease-in duration-150">
          Xem giỏ hàng
        </button>
      </Link>

      <Link href={`/don-hang`} onClick={toggleCart}>
        <button className="w-full mt-2 py-2 border border-gray-500 rounded font-medium 
            text-sm hover:bg-[#00A650] hover:text-white cursor-pointer transition-all ease-in duration-150">
          Tạo đơn hàng
        </button>
      </Link>
      </div>
      )}
    </div>
  );
};

export default CartSidebar;
