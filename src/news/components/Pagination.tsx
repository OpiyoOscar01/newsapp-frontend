// import React from 'react';
// import {type PaginationProps } from '../types';
// import { generatePageNumbers } from '../utils/paginationHelpers';

// const Pagination: React.FC<PaginationProps> = ({
//   currentPage,
//   totalPages,
//   onPageChange
// }) => {
//   const pageNumbers = generatePageNumbers(currentPage, totalPages, 5);

//   if (totalPages <= 1) return null;

 
// return (
//   <nav
//     className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm"
//     aria-label="Pagination"
//     role="navigation"
//   >

//     {/* Mobile Pagination */}
//     <div className="flex sm:hidden items-center justify-between gap-2">
//       <button
//         onClick={() => {
//           onPageChange(currentPage - 1);
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         }}
//         disabled={currentPage === 1}
//         aria-label="Go to previous page"
//         className="flex items-center justify-center shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         Prev
//       </button>

//       <span className="flex-1 text-center text-xs text-gray-700 truncate">
//         Page <span className="font-semibold">{currentPage}</span> of{" "}
//         <span className="font-semibold">{totalPages}</span>
//       </span>

//       <button
//         onClick={() => {
//           onPageChange(currentPage + 1);
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         }}
//         disabled={currentPage === totalPages}
//         aria-label="Go to next page"
//         className="flex items-center justify-center shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         Next
//       </button>
//     </div>

//     {/* Desktop Pagination */}
//     <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">

//       <p className="text-sm text-gray-800">
//         Page <span className="font-medium">{currentPage}</span> of{" "}
//         <span className="font-medium">{totalPages}</span>
//       </p>

//       <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">

//         {/* Prev */}
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           aria-label="Go to previous page"
//           className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//         >
//           Prev
//         </button>

//         {/* First page + Ellipsis */}
//         {pageNumbers[0] > 1 && (
//           <>
//             <button
//               onClick={() => onPageChange(1)}
//               className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-gray-900"
//             >
//               1
//             </button>
//             {pageNumbers[0] > 2 && (
//               <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300">
//                 ...
//               </span>
//             )}
//           </>
//         )}

//         {/* Page Numbers */}
//         {pageNumbers.map((num) => (
//           <button
//             key={num}
//             onClick={() => onPageChange(num)}
//             aria-current={num === currentPage ? "page" : undefined}
//             className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 transition-all
//               ${
//                 num === currentPage
//                   ? "z-10 bg-primary-600 text-white shadow-sm"
//                   : "text-gray-800 hover:bg-gray-100 hover:text-gray-900"
//               }`}
//           >
//             {num}
//           </button>
//         ))}

//         {/* Last page + Ellipsis */}
//         {pageNumbers[pageNumbers.length - 1] < totalPages && (
//           <>
//             {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
//               <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-600 ring-1 ring-inset ring-gray-300">
//                 ...
//               </span>
//             )}
//             <button
//               onClick={() => onPageChange(totalPages)}
//               className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-gray-900"
//             >
//               {totalPages}
//             </button>
//           </>
//         )}

//         {/* Next */}
//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           aria-label="Go to next page"
//           className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//         >
//           Next
//         </button>

//       </nav>
//     </div>
//   </nav>
// );


// };

// export default Pagination;

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 1; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          currentPage === 1
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
        }`}
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border font-medium transition-all duration-200 ${
                currentPage === page
                  ? 'bg-primary-600 border-primary-600 text-blue-500 shadow-lg transform scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
          currentPage === totalPages
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600'
        }`}
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;