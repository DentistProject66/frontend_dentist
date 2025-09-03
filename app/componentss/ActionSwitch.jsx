"use client"

import React from 'react';

const ApproveButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 text-sm font-medium text-white bg-[#28A745] rounded-lg hover:bg-[#218838] focus:outline-none focus:ring-2 focus:ring-[#28A745] focus:ring-opacity-50 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      title="Approve"
    >
      Approve
    </button>
  );
};

export default ApproveButton;