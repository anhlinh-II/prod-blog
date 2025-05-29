"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { Container } from "@mui/material";
import BreadcrumbStep from "@/components/common/OrderBreadcrumb";
import { validateOrderFormData } from "@/utils/ValidateForm";
import { throttle } from 'lodash';
import Breadcrumb from "@/components/common/Breadcrumb";
import { useAppContext } from "@/utils/AppContext";
import Toast from "@/components/common/Toast";
import { deleteOrder, placeOrder } from "@/services/OrderService";
import { OrderItemRequest, OrderRequest } from "@/types/Order";
import { FaRegCircleCheck } from "react-icons/fa6";
import Link from "next/link";
import Image from 'next/image';
import ConfirmModal from "@/components/common/ConfirmModal";

export default function Checkout() {
    const { cart, clearCart } = useAppContext();
    const [checkoutData, setCheckoutData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOrderplaced, setIsOrderplaced] = useState(false);
    const [orderID, setOrderID] = useState<number>();
    const [orderSummary, setOrderSummary] = useState<{
        products: typeof cart;
        customerInfo: typeof checkoutData;
    } | null>(null);

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
    const [showConfirm, setShowConfirm] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    
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
                setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
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
                setOrderSummary({
                    products: cart,
                    customerInfo: checkoutData
                });
                showToast(`Đặt hàng thành công! Mã đơn: ${response.result}`, 'success');
                clearCart();
                
                setTimeout(() => {
                    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } catch (err) {
                console.error('Order failed', err);
                showToast('Đặt hàng thất bại. Vui lòng thử lại.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        }, 5000),
        [checkoutData, cart, isSubmitting]
    );

    const handleCancelOrder = async (id: number) => {

        try {
            await deleteOrder(id);
            showToast("Huỷ đơn hàng thành công", "success");
            setIsOrderplaced(false);
            setOrderSummary(null);
            setOrderID(undefined);
        } catch (err) {
            console.error("Cancel failed", err);
            showToast("Huỷ đơn hàng thất bại", "error");
        }
    };
    
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
        <div className="" ref={formRef}>
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
                    orderSummary && (
                    <div className="max-w-3xl w-full mx-auto bg-white border border-gray-300 rounded-2xl shadow-lg p-6
                        flex flex-col gap-6 my-16">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center mb-4">
                                <FaRegCircleCheck className="text-green-500 text-3xl" />
                            </div>
                            <p className="text-xl font-semibold">Đơn hàng được tạo thành công</p>
                            <p>Mã đơn hàng: {orderID}</p>
                            <p className="text-black text-center text-xl mt-2">
                                Nhân viên Điện máy V Share sẽ liên hệ với quý khách qua số điện thoại. <br />
                                <span className="text-red-700">(Tuyệt đối không thanh toán trực tuyến)</span>
                            </p>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <h3 className="text-lg font-bold text-gray-800">Thông tin khách hàng</h3>
                            <p>Họ tên: {orderSummary.customerInfo.firstName} {orderSummary.customerInfo.lastName}</p>
                            <p>SĐT: {orderSummary.customerInfo.phone}</p>
                            <p>Email: {orderSummary.customerInfo.email}</p>
                            <p>Địa chỉ: {orderSummary.customerInfo.address}</p>
                            <p>Ghi chú: {orderSummary.customerInfo.note}</p>
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <h3 className="text-lg font-bold text-gray-800">Sản phẩm đã đặt</h3>
                            {orderSummary.products.map(product => (
                                <div key={product.id} className="flex justify-start items-center gap-4 border-b py-2">
                                    {product.image && product.image != '' ? (
                                        <Image src={product.image} width={80} height={80} alt={product.name} className="w-20 h-20 object-contain" />
                                    ) : (
                                        <div className="w-20 h-20 object-cover rounded bg-gray-100 animate-pulse" />
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <p className="text-lg line-clamp-2">{product.name} x {product.quantity}</p>
                                        <p className="text-lg">{(product.price * product.quantity).toLocaleString()} VND</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            className="w-full mt-4 py-2 px-4 rounded bg-red-600 text-white font-semibold 
                                hover:bg-red-700 cursor-pointer"
                            onClick={() => setShowConfirm(true)}
                        >
                            Huỷ đơn hàng
                        </button>

                        <Link href="/" className="text-center text-gray-700 underline">
                            Về trang chủ
                        </Link>
                    </div>
                    )
                    )}
                    {/* Toast */}
                    <Toast message={toast.message} visible={toast.visible} type={toast.type} />
                    
                    <ConfirmModal
                        visible={showConfirm}
                        title="Huỷ đơn hàng đã đặt"
                        message={`Bạn có chắc chắn muốn huỷ đơn hàng vừa được đặt không?`}
                        onConfirm={() => {
                            handleCancelOrder(orderID!);
                            setShowConfirm(false);
                        }}
                        onCancel={() => setShowConfirm(false)}
                    />
                </Container>
            </main>
        </div>
    );
}
