"use client";

import { useCallback, useState } from "react";
import { Container } from "@mui/material";
import { validateContactFormData } from "@/utils/ValidateForm";
import { throttle } from 'lodash';
import Breadcrumb from "@/components/common/Breadcrumb";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  website: string;
};

export default function ContactPage() {
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [form, setForm] = useState<ContactFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        website: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = useCallback(
        throttle(async (e: React.FormEvent) => {
            e.preventDefault();

            const validationErrors = validateContactFormData(form);
            if (Object.keys(validationErrors).length > 0) {
                setFormErrors(validationErrors);
                return;
            }
            if (isSubmitting) return;

            setIsSubmitting(true);
            try {
                console.log('Submit order with:', { form });
                // TODO: gửi dữ liệu qua API
            } catch (err) {
                console.error('Order failed', err);
            } finally {
                setIsSubmitting(false);
            }
        }, 3000), [form, isSubmitting]  // User can submit every 3 seconds
    );
    
    const breadcrumbItems = [
        { label: "Trang chủ", href: "/" },
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Tên */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên<span className='text-red-500'> *</span></label>
                                        <input
                                        name="firstName"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Tên"
                                        className={`w-full border p-3 rounded-lg ${
                                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>

                                    {/* Họ */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ</label>
                                        <input
                                        name="lastName"
                                        type="text"
                                        onChange={handleChange}
                                        placeholder="Họ"
                                        className={`w-full border p-3 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className='text-red-500'> *</span></label>
                                        <input
                                        name="email"
                                        type="email"
                                        onChange={handleChange}
                                        placeholder="email@domain.com"
                                        className={`w-full border p-3 rounded-lg ${
                                            errors.email ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

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
                                        className="bg-blue-600 text-white py-3 px-4 rounded-full 
                                            hover:bg-blue-700 transition cursor-pointer"
                                    >
                                        Gửi liên hệ
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
                </Container>
            </main>
        </div>
    );
}
