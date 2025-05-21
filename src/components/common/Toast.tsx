// components/common/Toast.tsx
"use client"
import React from 'react';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { GoXCircle } from "react-icons/go";
import { IoAlertCircleOutline } from 'react-icons/io5';

type ToastType = 'success' | 'error' | 'warning';

type ToastProps = {
    message: string;
    visible: boolean;
    type?: ToastType;
};

const Toast: React.FC<ToastProps> = ({ message, visible, type = 'success' }) => {
    const baseClass =
        'fixed z-50 bottom-6 right-20 flex items-center gap-3 px-4 py-3 rounded shadow-lg transition-all duration-500 transform';

    const typeStyles = {
        success: 'bg-green-600 text-white',
        error: 'bg-red-600 text-white',
        warning: 'bg-yellow-500 text-black',
    };

    const icons = {
        success: <IoIosCheckmarkCircleOutline size={20} />,
        error: <GoXCircle size={20} />,
        warning: <IoAlertCircleOutline size={20} />,
    };

    return (
        <div
            className={`${baseClass} ${typeStyles[type]} ${visible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
        >
            {icons[type]}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};

export default Toast;

