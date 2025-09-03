"use client";
import React, { useState } from "react";
import { Mail, Phone, Calendar, FileText, Search, Filter } from "lucide-react";
import ApproveButton from "./ActionSwitch";
import RejectButton from "./rejectbutton";
import PaginationComponent from "./PaginationComponent";

const DentistTable = ({ pendingDentists, onApprove, onReject }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // ✅ show only 4 per page

  // 🔍 Filtering
  const filteredDentists = pendingDentists.filter((dentist) => {
    const matchesSearch =
      dentist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dentist.practice_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || dentist.status === statusFilter;

    const today = new Date();
    const registeredDate = new Date(dentist.registered);
    const daysDiff = Math.floor((today - registeredDate) / (1000 * 60 * 60 * 24));

    let matchesDate = true;
    if (dateFilter === "today") matchesDate = daysDiff === 0;
    else if (dateFilter === "week") matchesDate = daysDiff <= 7;
    else if (dateFilter === "month") matchesDate = daysDiff <= 30;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // 📄 Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDentists = filteredDentists.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredDentists.length / itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FFC107] text-white">Pending</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#FF4136] text-white">Rejected</span>;
      case "approved":
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#28A745] text-white">Approved</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#F8F9FA] text-gray-800">Unknown</span>;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Filters UI (same as before) */}

      {(searchTerm || statusFilter !== "all" || dateFilter !== "all") && (
        <div className="mb-4 text-sm text-gray-600 font-medium">
          Showing {filteredDentists.length} of {pendingDentists.length} applications
        </div>
      )}

      {/* ✅ Table with only paginated dentists */}
      <div className="bg-[#FFFFFF] rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#F8F9FA]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Dentist Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Contact Information</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Practice Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Registration Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#FFFFFF] divide-y divide-gray-200">
            {currentDentists.map((dentist) => (
              <tr key={dentist.id} className="hover:bg-[#F8F9FA] transition-colors">
                <td className="px-4 py-3">{dentist.name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center mb-1 text-sm text-gray-900">
                    <Mail className="h-4 w-4 text-[#2E86AB] mr-2" />
                    {dentist.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-[#2E86AB] mr-2" />
                    {dentist.phone}
                  </div>
                </td>
                <td className="px-4 py-3">{dentist.practice_name}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="h-4 w-4 text-[#2E86AB] mr-2" />
                    {dentist.registered}
                  </div>
                </td>
                <td className="px-4 py-3">{getStatusBadge(dentist.status)}</td>
                <td className="px-4 py-3 text-sm font-medium">
                  {dentist.status === "pending" && (
                    <div className="flex items-center space-x-2">
                      <RejectButton onClick={() => onReject(dentist.id)} />
                      <ApproveButton onClick={() => onApprove(dentist.id)} />
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Local Pagination */}
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default DentistTable;
