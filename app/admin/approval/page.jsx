"use client";
import React, { useState, useEffect } from "react";
import Layout from "../layout/layout";
import QuickStatsCards from "../../componentss/QuickStatsCards";
import DentistTable from "../../componentss/DentistTable";
import ProtectedRoute from "../../../lib/ProtectedRoutes";
import { fetchUsers, approveUser, rejectUser } from "../../../lib/auth";

const AdminApproval = () => {
  const [pendingDentists, setPendingDentists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });

  const fetchDentists = async (page = 1, status = "") => {
    setLoading(true);
    setError("");
    const result = await fetchUsers({ page, limit: 10, status });
    if (result.success) {
      setPendingDentists(
        result.data.users.map((user) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          practice_name: user.practice_name,
          role: user.role,
          registered: user.created_at.split("T")[0], // Format date
          status: user.status,
        }))
      );
      setPagination(result.data.pagination);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDentists();
  }, []);

  const handleApprove = async (dentistId) => {
    const result = await approveUser(dentistId);
    if (result.success) {
      setPendingDentists((prev) =>
        prev.map((dentist) =>
          dentist.id === dentistId ? { ...dentist, status: "approved" } : dentist
        )
      );
    } else {
      setError(result.message);
    }
  };

  const handleReject = async (dentistId) => {
    const result = await rejectUser(dentistId);
    if (result.success) {
      setPendingDentists((prev) =>
        prev.map((dentist) =>
          dentist.id === dentistId ? { ...dentist, status: "rejected" } : dentist
        )
      );
    } else {
      setError(result.message);
    }
  };

  return (
    <Layout>
      <div className="p-6 bg-[#F8F9FA] min-h-screen font-sans flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#2E86AB] tracking-tight">Account Approvals</h1>
          <p className="text-base text-gray-600 mt-1">Review and manage dentist registration applications</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          <>
            <QuickStatsCards pendingDentists={pendingDentists} />
            <DentistTable
              pendingDentists={pendingDentists}
              onApprove={handleApprove}
              onReject={handleReject}
              pagination={pagination}
              onPageChange={(page) => fetchDentists(page, "", "dentist")}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProtectedRoute(AdminApproval);