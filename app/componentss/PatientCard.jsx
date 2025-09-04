// "use client";
// import React, { useState, useEffect } from "react";
// import { Calendar, Edit, Trash2 } from "lucide-react";
// import ViewDetails from "./ViewDetails";
// import Modal from "./modal";
// import CreateAppointment from "./CreateAppointment ";
// import EditPatient from "./EditPatient";

// const PatientCard = ({ patient, index, onPatientUpdate }) => {
//   const [details, setDetails] = useState(null);
//   const [isDetailsOpen, setIsDetailsOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
//   const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
//   const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
//   const [messageModal, setMessageModal] = useState({ isOpen: false, title: "", message: "", isError: false });

//   const getInitials = (name) => {
//     const [firstName, lastName] = name.split(" ");
//     return `${firstName[0]}${lastName ? lastName[0] : ""}`.toUpperCase();
//   };

//   const getAvatarColor = (index) => {
//     const colors = [
//       "bg-blue-400",
//       "bg-green-400",
//       "bg-red-400",
//       "bg-purple-400",
//       "bg-orange-400",
//       "bg-pink-400",
//       "bg-yellow-400",
//       "bg-indigo-400",
//     ];
//     return colors[index % colors.length];
//   };

//   const formatDate = (dateString) => {
//     if (!dateString || dateString === "N/A") return "N/A";
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

//   const formatTime = (timeString) => {
//     if (!timeString || timeString === "N/A") return "N/A";
//     try {
//       const [hours, minutes] = timeString.split(":");
//       const date = new Date();
//       date.setHours(parseInt(hours), parseInt(minutes));
//       return date.toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
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

//   const handleArchivePatient = async () => {
//     setIsArchiveModalOpen(false); // Close confirmation modal
//     const token = localStorage.getItem("authToken");
//     if (!token || token.trim() === "") {
//       setMessageModal({
//         isOpen: true,
//         title: "Error",
//         message: "No valid authentication token found. Please log in.",
//         isError: true,
//       });
//       return;
//     }

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/patients/archive/${patient.id}`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.success) {
//         setMessageModal({
//           isOpen: true,
//           title: "Success",
//           message: `Patient ${patient.name} archived successfully.`,
//           isError: false,
//         });
//         // Notify parent component to refresh the patient list
//         if (onPatientUpdate) {
//           onPatientUpdate();
//         }
//         // Close success message after 3 seconds
//         setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 3000);
//       } else {
//         throw new Error(data.message || "Failed to archive patient");
//       }
//     } catch (error) {
//       console.error("Error archiving patient:", error);
//       setMessageModal({
//         isOpen: true,
//         title: "Error",
//         message: error.message || "An error occurred while archiving the patient.",
//         isError: true,
//       });
//       // Close error message after 5 seconds
//       setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 5000);
//     }
//   };

//   const handleAppointmentCreated = () => {
//     setMessageModal({
//       isOpen: true,
//       title: "Success",
//       message: `Appointment created successfully for ${patient.name}.`,
//       isError: false,
//     });
//     // Notify parent component to refresh if needed
//     if (onPatientUpdate) {
//       onPatientUpdate();
//     }
//     // Close success message after 3 seconds
//     setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 3000);
//   };

//   const handlePatientUpdated = () => {
//     setMessageModal({
//       isOpen: true,
//       title: "Success",
//       message: `Patient ${patient.name} updated successfully.`,
//       isError: false,
//     });
//     // Notify parent component to refresh the patient list
//     if (onPatientUpdate) {
//       onPatientUpdate();
//     }
//     // Close success message after 3 seconds
//     setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 3000);
//   };

//   const handleCreateAppointment = () => {
//     setIsCreateAppointmentOpen(true);
//   };

//   const handleEditPatient = () => {
//     setIsEditPatientOpen(true);
//   };

//   useEffect(() => {
//     if (isDetailsOpen) {
//       const fetchDetails = async () => {
//         const token = localStorage.getItem("authToken");
//         if (!token || token.trim() === "") {
//           setError("No valid authentication token found. Please log in.");
//           return;
//         }

//         try {
//           const patientResponse = await fetch(
//             `http://localhost:5000/api/patients/${patient.id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           if (!patientResponse.ok) {
//             throw new Error(`HTTP error! status: ${patientResponse.status}`);
//           }
//           const patientData = await patientResponse.json();
//           if (!patientData.success) {
//             throw new Error(
//               patientData.message || "Failed to fetch patient details"
//             );
//           }
//           const detailedPatient = patientData.data.patient;
//           const consultations = patientData.data.consultations || [];
//           const appointments = patientData.data.appointments || [];
//           const payments = patientData.data.payments || [];
//           const latestConsultation = consultations[0] || null;

