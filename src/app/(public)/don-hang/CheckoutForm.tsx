'use client';

import React, { useEffect, useState } from 'react';

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
};
type Props = {
  onChange: (data: CheckoutFormData) => void;
  errors?: { [key: string]: string };
};

const CheckoutForm:React.FC<Props> = ({ onChange, errors }) => {
    const [formData, setFormData] = useState<CheckoutFormData>({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        email: '',
        website: ''
    });


    useEffect(() => {
        onChange(formData);
    }, [formData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
  return (
    <form className="max-w-4xl mx-auto ps-4 md:ps-8 p-8 pb-0 rounded-2xl space-y-4 border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-800">Thông tin khách hàng</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Tên<span className='text-red-500'> *</span></label>
          <input
            name="firstName"
            type="text"
            onChange={handleChange}
            placeholder="Tên"
            className={`w-full border p-3 rounded-lg ${
                errors?.firstName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors?.firstName && <p className="text-red-500 text-sm mt-1">{errors?.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Họ</label>
          <input
            name="lastName"
            type="text"
            onChange={handleChange}
            placeholder="Họ"
            className={`w-full border p-3 rounded-lg ${
                errors?.lastName ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Địa chỉ<span className='text-red-500'> *</span></label>
        <input
            name="address"
            type="text"
            onChange={handleChange}
            placeholder="Địa chỉ"
            className={`w-full border p-3 rounded-lg ${
                errors?.address ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors?.address && <p className="text-red-500 text-sm mt-1">{errors?.address}</p>}
        {/* <input
            name="apartment"
            type="text"
            onChange={handleChange}
            placeholder="Căn hộ / Toà nhà"
            className="w-full border border-gray-300 p-3 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/> */}
      </div>
{/* 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Tỉnh / Thành phố<span className='text-red-500'> *</span></label>
          <input name='city' type="text" onChange={handleChange} placeholder="VD: Hà Nội" className={`w-full border p-3 rounded-lg ${
                errors?.city ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors?.city && <p className="text-red-500 text-sm mt-1">{errors?.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Mã bưu điện (tuỳ chọn)</label>
          <input name='postalCode' type="text" onChange={handleChange} placeholder="100000" className={`w-full border p-3 rounded-lg ${
                errors?.postalCode ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors?.postalCode && <p className="text-red-500 text-sm mt-1">{errors?.postalCode}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Quốc gia/Khu vực<span className='text-red-500'> *</span></label>
          <input type="text" onChange={handleChange} value="Việt Nam" disabled className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg" />
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Số điện thoại<span className='text-red-500'> *</span></label>
          <input name='phone' type="tel" onChange={handleChange} placeholder="0987654321" className={`w-full border p-3 rounded-lg ${
                errors?.phone ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors?.phone && <p className="text-red-500 text-sm mt-1">{errors?.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Địa chỉ Email (Tuỳ chọn)</label>
          <input name='email' type="email" onChange={handleChange} placeholder="email@domain.com" className={`w-full border p-3 rounded-lg ${
                errors?.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 ms-1">Ghi chú đơn hàng (tuỳ chọn)</label>
        <textarea
          rows={4}
          onChange={handleChange}
          placeholder="Ghi chú về thời gian giao hàng hoặc chỉ dẫn thêm..."
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* detect spam bot */}
      <input type="text" name="website" className="hidden" 
          onChange={handleChange}/>
    </form>
  );
};

export default CheckoutForm;
