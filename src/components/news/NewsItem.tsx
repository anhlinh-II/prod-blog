// 'use client';

// import Image from 'next/image';
// import '../../app/globals.css'
// import { NewsResponse } from '@/types/News';
// import Link from 'next/link';

// type Props = {
//   news: NewsResponse;
//   orientation?: "row" | "col"; // chỉ cho phép 2 kiểu
// };

// export default function NewsItem({ news, orientation = "col" }: Props) {
//   const isRow = orientation === "row";

//   return (
//     news &&
//     <Link href={`/tin-tuc/${news.slug}`}>
//     <div
//       className={`
//         relative flex flex-col 
//         ${isRow ? "md:flex-row" : "md:flex-col"} 
//         justify-start gap-4 rounded-xl cursor-pointer border border-gray-300
//         hover:shadow-lg transition group
//       `}
//     >
//       {/* Ảnh */}
//       <div className={`relative ${isRow ? "md:w-2/5" : "w-full"}`}>
//         <div className={`relative min-h-48 w-full overflow-hidden ${isRow ? "rounded-s-xl h-full" : "rounded-t-xl h-full"}`}>
//           <Image
//             src={news.images}
//             alt={news.title}
//             fill
//             className={`object-cover group-hover:scale-105 transition-all ease-in duration-200 
//               ${isRow ? "h-full" : "w-full aspect-[1/1]"}`}
//           />
//         </div>

//         {/* 🔥 Tag HOT */}
//         {/* <div className="absolute top-4 -left-4">
//           <div className="bg-red-600 text-white text-xs p-1.5 font-bold animate-wiggle">
//             HOT
//           </div>
//         </div> */}
//       </div>

//       {/* Nội dung */}
//       <div className={`p-4 mb-4 ${isRow ? "md:w-3/5" : "w-full"}`}>
//         <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-700">{news.title}</h3>
//         <p className="text-gray-600 text-sm mt-1 line-clamp-3 min-h-[4rem]">{news.description}</p>
//       </div>

//       {/* Ngày */}
//       <div className={`absolute bottom-0 right-2 px-1.5 py-3.5 rounded-full flex items-center justify-center
//         group-hover:scale-105 transition-all ease-in duration-200
//         ${isRow ? "md:bottom-4 md:right-4 md:bg-red-700 md:text-gray-200" : "text-gray-700"}`}>
//         <p className="text-xs font-bold">{formatDate(news.createdAt)}</p>
//       </div>
//     </div>
//     </Link>
//   );
// }


// function formatDate(dateStr: string) {
//   const d = new Date(dateStr);
//   return d.toLocaleDateString('ca-CA', {
//     day: '2-digit',
//     month: '2-digit'
//   });
// }