//           console.log("Patient Details API Response:", patientData);

//           setDetails({
//             name: `${detailedPatient.first_name} ${detailedPatient.last_name}`,
//             firstName: detailedPatient.first_name,
//             lastName: detailedPatient.last_name,
//             phone: detailedPatient.phone,
//             createdAt: formatDate(detailedPatient.created_at),
//             lastConsult: formatDate(
//               patient.lastConsult || detailedPatient.last_consultation_date
//             ),
//             status: patient.status || detailedPatient.latest_treatment || "No Treatment",
//             statusColor:
//               patient.statusColor ||
//               (detailedPatient.latest_treatment
//                 ? "bg-blue-100 text-blue-800"
//                 : "bg-gray-100 text-gray-800"),
//             payment: patient.payment || detailedPatient.payment_status || "Unpaid",
//             paymentColor: patient.paymentColor || getPaymentColor(detailedPatient.payment_status),
//             totalPrice: patient.totalPrice || detailedPatient.total_price || "0.00",
//             amountPaid: patient.amountPaid || detailedPatient.amount_paid || "0.00",
//             remainingBalance:
//               patient.remainingBalance || detailedPatient.remaining_balance || "0.00",
//             nextAppointmentDate: formatDate(
//               patient.nextAppointmentDate || detailedPatient.next_appointment_date
//             ),
//             nextAppointmentTime: formatTime(
//               patient.nextAppointmentTime || detailedPatient.next_appointment_time
//             ),
//             latestConsultation: latestConsultation
//               ? {
//                   id: latestConsultation.id,
//                   date: formatDate(latestConsultation.date_of_consultation),
//                   treatment: latestConsultation.type_of_prosthesis || "No Treatment",
//                   totalPrice: latestConsultation.total_price || "0.00",
//                   amountPaid: latestConsultation.amount_paid || "0.00",
//                   remainingBalance: latestConsultation.remaining_balance || "0.00",
//                   needsFollowup: latestConsultation.needs_followup === 1,
//                   receiptNumber: latestConsultation.receipt_number || "N/A",
//                 }
//               : null,
//             consultations: consultations.map((consultation) => ({
//               id: consultation.id,
//               date: formatDate(consultation.date_of_consultation),
//               treatment: consultation.type_of_prosthesis || "No Treatment",
//               totalPrice: consultation.total_price || "0.00",
//               amountPaid: consultation.amount_paid || "0.00",
//               remainingBalance: consultation.remaining_balance || "0.00",
//               needsFollowup: consultation.needs_followup === 1,
//               receiptNumber: consultation.receipt_number || "N/A",
//             })),
//             appointments: appointments.map((appointment) => ({
//               id: appointment.id,
//               date: formatDate(appointment.appointment_date),
//               time: formatTime(appointment.appointment_time),
//               treatment: appointment.treatment_type || "N/A",
//               status: appointment.status || "N/A",
//             })),
//             payments: payments.map((payment) => ({
//               id: payment.id,
//               date: formatDate(payment.payment_date),
//               amountPaid: payment.amount_paid || "0.00",
//               paymentMethod: payment.payment_method || "N/A",
//               remainingBalance: payment.remaining_balance || "0.00",
//               receiptNumber: payment.receipt_number || "N/A",
//             })),
//           });
//           setError(null);
//         } catch (error) {
//           console.error("Error fetching details:", error);
//           setError(error.message || "An error occurred while fetching patient details.");
//         }
//       };
//       fetchDetails();
//     } else {
//       setDetails(null);
//       setError(null);
//     }
//   }, [isDetailsOpen, patient]);

