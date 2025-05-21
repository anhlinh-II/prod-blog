"use client";

import { useCallback, useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { Container } from "@mui/material";
import BreadcrumbStep from "@/components/common/OrderBreadcrumb";
import { validateOrderFormData } from "@/utils/ValidateForm";
import { throttle } from 'lodash';
import Breadcrumb from "@/components/common/Breadcrumb";
import { useAppContext } from "@/utils/AppContext";
import Toast from "@/components/common/Toast";
import { placeOrder } from "@/services/OrderService";
import { OrderItemRequest, OrderRequest } from "@/types/Order";
import { FaRegCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function Checkout() {
    const { cart, clearCart } = useAppContext();
    const [checkoutData, setCheckoutData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOrderplaced, setIsOrderplaced] = useState(false);
    const [orderID, setOrderID] = useState<number>();
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [toast, setToast] = useState<{
        message: string;
        visible: boolean;
        type?: 'success' | 'error' | 'warning';
    }>({
        message: '',
        visible: false,
        type: 'success',
    });
    
    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: '', visible: false, type }), 3000);
    };

    const handleFormChange = (data: any) => {
        setCheckoutData(data);
        setFormErrors({});
    };

    const handleOrderSubmit = useCallback(
        throttle(async () => {
            const validationErrors = validateOrderFormData(checkoutData);
            if (Object.keys(validationErrors).length > 0) {
                setFormErrors(validationErrors);
                return;
            }

            if (isSubmitting) return;

            if (cart.length === 0) {
                showToast('Giỏ hàng trống!', 'error');
                return;
            }

            setIsSubmitting(true);
            try {
                const orderItems: OrderItemRequest[] = cart.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                }));

                const orderRequest: OrderRequest = {
                    orderItems,
                    customerInfo: {
                        firstName: checkoutData.firstName,
                        lastName: checkoutData.lastName,
                        phone: checkoutData.phone,
                        email: checkoutData.email,
                        address: checkoutData.address,
                        note: checkoutData.note,
                    },
                    shippingCost: 0,
                    tax: 0,
                };

                const response = await placeOrder(orderRequest);

                setIsOrderplaced(true);
                setOrderID(response.result);
                showToast(`Đặt hàng thành công! Mã đơn: ${response.result}`, 'success');
                clearCart();
            } catch (err) {
                console.error('Order failed', err);
                showToast('Đặt hàng thất bại. Vui lòng thử lại.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        }, 5000),
        [checkoutData, cart, isSubmitting]
    );
    
    useEffect(() => {
        setIsOrderplaced(false);
    }, []);

    
    const steps = isOrderplaced ? [
        { label: 'GIỎ HÀNG', url: '/gio-hang', isActive: false },
        { label: 'TẠO ĐƠN HÀNG', url: '/don-hang', isActive: false },
        { label: 'HOÀN THÀNH', url: '', isActive: true },
    ] : [
        { label: 'GIỎ HÀNG', url: '/gio-hang', isActive: false },
        { label: 'TẠO ĐƠN HÀNG', url: '/don-hang', isActive: true },
        { label: 'HOÀN THÀNH', url: '', isActive: false },
    ];
    
	const breadcrumbItems = [
		{ label: "🏠 Trang chủ", href: "/" },
		{ label: "Giỏ hàng", href: "/gio-hang" },
		{ label: "Tạo đơn hàng" },
  	];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <main className="flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"} >
                    <BreadcrumbStep steps={steps} />

                    {!isOrderplaced ? (
                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <section className="w-full lg:w-4/7">
                            <CheckoutForm onChange={handleFormChange} errors={formErrors}  />
                        </section>

                        <section className="w-full lg:w-3/7">
                            <OrderSummary 
                                products={cart} 
                                checkoutData={checkoutData}
                                isSubmitting={isSubmitting}
                                onSubmit={handleOrderSubmit}
                            />
                        </section>
                    </div>
                    ) : (
                    <div className="max-w-3xl w-full mx-auto bg-white border border-gray-300 rounded-2xl shadow-lg p-6
                        flex flex-col items-center justify-center gap-4 my-16">
                        <p className="text-xl font-semibold">Đơn hàng được tạo thành công</p>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center">
                                <span className="text-green-500 text-3xl font-bold"><FaRegCircleCheck /></span>
                            </div>
                        </div>
                        <p>Mã đơn hàng: {orderID}</p>
                        <p className="text-lg text-gray-700">Nhân viên sẽ liên hệ và trao đổi với bạn thông qua số điện thoại</p>
                        <p className="text-base text-red-700">(Tuyệt đối không thanh toán trực tuyến)</p>
                        <button className="w-full mt-2 text-center text-gray-700 underline cursor-pointer">
                            <Link href={`/`}>
                                Về trang chủ
                            </Link>
                        </button>
                    </div>
                    )}
                    {/* Toast */}
                    <Toast message={toast.message} visible={toast.visible} type={toast.type} />
                </Container>
            </main>
        </div>
    );
}
