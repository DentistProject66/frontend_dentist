"use client"

import React from 'react';

const QuickStatsCards = ({ pendingDentists }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {[
        { value: pendingDentists.length, label: 'Total Applications', color: 'text-[#2E86AB]' },
        { value: pendingDentists.filter(d => d.status === 'pending').length, label: 'Pending Review', color: 'text-[#FFC107]' },
        { value: pendingDentists.filter(d => d.status === 'rejected').length, label: 'Rejected', color: 'text-[#FF4136]' },
        { value: pendingDentists.filter(d => d.status === 'approved').length, label: 'Approved', color: 'text-[#28A745]' },
      ].map((stat, index) => (
        <div key={index} className="bg-[#FFFFFF] rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;