//   return (
//     <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//       <div className="flex items-start space-x-3 mb-4">
//         <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
//           <div
//             className={`w-full h-full flex items-center justify-center text-white font-medium ${getAvatarColor(index)}`}
//           >
//             {getInitials(patient.name)}
//           </div>
//         </div>
//         <div className="flex-1 min-w-0">
//           <h3 className="font-medium text-gray-900 truncate">{patient.name}</h3>
//           <p className="text-sm text-gray-500 truncate">{patient.phone}</p>
//         </div>
//       </div>
//       <div className="flex justify-between items-center mb-2">
//         <span className="text-sm text-gray-600">Last Consult:</span>
//         <span className="text-sm text-gray-900">{formatDate(patient.lastConsult)}</span>
//       </div>
//       <div className="flex flex-col gap-2 mb-4">
//         <div className="flex flex-row justify-between">
//           <span
//             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.statusColor || "bg-gray-100 text-gray-800"}`}
//           >
//             {patient.status || "No Treatment"}
//           </span>
//           <span
//             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.paymentColor || "bg-red-100 text-red-800"}`}
//           >
//             Payment: {patient.payment || "Unpaid"}
//           </span>
//         </div>
//         {patient.remainingBalance && patient.remainingBalance !== "0.00" && (
//           <div>
//             <span className="text-sm text-gray-600">Remaining Balance:</span>
//             <span className="text-sm text-red-600 ml-2">${patient.remainingBalance}</span>
//           </div>
//         )}
//       </div>
//       <div className="flex justify-between items-center pt-2 border-t border-gray-100">
//         <button
//           className="text-blue-600 text-sm hover:text-blue-800"
//           onClick={() => setIsDetailsOpen(true)}
//         >
//           View Details
//         </button>
//         <div className="flex space-x-2">
//           <button 
//             className="p-1 hover:bg-gray-100 rounded transition-colors"
//             onClick={handleCreateAppointment}
//             title="Create Appointment"
//           >
//             <Calendar className="w-4 h-4 text-blue-600" />
//           </button>
//           <button 
//             className="p-1 hover:bg-gray-100 rounded transition-colors"
//             onClick={handleEditPatient}
//             title="Edit Patient"
//           >
//             <Edit className="w-4 h-4 text-green-600" />
//           </button>
//           <button
//             className="p-1 hover:bg-gray-100 rounded"
//             onClick={() => setIsArchiveModalOpen(true)}
//             title="Archive Patient"
//           >
//             <Trash2 className="w-4 h-4 text-red-500" />
//           </button>
//         </div>
//       </div>
      
//       {/* Details Modal */}
//       {isDetailsOpen && (
//         <div>
//           {error && (
//             <div className="text-red-600 mb-2">{error}</div>
//           )}
//           {details && <ViewDetails patient={details} onClose={() => setIsDetailsOpen(false)} />}
//         </div>
//       )}

//       {/* Create Appointment Modal */}
//       {isCreateAppointmentOpen && (
//         <CreateAppointment
//           patient={patient}
//           onClose={() => setIsCreateAppointmentOpen(false)}
//           onAppointmentCreated={handleAppointmentCreated}
//         />
//       )}

//       {/* Edit Patient Modal */}
//       {isEditPatientOpen && (
//         <EditPatient
//           patient={patient}
//           onClose={() => setIsEditPatientOpen(false)}
//           onPatientUpdated={handlePatientUpdated}
//         />
//       )}

//       {/* Archive Confirmation Modal */}
//       <Modal
//         isOpen={isArchiveModalOpen}
//         onClose={() => setIsArchiveModalOpen(false)}
//         title="Archive Patient"
//         message={`Are you sure you want to archive ${patient.name}? This will remove them from the active patient list.`}
//         onConfirm={handleArchivePatient}
//         confirmText="Archive"
//         cancelText="Cancel"
//       />

//       {/* Success/Error Message Modal */}
//       <Modal
//         isOpen={messageModal.isOpen}
//         onClose={() => setMessageModal({ isOpen: false, title: "", message: "", isError: false })}
//         title={messageModal.title}
//         message={messageModal.message}
//         isError={messageModal.isError}
//         confirmText="OK"
//       />
//     </div>
//   );
// };

// export default PatientCard;


"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Edit, Trash2 } from "lucide-react";
import ViewDetails from "./ViewDetails";
import Modal from "./modal";
import CreateAppointment from "./CreateAppointment ";
import EditPatient from "./EditPatient";

