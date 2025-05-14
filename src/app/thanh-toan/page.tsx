"use client";

import { useCallback, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { Container } from "@mui/material";
import BreadcrumbStep from "@/components/common/OrderBreadcrumb";
import { validateOrderFormData } from "@/utils/ValidateForm";
import { throttle } from 'lodash';
import Breadcrumb from "@/components/common/Breadcrumb";

export default function Checkout() {
    
    const sampleProducts = [
    {
        id: '1',
        name: 'Quạt Bàn Usb Xoay Ít Ồn - Xanh Lá',
        image: '/test.jpg',
        quantity: 1,
        price: 699000,
    },
    {
        id: '2',
        name: 'Ruột Bút Mực Smooth Gel 0.5mm - Đen MUJI',
        image: '/test.jpg',
        quantity: 1,
        price: 119000,
        color: 'Đen',
    },
    {
        id: '3',
        name: 'Ruột Bút Mực Smooth Gel 0.5mm - Xanh Dương MUJI',
        image: '/test.jpg',
        quantity: 1,
        price: 219000,
        color: 'Xanh Dương',
    },
    ];
    const [checkoutData, setCheckoutData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const handleFormChange = (data: any) => {
        setCheckoutData(data);
    };

    const handleOrderSubmit = useCallback(throttle(async () => {
        const validationErrors = validateOrderFormData(checkoutData);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            console.log('Submit order with:', { checkoutData, products: sampleProducts });

        // Gửi dữ liệu đến backend (giả sử là /api/order)
        // await axios.post('/api/order', { checkoutData, products: sampleProducts });

        // Hiển thị thành công, chuyển trang...
        // router.push('/order-complete');

        } catch (err) {
            console.error('Order failed', err);
        } finally {
            setIsSubmitting(false);
        }
    }, 3000), [sampleProducts]); // User can submit every 3 seconds
    
    const steps = [
        { label: 'GIỎ HÀNG', url: '/gio-hang', isActive: false },
        { label: 'ĐẶT HÀNG', url: '/thanh-toan', isActive: true },
        { label: 'HOÀN THÀNH', url: '', isActive: false },
    ];
    
	const breadcrumbItems = [
		{ label: "Trang chủ", href: "/" },
		{ label: "Giỏ hàng", href: "/gio-hang" },
		{ label: "Thanh toán" },
  	];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} />
            <main className="flex-grow bg-gray-50 py-6">
                <Container maxWidth={"lg"}>
                    <BreadcrumbStep steps={steps} />

                    <div className="flex flex-col md:flex-row justify-center gap-4">
                        <section className="w-full lg:w-4/7">
                            <CheckoutForm onChange={handleFormChange} errors={formErrors}  />
                        </section>

                        <section className="w-full lg:w-3/7">
                            <OrderSummary 
                                products={sampleProducts} 
                                checkoutData={checkoutData}
                                isSubmitting={isSubmitting}
                                onSubmit={handleOrderSubmit}
                            />
                        </section>
                    </div>
                </Container>
            </main>
        </div>
    );
}
