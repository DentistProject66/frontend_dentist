"use client";

import React from "react";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm font-medium text-[#2E86AB] bg-[#FFFFFF] border border-gray-300 rounded-lg hover:bg-[#2E86AB] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            currentPage === page
              ? "bg-[#2E86AB] text-[#FFFFFF]"
              : "bg-[#FFFFFF] text-[#2E86AB] border border-gray-300 hover:bg-[#2E86AB] hover:text-[#FFFFFF]"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm font-medium text-[#2E86AB] bg-[#FFFFFF] border border-gray-300 rounded-lg hover:bg-[#2E86AB] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next
      </button>
    </div>
  );
};

export default PaginationComponent;