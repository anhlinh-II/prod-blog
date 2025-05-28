import { ContactFormData } from "@/app/(public)/lien-he/page";
import { CheckoutFormData } from "@/app/(public)/don-hang/CheckoutForm";

export const validateOrderFormData = (data: CheckoutFormData) => {
    const newErrors: { [key: string]: string } = {};
    
    if (data.website?.trim() !== '') {
        newErrors.website = 'Phát hiện spam';
    }

    if (!data.firstName.trim()) newErrors.firstName = 'Vui lòng nhập tên';
    if (!data.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';

    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!data.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(data.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    return newErrors;
};

export const validateContactFormData = (data: ContactFormData) => {
    const newErrors: { [key: string]: string } = {};
    
    if (data.website?.trim() !== '') {
        newErrors.website = 'Phát hiện spam';
    }

    if (!data.name.trim()) newErrors.name = 'Vui lòng nhập tên';
    if (!data.message.trim()) newErrors.message = 'Vui lòng nhập tin nhắn';

    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if (!data.phone.trim()) {
        newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(data.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    return newErrors;
};
