// components/gio-hang/CartSidebar.tsx

import { useAppContext } from "@/utils/AppContext";
import { X } from "lucide-react";

const CartSidebar = () => {
  const { cart, removeFromCart, isCartVisible, toggleCart } = useAppContext();

  if (!isCartVisible) return null;

  return (
    <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Giỏ hàng</h2>
        <button onClick={toggleCart}>
          <X size={20} />
        </button>
      </div>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <ul className="space-y-4">
          {cart.map(item => (
            <li key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} × {item.price.toLocaleString()}đ</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600">Xoá</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CartSidebar;
