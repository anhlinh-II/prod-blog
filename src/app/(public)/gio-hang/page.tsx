"use client";

import { useState } from "react";
import CartItem from "@/components/product/CartItem";
import { Container } from "@mui/material";
import Toast from "@/components/common/Toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import OrderBreadcrumb from "@/components/common/OrderBreadcrumb";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useAppContext } from "@/utils/AppContext";


type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export default function Cart() {
    const { cart, removeFromCart, updateCartItemQuantity } = useAppContext();
    
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
            removeFromCart(itemToRemove.id);
            showToast(`Đã xóa "${itemToRemove.name}" khỏi giỏ hàng`, 'warning');
            setItemToRemove(null);
            setShowConfirm(false);
        }
    };

    const increaseQty = (id: number) => {
        const item = cart.find(i => i.id === id);
        if (!item) return;

        updateCartItemQuantity(id, item.quantity + 1);
    };

    const decreaseQty = (id: number) => {
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (item.quantity <= 1) {
            setItemToRemove(item);
            setShowConfirm(true);
        } else {
            updateCartItemQuantity(id, item.quantity - 1);
        }
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const steps = [
        { label: 'GIỎ HÀNG', url: '/gio-hang', isActive: true },
        { label: 'TẠO ĐƠN HÀNG', url: cart.length < 1 ? '' : '/don-hang', isActive: false },
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
                    <OrderBreadcrumb steps={steps} />
                    <h1 className="text-2xl font-bold ms-2 mb-2">Giỏ Hàng</h1>
                    <div className="grid grid-cols-1 md:grid-cols-[9fr_5fr] gap-8 p-2 max-w-6xl mb-10">
                        {/* Giỏ hàng */}
                        <div className="space-y-4">
                            <p className="mb-4 font-semibold border-b border-gray-300 pb-4">Mặt Hàng ({cart.length})</p>

                            {cart.length == 0 ? (
                                <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
                            ) : (
                                cart.map((item) => (
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
                                Thông tin đơn hàng ({cart.length})
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
                            <p className="text-base my-4 text-red-700">Khi tạo đơn hàng, nhân viên sẽ liên hệ và trao đổi với bạn thông qua số điện thoại</p>
                            <p className="text-base text-red-700">(Tuyệt đối không thanh toán trực tuyến)</p>

                            <Link href={`/don-hang`}>
                                <button className={`w-full bg-red-700 text-white py-2 rounded mt-4 font-bold 
                                    ${cart.length < 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                    disabled={cart.length < 1}>
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
