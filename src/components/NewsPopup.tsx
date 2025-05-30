// components/NewsPopup.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FcNews } from "react-icons/fc";
import Image from 'next/image';
import { NewsResponse } from '@/types/News';
import { getAllNews } from '@/services/NewsService';
import Link from 'next/link';


const NewsPopup = () => {
  const imagesUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
  const [news, setNews] = useState<NewsResponse>();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getAllNews(0, 1);
        const fetchedNews = res.result.content[0];
        console.log(fetchedNews);
        setNews(fetchedNews);
        setShowPopup(true);
        sessionStorage.setItem('hasSeenPopup', 'true');
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');

    if (!hasSeenPopup) {
      fetchNews();
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
            <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
              <FcNews /> 
              <p>Bản tin mới nhất</p>
              </h3>
          </div>
          <div className="text-gray-800 whitespace-pre-line p-4">
              <p className={`line-clamp-6`}>{news?.content}</p>
              <button className="text-blue-600 hover:underline text-sm cursor-pointer">
                <Link href={`/tin-tuc`}>
                  Xem thêm ở bảng tin
                </Link>
              </button>
          </div>
          {news?.images && news?.images?.length > 0 && news.images[0]?.url && (
          <div className='w-[300px] h-[300px] relative'>
            <Image
              src={imagesUrl + news?.images[0].url}
              alt="main image"
              fill
              priority={true}
              className="relative z-10 object-contain cursor-pointer rounded-xl"
            />
          </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewsPopup;
