// src/components/FloatingSocialIcons.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { BsMessenger, BsTelephoneFill } from 'react-icons/bs';
import { SiZalo } from 'react-icons/si';
import { FaFacebookF } from 'react-icons/fa';
import Image from 'next/image';
import messengerIcon from '../../public/messenger.png';

interface FloatingSocialIconsProps {}

const FloatingSocialIcons: React.FC<FloatingSocialIconsProps> = () => {
     const messengerLink = "https://m.me/your_facebook_page_id";
     const zaloLink = "https://zalo.me/your_zalo_number";
     const facebookLink = "https://www.facebook.com/your_facebook_page";
     const phoneNumber = "your_phone_number";

     return (
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
               {/* Icon Messenger */}
               <Link
                    href={messengerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#b4a7fe] attention-element-messenger hover:bg-[#c1b6fd] text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
               >
                    <Image src={messengerIcon} alt="Messenger Icon" width={24} height={24} />
               </Link>

               {/* Icon Zalo */}
               <Link
                    href={zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat via Zalo"
                    className="bg-blue-500 hover:bg-blue-600 attention-element-notification text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
               >
                    <SiZalo size={24} />
               </Link>

               {/* Icon Facebook */}
               <Link
                    href={facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit our Facebook page"
                    className="bg-blue-800 hover:bg-blue-900 attention-element-notification text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
               >
                    <FaFacebookF size={24} />
               </Link>

               {/* Icon Điện thoại */}
               <a
                    href={`tel:${phoneNumber}`}
                    aria-label="Call us"
                    className="bg-green-600 hover:bg-green-700 attention-element-warning text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
               >
                    <BsTelephoneFill size={24} />
               </a>
          </div>
     );
};

export default FloatingSocialIcons;