const PatientCard = ({ patient, index, onPatientUpdate }) => {
  const [details, setDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [messageModal, setMessageModal] = useState({ isOpen: false, title: "", message: "", isError: false });

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(" ");
    return `${firstName[0]}${lastName ? lastName[0] : ""}`.toUpperCase();
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-400",
      "bg-green-400",
      "bg-red-400",
      "bg-purple-400",
      "bg-orange-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-indigo-400",
    ];
    return colors[index % colors.length];
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
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
    if (!timeString || timeString === "N/A") return "N/A";
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
      case "pending":
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const formatTreatmentWithTeinte = (treatment, teinte) => {
    if (!treatment || treatment === "No Treatment") return "No Treatment";
    return teinte ? `${treatment} (${teinte})` : treatment;
  };

  const handleArchivePatient = async () => {
    setIsArchiveModalOpen(false); // Close confirmation modal
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
      const response = await fetch(
        `http://localhost:5000/api/patients/archive/${patient.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setMessageModal({
          isOpen: true,
          title: "Success",
          message: `Patient ${patient.name} archived successfully.`,
          isError: false,
        });
        // Notify parent component to refresh the patient list
        if (onPatientUpdate) {
          onPatientUpdate();
        }
        // Close success message after 3 seconds
        setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 3000);
      } else {
        throw new Error(data.message || "Failed to archive patient");
      }
    } catch (error) {
      console.error("Error archiving patient:", error);
      setMessageModal({
        isOpen: true,
        title: "Error",
        message: error.message || "An error occurred while archiving the patient.",
        isError: true,
      });
      // Close error message after 5 seconds
      setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 5000);
    }
  };

  const handleAppointmentCreated = () => {
    setMessageModal({
      isOpen: true,
      title: "Success",
      message: `Appointment created successfully for ${patient.name}.`,
      isError: false,
    });
    // Notify parent component to refresh if needed
    if (onPatientUpdate) {
      onPatientUpdate();
    }
    // Close success message after 3 seconds
    setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 3000);
  };

  const handlePatientUpdated = () => {
    setMessageModal({
      isOpen: true,
      title: "Success",
      message: `Patient ${patient.name} updated successfully.`,
      isError: false,
    });
    // Notify parent component to refresh the patient list
    if (onPatientUpdate) {
      onPatientUpdate();
    }
    // Close success message after 3 seconds
    setTimeout(() => setMessageModal({ isOpen: false, title: "", message: "", isError: false }), 3000);
  };

  const handleCreateAppointment = () => {
    setIsCreateAppointmentOpen(true);
  };

  const handleEditPatient = () => {
    setIsEditPatientOpen(true);
  };

  useEffect(() => {
    if (isDetailsOpen) {
      const fetchDetails = async () => {
        const token = localStorage.getItem("authToken");
        if (!token || token.trim() === "") {
          setError("No valid authentication token found. Please log in.");
          return;
        }

        try {
          const patientResponse = await fetch(
            `http://localhost:5000/api/patients/${patient.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!patientResponse.ok) {
            throw new Error(`HTTP error! status: ${patientResponse.status}`);
          }
          const patientData = await patientResponse.json();
          if (!patientData.success) {
            throw new Error(
              patientData.message || "Failed to fetch patient details"
            );
          }
          const detailedPatient = patientData.data.patient;
          const consultations = patientData.data.consultations || [];
          const appointments = patientData.data.appointments || [];
          const payments = patientData.data.payments || [];
          const latestConsultation = consultations[0] || null;

          console.log("Patient Details API Response:", patientData);

          setDetails({
            name: `${detailedPatient.first_name} ${detailedPatient.last_name}`,
            firstName: detailedPatient.first_name,
            lastName: detailedPatient.last_name,
            phone: detailedPatient.phone,
            createdAt: formatDate(detailedPatient.created_at),
            lastConsult: formatDate(
              patient.lastConsult || detailedPatient.last_consultation_date
            ),
            status: formatTreatmentWithTeinte(
              patient.status || detailedPatient.latest_treatment || "No Treatment",
              patient.latestTeinte || detailedPatient.latest_teinte
            ),
            statusColor:
              patient.statusColor ||
              (detailedPatient.latest_treatment
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"),
            payment: patient.payment || detailedPatient.payment_status || "Unpaid",
            paymentColor: patient.paymentColor || getPaymentColor(detailedPatient.payment_status),
            totalPrice: patient.totalPrice || detailedPatient.total_price || "0.00",
            amountPaid: patient.amountPaid || detailedPatient.amount_paid || "0.00",
            remainingBalance:
              patient.remainingBalance || detailedPatient.remaining_balance || "0.00",
            nextAppointmentDate: formatDate(
              patient.nextAppointmentDate || detailedPatient.next_appointment_date
            ),
            nextAppointmentTime: formatTime(
              patient.nextAppointmentTime || detailedPatient.next_appointment_time
            ),
            latestConsultation: latestConsultation
              ? {
                  id: latestConsultation.id,
                  date: formatDate(latestConsultation.date_of_consultation),
                  treatment: formatTreatmentWithTeinte(
                    latestConsultation.type_of_prosthesis || "No Treatment",
                    latestConsultation.teinte
                  ),
                  totalPrice: latestConsultation.total_price || "0.00",
                  amountPaid: latestConsultation.amount_paid || "0.00",
                  remainingBalance: latestConsultation.remaining_balance || "0.00",
                  needsFollowup: latestConsultation.needs_followup === 1,
                  receiptNumber: latestConsultation.receipt_number || "N/A",
                  teinte: latestConsultation.teinte || "N/A", // Added teinte
                }
              : null,
            consultations: consultations.map((consultation) => ({
              id: consultation.id,
              date: formatDate(consultation.date_of_consultation),
              treatment: formatTreatmentWithTeinte(
                consultation.type_of_prosthesis || "No Treatment",
                consultation.teinte
              ),
              totalPrice: consultation.total_price || "0.00",
              amountPaid: consultation.amount_paid || "0.00",
              remainingBalance: consultation.remaining_balance || "0.00",
              needsFollowup: consultation.needs_followup === 1,
              receiptNumber: consultation.receipt_number || "N/A",
              teinte: consultation.teinte || "N/A", // Added teinte
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
          });
          setError(null);
        } catch (error) {
          console.error("Error fetching details:", error);
          setError(error.message || "An error occurred while fetching patient details.");
        }
      };
      fetchDetails();
    } else {
      setDetails(null);
      setError(null);
    }
  }, [isDetailsOpen, patient]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
          <div
            className={`w-full h-full flex items-center justify-center text-white font-medium ${getAvatarColor(index)}`}
          >
            {getInitials(patient.name)}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{patient.name}</h3>
          <p className="text-sm text-gray-500 truncate">{patient.phone}</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Last Consult:</span>
        <span className="text-sm text-gray-900">{formatDate(patient.lastConsult)}</span>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-row justify-between">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.statusColor || "bg-gray-100 text-gray-800"}`}
          >
            {formatTreatmentWithTeinte(patient.status || "No Treatment", patient.latestTeinte)}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.paymentColor || "bg-red-100 text-red-800"}`}
          >
            Payment: {patient.payment || "Unpaid"}
          </span>
        </div>
        {patient.remainingBalance && patient.remainingBalance !== "0.00" && (
          <div>
            <span className="text-sm text-gray-600">Remaining Balance:</span>
            <span className="text-sm text-red-600 ml-2">${patient.remainingBalance}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <button
          className="text-blue-600 text-sm hover:text-blue-800"
          onClick={() => setIsDetailsOpen(true)}
        >
          View Details
        </button>
        <div className="flex space-x-2">
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={handleCreateAppointment}
            title="Create Appointment"
          >
            <Calendar className="w-4 h-4 text-blue-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={handleEditPatient}
            title="Edit Patient"
          >
            <Edit className="w-4 h-4 text-green-600" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => setIsArchiveModalOpen(true)}
            title="Archive Patient"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsOpen && (
        <div>
          {error && (
            <div className="text-red-600 mb-2">{error}</div>
          )}
          {details && <ViewDetails patient={details} onClose={() => setIsDetailsOpen(false)} />}
        </div>
      )}

      {/* Create Appointment Modal */}
      {isCreateAppointmentOpen && (
        <CreateAppointment
          patient={patient}
          onClose={() => setIsCreateAppointmentOpen(false)}
          onAppointmentCreated={handleAppointmentCreated}
        />
      )}

      {/* Edit Patient Modal */}
      {isEditPatientOpen && (
        <EditPatient
          patient={patient}
          onClose={() => setIsEditPatientOpen(false)}
          onPatientUpdated={handlePatientUpdated}
        />
      )}

      {/* Archive Confirmation Modal */}
      <Modal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        title="Archive Patient"
        message={`Are you sure you want to archive ${patient.name}? This will remove them from the active patient list.`}
        onConfirm={handleArchivePatient}
        confirmText="Archive"
        cancelText="Cancel"
      />

      {/* Success/Error Message Modal */}
      <Modal
        isOpen={messageModal.isOpen}
        onClose={() => setMessageModal({ isOpen: false, title: "", message: "", isError: false })}
        title={messageModal.title}
        message={messageModal.message}
        isError={messageModal.isError}
        confirmText="OK"
      />
    </div>
  );
};

export default PatientCard;