import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";

const FilterBar = ({ statusFilter, treatmentFilter, fromDate, toDate, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState(statusFilter);
  const [localTreatment, setLocalTreatment] = useState(treatmentFilter);
  const [localFromDate, setLocalFromDate] = useState(fromDate);
  const [localToDate, setLocalToDate] = useState(toDate);

  useEffect(() => {
    setLocalStatus(statusFilter);
    setLocalTreatment(treatmentFilter);
    setLocalFromDate(fromDate);
    setLocalToDate(toDate);
  }, [statusFilter, treatmentFilter, fromDate, toDate]);

  const applyFilters = () => {
    onFilterChange("status", localStatus);
    onFilterChange("treatment", localTreatment);
    onFilterChange("from", localFromDate);
    onFilterChange("to", localToDate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Filter className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Status:</span>
              <select
                value={localStatus}
                onChange={(e) => setLocalStatus(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Statuses</option>
                <option>Crown</option>
                <option>Implant</option>
                <option>Denture</option>
                <option>Bridge</option>
                <option>Whitening</option>
                <option>Filling</option>
                <option>Extraction</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Treatment:</span>
              <select
                value={localTreatment}
                onChange={(e) => setLocalTreatment(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Treatments</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">From:</span>
              <input
                type="date"
                value={localFromDate}
                onChange={(e) => setLocalFromDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">To:</span>
              <input
                type="date"
                value={localToDate}
                onChange={(e) => setLocalToDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={applyFilters}
              className="w-full mt-2 px-3 py-1.5 text-sm font-medium text-white bg-[#2E86AB] rounded-lg hover:bg-[#256d91] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;