// components/common/ConfirmModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';

type ConfirmModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title = 'Xoá sản phẩm từ giỏ hàng',
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              <IoMdClose />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">
              {title}
            </h2>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 border-2 border-red-500 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xl font-bold">!</span>
              </div>
            </div>

            <p className="text-center text-gray-600 mb-6">{message}</p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onConfirm}
                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 font-semibold cursor-pointer"
              >
                Xác nhận
              </button>
              <button
                onClick={onCancel}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 font-semibold cursor-pointer"
              >
                Huỷ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
