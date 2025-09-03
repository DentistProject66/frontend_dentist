"use client"

import React from 'react';

const RejectButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 text-sm font-medium text-white bg-[#FF4136] rounded-lg hover:bg-[#E01B0C] focus:outline-none focus:ring-2 focus:ring-[#FF4136] focus:ring-opacity-50 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      title="Reject"
    >
      Reject
    </button>
  );
};

export default RejectButton;