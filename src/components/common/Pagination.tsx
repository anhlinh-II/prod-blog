"use client";
import { BsThreeDots } from "react-icons/bs";
import { useIsMobile } from "@/hooks/useIsMobile"; // nhớ chỉnh path nếu cần
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const isMobile = useIsMobile();
    const pageNumbers: (number | string)[] = [];

    const range = isMobile ? 1 : 2; // ±1 cho mobile, ±2 cho desktop

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);

        const start = Math.max(2, currentPage - range);
        const end = Math.min(totalPages - 1, currentPage + range);

        if (start > 2) pageNumbers.push("...");

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (end < totalPages - 1) pageNumbers.push("...");

        pageNumbers.push(totalPages);
    }

    return (
        pageNumbers.length > 1 && (
            <div className="flex justify-center items-center gap-1 md:gap-2 mt-8">
                {/* Prev */}
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`border px-3 py-1 rounded me-4 cursor-pointer
                        ${currentPage === 1 ? 'text-gray-400 bg-gray-100'
                            : 'hover:bg-red-900 hover:text-white font-semibold'}`}
                >
                    {isMobile ? <FiChevronLeft /> : 'Trước'}
                </button>

                {/* Page Numbers */}
                <div className="flex items-center justify-center gap-1 md:gap-2">
                    {pageNumbers.map((num, idx) =>
                        typeof num === "string" ? (
                            <span key={idx} className="px-2">
                                <BsThreeDots />
                            </span>
                        ) : (
                            <button
                                key={idx}
                                onClick={() => onPageChange(num)}
                                className={`px-2 py-1 md:px-4 md:py-2 rounded cursor-pointer
                                    ${num === currentPage ? 'border border-gray-600 font-semibold' : 'hover:bg-gray-200'}`}
                            >
                                {num}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`border px-3 py-1 rounded ms-4 cursor-pointer
                        ${currentPage === totalPages ? 'text-gray-400 bg-gray-100' 
                            : 'hover:bg-red-900 hover:text-white font-semibold'}`}
                >
                    {isMobile ? <FiChevronRight /> : 'Sau'}
                </button>
            </div>
        )
    );
}
