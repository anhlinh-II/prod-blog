import { CheckoutFormData } from "@/app/thanh-toan/CheckoutForm";

export const validateOrderFormData = (data: CheckoutFormData) => {
    const newErrors: { [key: string]: string } = {};
    
    if (data.website?.trim() !== '') {
        newErrors.website = 'Phát hiện spam';
    }

    if (!data.firstName.trim()) newErrors.firstName = 'Vui lòng nhập tên';
    if (!data.lastName.trim()) newErrors.lastName = 'Vui lòng nhập họ';
    if (!data.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    if (!data.city.trim()) newErrors.city = 'Vui lòng nhập tỉnh/thành phố';

    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!data.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(data.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
        newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(data.email)) {
        newErrors.email = 'Email không hợp lệ';
    }

    return newErrors;
};
