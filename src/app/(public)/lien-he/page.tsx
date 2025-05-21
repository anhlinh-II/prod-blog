"use client";

import { useCallback, useState } from "react";
import { Container } from "@mui/material";
import { validateContactFormData } from "@/utils/ValidateForm";
import { throttle } from 'lodash';
import Breadcrumb from "@/components/common/Breadcrumb";
import { createContact } from "@/services/ContactService";
import Toast from "@/components/common/Toast";

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  website: string;
};

export default function ContactPage() {
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [form, setForm] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        message: '',
        website: '',
    });
    const [toast, setToast] = useState<{
        message: string;
        visible: boolean;
        type?: 'success' | 'error' | 'warning';
    }>({
        message: '',
        visible: false,
        type: 'success',
    });
    const [cooldown, setCooldown] = useState(0);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setFormErrors({});
    };
    
    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: '', visible: false, type }), 3000);
    };

    const throttledSubmit = useCallback(throttle(async (data: ContactFormData) => {
        try {
            const contactRequest = {
                name: data.name,
                email: data.email || undefined,
                phone: data.phone,
                message: data.message
            };

            const response = await createContact(contactRequest);
            console.log('Contact created:', response);

            showToast(`Hệ thống đã nhận được nội dung liên hệ của bạn`, 'success');

            // Reset form
            setForm({ name: '', email: '', phone: '', message: '', website: '' });

            // Cooldown 5s
            setCooldown(5);
            const interval = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

        } catch (err) {
            console.error('Failed to create contact:', err);
        } finally {
            setIsSubmitting(false);
        }
    }, 5000), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateContactFormData(form);
        if (Object.keys(validationErrors).length > 0) {
            setFormErrors(validationErrors);
            return;
        }
        if (isSubmitting || cooldown > 0) return;

        setIsSubmitting(true);
        throttledSubmit(form);
    };

    
    const breadcrumbItems = [
        { label: "🏠 Trang chủ", href: "/" },
        { label: "Liên hệ" }
    ];

    return (
        <div className="">
            <Breadcrumb items={breadcrumbItems} title="LIÊN HỆ VỚI CHÚNG TÔI"/>
            <main className="flex-grow py-6">
                <Container maxWidth={"lg"}>

                    <div className="flex flex-col md:flex-row justify-center gap-8">
                        <section className="w-full lg:w-4/7">
                            <form
                                onSubmit={handleSubmit}
                                className="w-full max-w-3xl p-4 md:p-8 rounded-2xl border border-gray-300 flex flex-col"
                            >
                                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Liên hệ với chúng tôi</h2>

                                {/* Tên */}
                                <div className="my-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên<span className='text-red-500'> *</span></label>
                                    <input
                                        name="name"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Họ và tên"
                                        className={`w-full border p-3 rounded-lg ${
                                            errors.name ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Số điện thoại */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại<span className='text-red-500'> *</span></label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            onChange={handleChange}
                                            placeholder="0987654321"
                                            className={`w-full border p-3 rounded-lg ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            onChange={handleChange}
                                            placeholder="email@domain.com"
                                            className={`w-full border p-3 rounded-lg ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                    </div>
                                </div>

                                {/* Nội dung */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung<span className='text-red-500'> *</span></label>
                                    <textarea
                                        name="message"
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Nhập nội dung liên hệ..."
                                        className={`w-full border p-3 rounded-lg ${
                                        errors.message ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                                </div>

                                <div className="mt-6 w-full flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || cooldown > 0}
                                        className={`bg-blue-600 text-white py-3 px-4 rounded-full 
                                            transition cursor-pointer ${
                                                (isSubmitting || cooldown > 0)
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-blue-700'
                                            }`}
                                    >
                                        {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi nội dung'}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <section className="w-full lg:w-3/7 flex flex-col gap-4">
                            {/* Thông tin doanh nghiệp */}
                            <div className="p-4 rounded-2xl border border-gray-300">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Thông tin doanh nghiệp</h3>
                                <ul className="text-gray-600 space-y-2">
                                    <li>
                                        <strong>Công ty:</strong> Công ty TNHH ABC
                                    </li>
                                    <li>
                                        <strong>Địa chỉ:</strong> 123 Nguyễn Trãi, Thanh Xuân, Hà Nội
                                    </li>
                                    <li>
                                        <strong>Điện thoại:</strong> 0123 456 789
                                    </li>
                                    <li>
                                        <strong>Email:</strong> lienhe@abc.com
                                    </li>
                                </ul>
                            </div>

                            {/* Google Maps */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Bản đồ</h3>
                                <div className="w-full h-80 rounded-lg overflow-hidden shadow">
                                <iframe
                                    title="Google Map"
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.01751518134!2d105.8007485154089!3d21.029449093180312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab46f5ccce5f%3A0xb020f61b4c04c0d4!2zMTIzIE5ndXnhu4VuIFRyw6NpLCBUaGFuaCBYdcOibiwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1645637476510!5m2!1svi!2s"
                                ></iframe>
                                </div>
                            </div>
                        </section>
                    </div>
                    {/* Toast */}
                    <Toast message={toast.message} visible={toast.visible} type={toast.type} />
                </Container>
            </main>
        </div>
    );
}
