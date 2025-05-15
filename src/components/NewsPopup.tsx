// components/NewsPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const NewsPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setShowPopup(true);
      sessionStorage.setItem('hasSeenPopup', 'true');
    }
  }, []);

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -50 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: -50 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-4 z-50 bg-white border border-gray-300 shadow-lg rounded-2xl w-[320px] md:w-[400px]"
        >
          <div className="relative border-b border-gray-300 p-4">
            <button
                className="absolute top-4 right-4 text-xl text-black bg-gray-100 hover:bg-gray-200 
                rounded-full p-1 cursor-pointer"
                onClick={() => setShowPopup(false)}
            >
                <IoClose />
            </button>
            <h3 className="text-base font-semibold mb-1">📌 Mẹo hôm nay</h3>
          </div>
          <div className='p-4 text-sm text-gray-700'>
            <p>
              Luôn kiểm tra kỹ các email lạ — đừng nhấn vào đường link đáng ngờ để bảo vệ thông tin cá nhân!
            </p>
            <p>Với việc có đến cả chục đơn vị phân phối máy rửa chén siêu âm các loại trên thị trường, thì việc nhận biết loại nào tốt, loại nào kém là một vấn đề nhức nhối dành cho người mua hàng. Chính vì vậy, 6 mẹo nhận biết máy rửa bát siêu âm kém chất lượng được Bảo Việt chia sẻ sau đây sẽ là cẩm nang quan trọng để bạn có thể lựa chọn được chính xác sản phẩm xứng đáng với chi phí đầu tư của mình.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsPopup;
