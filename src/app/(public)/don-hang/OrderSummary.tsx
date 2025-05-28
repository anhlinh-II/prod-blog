'use client';

import { CartItem } from '@/utils/AppContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

type OrderSummaryProps = {
  products: CartItem[];
  checkoutData: any;
  isSubmitting: boolean;
  onSubmit: () => void;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
    products,
    checkoutData,
    isSubmitting,
    onSubmit, 
}) => {
    const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-xl border border-gray-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800 ">ĐƠN HÀNG CỦA BẠN</h2>

      <div className="space-y-4 mb-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="flex items-start gap-4 border-t border-gray-300 pt-4">
              {product.image && product.image != '' ? (
                <Image src={product.image} width={80} height={80} alt={product.name} className="w-20 h-20 object-contain" />
              ) : (
                  <div className="w-20 h-20 object-cover rounded animate-pulse" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                <p className="font-semibold text-gray-900 mt-1">{product.price.toLocaleString()} VND</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Giỏ hàng của bạn đang trống.</p>
        )}
      </div>

      {products.length > 0 && (
        <div>
          <div className="pt-3 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
            <div className="flex justify-between">
              <span>Vận chuyển</span>
              <span>Tùy khu vực</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-800 border-t border-gray-300 pt-2">
              <span>Tổng</span>
              <span>{total.toLocaleString()} VND</span>
            </div>
          </div>

          <div className="my-4 text-sm">
            <p className="font-medium text-gray-700">Trả tiền mặt khi nhận hàng</p>
          </div>
        </div>
      )}
      <div className="my-4 text-sm">
        <p className="text-base my-4 text-red-700">Khi tạo đơn hàng, nhân viên sẽ liên hệ và trao đổi với bạn thông qua số điện thoại</p>
        <p className="text-base text-red-700">(Tuyệt đối không thanh toán trực tuyến)</p>
      </div>

      <button className={`w-full bg-red-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-red-700 transition 
          ${isSubmitting || products.length < 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={onSubmit}
        disabled={isSubmitting || products.length < 1}>
        {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
      </button>
      <button className="w-full mt-2 text-center text-gray-700 underline cursor-pointer">
          <Link href={`/`}>
              Về trang chủ
          </Link>
      </button>
    </div>
  );
};

export default OrderSummary;
