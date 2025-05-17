"use client";

import { useState } from "react";
import CartItem from "@/components/product/CartItem";
import { Container } from "@mui/material";
import Toast from "@/components/common/Toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import BreadcrumbStep from "@/components/common/OrderBreadcrumb";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";


type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Quạt Bàn Usb Xoay Ít Ồn - Xanh Lá',
            price: 699_000,
            quantity: 1,
            image: '/test.jpg',
        },
        {
            id: 2,
            name: 'Đèn Bàn Mini Có Điều Chỉnh Sáng - Trắng',
            price: 459_000,
            quantity: 2,
            image: '/test.jpg',
        },
        {
            id: 3,
            name: 'Đèn Bàn Mini Có Điều Chỉnh Sáng - Trắng',
            price: 459_000,
            quantity: 2,
            image: '/test.jpg',
        },
        {
            id: 4,
            name: 'Đèn Bàn Mini Có Điều Chỉnh Sáng - Trắng',
            price: 459_000,
            quantity: 2,
            image: '/test.jpg',
        },
        {
            id: 5,
            name: 'Đèn Bàn Mini Có Điều Chỉnh Sáng - Trắng',
            price: 459_000,
            quantity: 2,
            image: '/test.jpg',
        },
    ]);

    
    // trong Cart.tsx
    const [toast, setToast] = useState<{
        message: string;
        visible: boolean;
        type?: 'success' | 'error' | 'warning';
    }>({
        message: '',
        visible: false,
        type: 'success',
    });
    const [showConfirm, setShowConfirm] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

    
    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: '', visible: false, type }), 3000);
    };
    
    const handleDeleteClick = (item: CartItem) => {
        setItemToRemove(item);
        setShowConfirm(true);
      };
      
    const confirmRemove = () => {
    if (itemToRemove) {
        setCartItems((prev) => prev.filter((item) => item.id !== itemToRemove.id));
        showToast(`Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`, 'warning');
        setItemToRemove(null);
        setShowConfirm(false);
    }
    };

    const increaseQty = (id: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQty = (id: number) => {
        const item = cartItems.find((i) => i.id === id);
        if (!item) return;
      
        if (item.quantity <= 1) {
          setItemToRemove(item);
          setShowConfirm(true);
        } else {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            )
          );
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const steps = [
        { label: 'GIỎ HÀNG', url: '/gio-hang', isActive: true },
        { label: 'TẠO ĐƠN HÀNG', url: '/thanh-toan', isActive: false },
        { label: 'HOÀN THÀNH', url: '', isActive: false },
    ];
    
	const breadcrumbItems = [
		{ label: "🏠 Trang chủ", href: "/" },
		{ label: "Giỏ hàng" }
  	];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />

            <main className="flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"}>
                    <BreadcrumbStep steps={steps} />
                    <h1 className="text-2xl font-bold ms-2 mb-2">Giỏ Hàng</h1>
                    <div className="grid grid-cols-1 md:grid-cols-[9fr_5fr] gap-8 p-2 max-w-6xl mb-10">
                        {/* Giỏ hàng */}
                        <div className="space-y-4">
                            <p className="mb-4 font-semibold border-b border-gray-300 pb-4">Mặt Hàng ({cartItems.length})</p>

                            {cartItems.length === 0 ? (
                                <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
                            ) : (
                                cartItems.map((item) => (
                                    <CartItem
                                    key={item.id}
                                    {...item}
                                    onIncrease={increaseQty}
                                    onDecrease={decreaseQty}
                                    onRemove={() => handleDeleteClick(item)}
                                    />
                                ))
                            )}
                        </div>

                        {/* Thông tin đơn hàng */}
                        <div className="p-6 rounded-xl h-max border border-gray-300">
                            <h2 className="text-lg font-bold mb-4">
                                Thông tin đơn hàng ({cartItems.length})
                            </h2>
                            <div className="flex justify-between mb-2">
                                <span>Tạm tính</span>
                                <span>{subtotal.toLocaleString()} VND</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Phí vận chuyển</span>
                                <span>Chưa Tính Toán</span>
                            </div>

                            <hr className="my-4" />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Tổng tiền</span>
                                <span>{subtotal.toLocaleString()} VND</span>
                            </div>
                            <p className="text-sm text-gray-500">(Đã bao gồm VAT)</p>

                                <Link href={`/thanh-toan`}>
                            <button className="w-full bg-black text-white py-2 rounded mt-4 font-bold cursor-pointer">
                                    Tạo đơn hàng
                            </button>
                                </Link>
                            <button className="w-full mt-2 text-center text-gray-700 underline cursor-pointer">
                                <Link href={`/`}>
                                    Tiếp tục xem sản phẩm khác
                                </Link>
                            </button>
                        </div>
                    </div>
                    
                    {/* Toast */}
                    <Toast message={toast.message} visible={toast.visible} type={toast.type} />

                    <ConfirmModal
                        visible={showConfirm}
                        message={`Bạn có chắc chắn muốn xoá "${itemToRemove?.name}" khỏi giỏ hàng?`}
                        onConfirm={confirmRemove}
                        onCancel={() => setShowConfirm(false)}
                    />
                </Container>
            </main>
        </div>
    );
}
