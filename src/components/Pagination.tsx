import { BsThreeDots } from "react-icons/bs";
type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pageNumbers = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        pageNumbers.push(2);
        if (currentPage > 3) pageNumbers.push('...');
        if (currentPage > 1 && currentPage < totalPages) pageNumbers.push(currentPage);
        if (currentPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {/* Prev */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`border px-3 py-1 rounded me-4 cursor-pointer
                    ${currentPage === 1 ? 'text-gray-400 bg-gray-100' 
                        : 'hover:bg-red-900 hover:text-white font-semibold'}`}
            >
                Trước
            </button>

            {/* Page Numbers */}
            {pageNumbers.map((num, idx) =>
                typeof num === 'string' ? (
                    <span key={idx} className="px-2">
                        <BsThreeDots />
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(num)}
                        className={`px-4 py-2 rounded cursor-pointer
                            ${num === currentPage ? 'border border-gray-600 font-semibold' : 'hover:bg-gray-200'
                        }`}
                    >
                        {num}
                    </button>
                )
            )}

            {/* Next */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`border px-3 py-1 rounded ms-4 cursor-pointer
                    ${currentPage === totalPages ? 'text-gray-400 bg-gray-100' 
                        : 'hover:bg-red-900 hover:text-white font-semibold'}`}
            >
                Sau
            </button>
        </div>
    );
}
