// components/product/CartItem.tsx
import Image from 'next/image';
import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { GoXCircle } from 'react-icons/go';

type CartItemProps = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onRemove: (id: number) => void;
};

const CartItem: React.FC<CartItemProps> = ({
    id,
    name,
    price,
    quantity,
    image,
    onIncrease,
    onDecrease,
    onRemove
}) => {
    return (
        <div className="relative border-b border-gray-300 pb-4 mb-4 flex flex-col sm:flex-row items-center gap-4">
            <Image src={image} alt={name} width={112} height={112} className="w-28 h-28 object-cover" />
            <div className="flex-1">
                <h2 className="font-bold">{name}</h2>
                <p className="text-gray-600 mt-2 font-bold">
                    {price.toLocaleString()} <span className="text-xs font-semibold">VND</span>
                </p>
                <div className="mt-4 flex items-center gap-2">
                    <button
                        onClick={() => onDecrease(id)}
                        className="px-3 py-1.5 bg-gray-200 text-xl cursor-pointer hover:text-red-500"
                    >
                        
                        <FiMinus />
                    </button>
                    <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="w-12 py-1 text-center border rounded"
                    />
                    <button
                        onClick={() => onIncrease(id)}
                        className="px-3 py-1.5 bg-gray-200 text-xl cursor-pointer hover:text-red-500"
                    >
                        <FiPlus />
                    </button>
                </div>
            </div>
            <button
                onClick={() => onRemove(id)}
                className="absolute top-2 right-2 text-2xl cursor-pointer text-gray-400 hover:text-red-500"
                title="Xóa sản phẩm"
            >
                <GoXCircle />
            </button>

            <div className="text-right font-semibold text-lg self-end">
                <p className='text-sm'>Tạm tính (Đã bao gồm thuế )</p>
                <p className="text-black font-bold">
                    {(price * quantity).toLocaleString()} <span className="text-sm font-semibold">VND</span>
                </p>
            </div>
        </div>
    );
};

export default CartItem;
