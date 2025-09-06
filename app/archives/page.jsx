"use client";
import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import Layout from "../layout/layout";
import Pagination from "../componentss/PaginationComponent";
import Modal from "../componentss/modal";
import ViewDetails from "../componentss/ViewDetails";
import FilterBar from "../componentss/FilterBar";

const Archive = () => {
  const [patients, setPatients] = useState([]);
  const [archives, setArchives] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [treatmentFilter, setTreatmentFilter] = useState("All Treatments");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [restorePatient, setRestorePatient] = useState(null);
  const [messageModal, setMessageModal] = useState({ isOpen: false, title: "", message: "", isError: false });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
  const patientsPerPage = 6;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "N/A";
    }
  };

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getPaymentStatus = (remainingBalance, totalPrice) => {
    if (!remainingBalance || remainingBalance === "0.00") return "Paid";
    if (parseFloat(remainingBalance) < parseFloat(totalPrice)) return "Partial";
    return "Unpaid";
  };

const handleRestorePatient = async () => {
  setIsRestoreModalOpen(false);
  const token = localStorage.getItem("authToken");
  
  if (!token || token.trim() === "") {
    setMessageModal({
      isOpen: true,
      title: "Error",
      message: "No valid authentication token found. Please log in.",
      isError: true,
    });
    return;
  }

  try {
    // Find the archive record for this patient
    const archive = archives.find((a) => a.original_id === restorePatient.id);
    
    if (!archive) {
      setMessageModal({
        isOpen: true,
        title: "Error",
        message: "Archive record not found for this patient.",
        isError: true,
      });
      return;
    }

    console.log("Restoring archive with ID:", archive.id);

    // Call the archives restore endpoint
    const response = await fetch(
      `https://backenddentist-production-12fe.up.railway.app/api/archives/restore/${archive.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Restore response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Restore error response:", errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Restore success response:", data);

    if (data.success) {
      // Immediately remove the patient from the UI
      setPatients(prevPatients => {
        const updatedPatients = prevPatients.filter(patient => patient.id !== restorePatient.id);
        console.log("Updated patients after removal:", updatedPatients);
        return updatedPatients;
      });
      
      setArchives(prevArchives => {
        const updatedArchives = prevArchives.filter(archive => archive.original_id !== restorePatient.id);
        console.log("Updated archives after removal:", updatedArchives);
        return updatedArchives;
      });

      setMessageModal({
        isOpen: true,
        title: "Success",
        message: `Patient ${restorePatient.name} restored successfully and moved to active patients.`,
        isError: false,
      });

      // Refresh data to ensure consistency
      setRefreshKey((prev) => prev + 1);
      
      setTimeout(() => setMessageModal({ 
        isOpen: false, 
        title: "", 
        message: "", 
        isError: false 
      }), 3000);
      
    } else {
      throw new Error(data.message || "Failed to restore patient");
    }
    
  } catch (error) {
    console.error("Error restoring patient:", error);
    setMessageModal({
      isOpen: true,
      title: "Error",
      message: error.message || "An error occurred while restoring the patient.",
      isError: true,
    });
    
    setTimeout(() => setMessageModal({ 
      isOpen: false, 
      title: "", 
      message: "", 
      isError: false 
    }), 5000);
  }
};

  const handleViewDetails = (archive) => {
    if (!archive) {
      console.error("No archive found for patient");
      setMessageModal({
        isOpen: true,
        title: "Error",
        message: "Failed to load patient details. No archive data found.",
        isError: true,
      });
      return;
    }
    if (!archive.data_json || !archive.data_json.patient) {
      console.error("Invalid archive data:", archive);
      setMessageModal({
        isOpen: true,
        title: "Error",
        message: "Failed to load patient details. Invalid archive data.",
        isError: true,
      });
      return;
    }

    const patientData = archive.data_json.patient || {};
    const consultations = archive.data_json.consultations || [];
    const appointments = archive.data_json.appointments || [];
    const payments = archive.data_json.payments || [];
    const latestConsultation = consultations[0] || null;

    const patientDetails = {
      id: archive.original_id,
      name: `${patientData.first_name || "Unknown"} ${patientData.last_name || ""}`.trim(),
      firstName: patientData.first_name || "Unknown",
      lastName: patientData.last_name || "",
      phone: patientData.phone || "N/A",
      createdAt: formatDate(patientData.created_at),
      lastConsult: formatDate(consultations[0]?.date_of_consultation),
      status: consultations[0]?.type_of_prosthesis || "No Treatment",
      statusColor: consultations[0]?.type_of_prosthesis ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
      payment: getPaymentStatus(
        consultations[0]?.remaining_balance || payments[0]?.remaining_balance,
        consultations[0]?.total_price || payments[0]?.total_price
      ),
      paymentColor: getPaymentColor(
        getPaymentStatus(
          consultations[0]?.remaining_balance || payments[0]?.remaining_balance,
          consultations[0]?.total_price || payments[0]?.total_price
        )
      ),
      totalPrice: consultations[0]?.total_price || payments[0]?.total_price || "0.00",
      amountPaid: consultations[0]?.amount_paid || payments[0]?.amount_paid || "0.00",
      remainingBalance:
        consultations[0]?.remaining_balance || payments[0]?.remaining_balance || "0.00",
      nextAppointmentDate: formatDate(appointments[0]?.appointment_date) || "N/A",
      nextAppointmentTime: formatTime(appointments[0]?.appointment_time) || "N/A",
      latestConsultation: latestConsultation
        ? {
            id: latestConsultation.id,
            date: formatDate(latestConsultation.date_of_consultation),
            treatment: latestConsultation.type_of_prosthesis || "No Treatment",
            totalPrice: latestConsultation.total_price || "0.00",
            amountPaid: latestConsultation.amount_paid || "0.00",
            remainingBalance: latestConsultation.remaining_balance || "0.00",
            needsFollowup: latestConsultation.needs_followup === 1,
            receiptNumber: latestConsultation.receipt_number || "N/A",
          }
        : null,
      consultations: consultations.map((consultation) => ({
        id: consultation.id,
        date: formatDate(consultation.date_of_consultation),
        treatment: consultation.type_of_prosthesis || "No Treatment",
        totalPrice: consultation.total_price || "0.00",
        amountPaid: consultation.amount_paid || "0.00",
        remainingBalance: consultation.remaining_balance || "0.00",
        needsFollowup: consultation.needs_followup === 1,
        receiptNumber: consultation.receipt_number || "N/A",
      })),
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        date: formatDate(appointment.appointment_date),
        time: formatTime(appointment.appointment_time),
        treatment: appointment.treatment_type || "N/A",
        status: appointment.status || "N/A",
      })),
      payments: payments.map((payment) => ({
        id: payment.id,
        date: formatDate(payment.payment_date),
        amountPaid: payment.amount_paid || "0.00",
        paymentMethod: payment.payment_method || "N/A",
        remainingBalance: payment.remaining_balance || "0.00",
        receiptNumber: payment.receipt_number || "N/A",
      })),
    };
    console.log("Patient Details for ViewDetails:", patientDetails);
    setSelectedPatientDetails(patientDetails);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("authToken");
      if (!token || token.trim() === "") {
        setError("No valid authentication token found. Please log in.");
        console.log("No auth token found");
        return;
      }

      const url = new URL("https://backenddentist-production-12fe.up.railway.app/api/archives/");
      url.searchParams.append("page", currentPage);
      url.searchParams.append("limit", patientsPerPage);
      if (searchTerm) url.searchParams.append("search", searchTerm);
      if (statusFilter !== "All Statuses") url.searchParams.append("latest_treatment", statusFilter);
      if (fromDate) url.searchParams.append("archived_at_gte", fromDate);
      if (toDate) url.searchParams.append("archived_at_lte", toDate);

      try {
        console.log("Fetching from:", url.toString());
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Raw API response:", data);

        if (data.success) {
          const archivesData = data.data.archives || [];
          setArchives(archivesData);
          console.log("Archives set:", archivesData);
          const transformedPatients = archivesData.map((archive) => {
            const patientData = archive.data_json?.patient || {};
            return {
              id: archive.original_id,
              name: `${patientData.first_name || "Unknown"} ${patientData.last_name || ""}`.trim(),
              patientId: `DC-${archive.original_id.toString().padStart(4, "0")}`,
              archivedOn: formatDate(archive.archived_at),
              reason: archive.data_json?.consultations?.[0]?.type_of_prosthesis || "No reason provided",
              status: archive.data_json?.consultations?.[0]?.type_of_prosthesis || "No Treatment",
            };
          });
          console.log("Transformed Patients:", transformedPatients);
          setPatients(transformedPatients);
          setTotalPages(data.data.pagination?.pages || 1);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to fetch archived patients");
        }
      } catch (error) {
        console.error("Error fetching archived patients:", error);
        setError(error.message || "An error occurred while fetching archived patients.");
      }
    };
    fetchPatients();
  }, [currentPage, searchTerm, statusFilter, fromDate, toDate, refreshKey]);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (type, value) => {
    switch (type) {
      case "status":
        setStatusFilter(value);
        break;
      case "treatment":
        setTreatmentFilter(value);
        break;
      case "from":
        setFromDate(value);
        break;
      case "to":
        setToDate(value);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="bg-white m-8 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Archive</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom ..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                )}
              </div>
              <FilterBar
                statusFilter={statusFilter}
                treatmentFilter={treatmentFilter}
                fromDate={fromDate}
                toDate={toDate}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
        </div>
        <div className="p-6">
          {error && <div className="text-red-600 mb-4">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">{patient.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{patient.patientId}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {patient.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Archiver On:</span>
                    <span className="text-sm text-gray-600 ml-1">{patient.archivedOn}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Reason:</span>
                    <span className="text-sm text-gray-600 ml-1">{patient.reason}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      const archive = archives.find((a) => a.original_id === patient.id);
                      console.log("Selected archive for patient ID", patient.id, ":", archive);
                      handleViewDetails(archive);
                    }}
                    className="text-blue-600 text-sm hover:text-blue-800 font-medium"
                  >
                    View Détails
                  </button>
                  <button
                    onClick={() => {
                      setRestorePatient(patient);
                      setIsRestoreModalOpen(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700"
                  >
                    Restorer
                  </button>
                </div>
              </div>
            ))}
          </div>
          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No archived patients found.</p>
            </div>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
        {isDetailsOpen && selectedPatientDetails && (
          <ViewDetails patient={selectedPatientDetails} onClose={() => setIsDetailsOpen(false)} />
        )}
        <Modal
          isOpen={isRestoreModalOpen}
          onClose={() => setIsRestoreModalOpen(false)}
          title="Restore Patient"
          message={`Are you sure you want to restore ${restorePatient?.name}? They will be returned to the active patient list.`}
          onConfirm={handleRestorePatient}
          confirmText="Restore"
          cancelText="Cancel"
        />
        <Modal
          isOpen={messageModal.isOpen}
          onClose={() => setMessageModal({ isOpen: false, title: "", message: "", isError: false })}
          title={messageModal.title}
          message={messageModal.message}
          isError={messageModal.isError}
          confirmText="OK"
        />
      </div>
    </Layout>
  );
};

export default Archive;