// "use client";
// import React, { useState, useEffect } from "react";
// import PatientList from "../componentss/PatientList";
// import Pagination from "../componentss/PaginationComponent";
// import FilterBar from "../componentss/FilterBar";
// import Layout from "../layout/layout";
// import ProtectedRoute from "../../lib/ProtectedRoutes"; 

// const PatientManagement = () => {
//   const [patients, setPatients] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All Statuses");
//   const [treatmentFilter, setTreatmentFilter] = useState("All Treatments");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [totalPages, setTotalPages] = useState(1);
//   const [error, setError] = useState(null);
//   const [refreshKey, setRefreshKey] = useState(0);
//   const patientsPerPage = 6;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       });
//     } catch (error) {
//       return "N/A";
//     }
//   };

//   const getPaymentColor = (paymentStatus) => {
//     switch (paymentStatus?.toLowerCase()) {
//       case "paid":
//         return "bg-green-100 text-green-800";
//       case "partial":
//         return "bg-yellow-100 text-yellow-800";
//       case "unpaid":
//       default:
//         return "bg-red-100 text-red-800";
//     }
//   };

//   const handlePatientUpdate = () => {
//     setRefreshKey((prev) => prev + 1);
//   };

//   useEffect(() => {
//     const fetchPatients = async () => {
//       const token = localStorage.getItem("authToken");
//       if (!token || token.trim() === "") {
//         setError("No valid authentication token found. Please log in.");
//         return;
//       }

//       const url = new URL("https://backenddentist-production-12fe.up.railway.app/api/patients");
//       url.searchParams.append("page", currentPage);
//       url.searchParams.append("limit", patientsPerPage);
//       if (searchTerm) url.searchParams.append("search", searchTerm);
//       if (statusFilter !== "All Statuses") url.searchParams.append("latest_treatment", statusFilter);
//       if (fromDate) url.searchParams.append("last_consultation_date_gte", fromDate);
//       if (toDate) url.searchParams.append("last_consultation_date_lte", toDate);

//       try {
//         const response = await fetch(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         if (data.success) {
//           const transformedPatients = data.data.patients
//             .filter((patient) => patient.is_archived === 0) // Exclude archived patients
//             .map((patient) => ({
//               id: patient.id,
//               name: `${patient.first_name} ${patient.last_name}`,
//               phone: patient.phone,
//               lastConsult: patient.last_consultation_date,
//               status: patient.latest_treatment || "No Treatment",
//               statusColor: patient.latest_treatment ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
//               payment: patient.payment_status || "Unpaid",
//               paymentColor: getPaymentColor(patient.payment_status),
//               remainingBalance: patient.remaining_balance && patient.remaining_balance !== "0.00" ? patient.remaining_balance : null,
//               totalPrice: patient.total_price,
//               amountPaid: patient.amount_paid,
//               nextAppointmentDate: patient.next_appointment_date,
//               nextAppointmentTime: patient.next_appointment_time,
//               createdAt: patient.created_at,
//             }));
//           console.log("Transformed Patients:", transformedPatients);
//           setPatients(transformedPatients);
//           setTotalPages(data.data.pagination.pages);
//           setError(null);
//         } else {
//           throw new Error(data.message || "Failed to fetch patients");
//         }
//       } catch (error) {
//         console.error("Error fetching patients:", error);
//         setError(error.message || "An error occurred while fetching patients.");
//       }
//     };
//     fetchPatients();
//   }, [currentPage, searchTerm, statusFilter, fromDate, toDate, refreshKey]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleFilterChange = (type, value) => {
//     switch (type) {
//       case "status":
//         setStatusFilter(value);
//         break;
//       case "treatment":
//         setTreatmentFilter(value);
//         break;
//       case "from":
//         setFromDate(value);
//         break;
//       case "to":
//         setToDate(value);
//         break;
//       default:
//         break;
//     }
//     setCurrentPage(1);
//   };

//   return (
//     <Layout>
//       <div className="bg-white m-8 overflow-hidden">
//         <div className="border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>
//             <div className="flex items-center space-x-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search by name..."
//                   value={searchTerm}
//                   onChange={handleSearchChange}
//                   className="w-48 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:border-transparent"
//                 />
//                 {searchTerm && (
//                   <button
//                     onClick={() => setSearchTerm("")}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   >
//                     ×
//                   </button>
//                 )}
//               </div>
//               <FilterBar
//                 statusFilter={statusFilter}
//                 treatmentFilter={treatmentFilter}
//                 fromDate={fromDate}
//                 toDate={toDate}
//                 onFilterChange={handleFilterChange}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="p-6">
//           {error && <div className="text-red-600 mb-4">{error}</div>}
//           <PatientList patients={patients} onPatientUpdate={handlePatientUpdate} />
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProtectedRoute(PatientManagement, ["dentist", "assistant"]);





"use client";
import React, { useState, useEffect } from "react";
import PatientList from "../componentss/PatientList";
import Pagination from "../componentss/PaginationComponent";
import FilterBar from "../componentss/FilterBar";
import Layout from "../layout/layout";
import ProtectedRoute from "../../lib/ProtectedRoutes";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [treatmentFilter, setTreatmentFilter] = useState("All Treatments");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
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

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-red-100 text-red-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const handlePatientUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("authToken");
      if (!token || token.trim() === "") {
        setError("No valid authentication token found. Please log in.");
        return;
      }

      const url = new URL("https://backenddentist-production-12fe.up.railway.app/api/patients");
      url.searchParams.append("page", currentPage);
      url.searchParams.append("limit", patientsPerPage);
      if (searchTerm) url.searchParams.append("search", searchTerm);
      if (statusFilter !== "All Statuses") url.searchParams.append("latest_treatment", statusFilter);
      if (fromDate) url.searchParams.append("last_consultation_date_gte", fromDate);
      if (toDate) url.searchParams.append("last_consultation_date_lte", toDate);

      try {
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          const transformedPatients = data.data.patients
            .filter((patient) => patient.is_archived === 0) // Exclude archived patients
            .map((patient) => ({
              id: patient.id,
              name: `${patient.first_name} ${patient.last_name}`,
              phone: patient.phone,
              lastConsult: patient.last_consultation_date,
              status: patient.latest_treatment || "No Treatment",
              latestTeinte: patient.latest_teinte, // Added latestTeinte
              statusColor: patient.latest_treatment ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
              payment: patient.payment_status || "Unpaid",
              paymentColor: getPaymentColor(patient.payment_status),
              remainingBalance: patient.remaining_balance && patient.remaining_balance !== "0.00" ? patient.remaining_balance : null,
              totalPrice: patient.total_price,
              amountPaid: patient.amount_paid,
              nextAppointmentDate: patient.next_appointment_date,
              nextAppointmentTime: patient.next_appointment_time,
              createdAt: patient.created_at,
            }));
          console.log("Transformed Patients:", transformedPatients);
          setPatients(transformedPatients);
          setTotalPages(data.data.pagination.pages);
          setError(null);
        } else {
          throw new Error(data.message || "Failed to fetch patients");
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError(error.message || "An error occurred while fetching patients.");
      }
    };
    fetchPatients();
  }, [currentPage, searchTerm, statusFilter, fromDate, toDate, refreshKey]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">Management des Patients </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
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
          <PatientList patients={patients} onPatientUpdate={handlePatientUpdate} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProtectedRoute(PatientManagement, ["dentist", "assistant"]);
