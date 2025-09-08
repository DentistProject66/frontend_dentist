// "use client";

// import React, { useState } from "react";
// import { Calendar, ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
// import Layout from "../layout/layout";
// import ProtectedRoute from "../../lib/ProtectedRoutes"; 

// const Button = ({ children, variant = "default", className = "", onClick, disabled = false, ...props }) => {
//   const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50";

//   const variants = {
//     default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
//     primary: "bg-blue-600 text-white hover:bg-blue-700",
//     secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
//   };

//   const classes = `${baseClasses} ${variants[variant]} h-9 px-4 py-2 ${className}`;

//   return (
//     <button className={classes} onClick={onClick} disabled={disabled} {...props}>
//       {children}
//     </button>
//   );
// };

// const Toggle = ({ checked, onChange }) => {
//   return (
//     <button
//       onClick={onChange}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//         checked ? "bg-blue-600" : "bg-gray-300"
//       }`}
//     >
//       <span
//         className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//           checked ? "translate-x-6" : "translate-x-1"
//         }`}
//       />
//     </button>
//   );
// };

// const Select = ({ value, onChange, options, placeholder }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-left bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//       >
//         <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
//         <ChevronDown className="h-4 w-4 text-gray-400" />
//       </button>

//       {isOpen && (
//         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
//           {options.map((option) => (
//             <button
//               key={option}
//               onClick={() => {
//                 onChange(option);
//                 setIsOpen(false);
//               }}
//               className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const ConsultationForm = () => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     phoneNumber: "",
//     typeOfProsthesis: "",
//     totalPrice: "",
//     amountPaid: "",
//     consultationDate: new Date().toISOString().split("T")[0],
//     needsFollowUp: false,
//     followUpDate: "",
//     followUpTime: "09:00",
//   });

//   const [loading, setLoading] = useState(false);
//   const [alert, setAlert] = useState(null);

//   const handleInputChange = (field, value) => {
//     setForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const calculateRemainingBalance = () => {
//     const total = parseFloat(form.totalPrice) || 0;
//     const paid = parseFloat(form.amountPaid) || 0;
//     return total - paid;
//   };

//   const prosthesisOptions = ["totale haut et bas", "totale haut", "tatale bas", "partiel haut", "partiel bas", "unitaire"];

//   const showAlert = (message, variant = "default") => {
//     setAlert({ message, variant });
//     setTimeout(() => setAlert(null), 5000);
//   };

//   const validateForm = () => {
//     if (!form.firstName.trim()) {
//       showAlert("First name is required", "error");
//       return false;
//     }
//     if (!form.lastName.trim()) {
//       showAlert("Last name is required", "error");
//       return false;
//     }
//     if (!form.typeOfProsthesis) {
//       showAlert("Type of prosthesis is required", "error");
//       return false;
//     }
//     if (!form.totalPrice || parseFloat(form.totalPrice) < 0) {
//       showAlert("Total price must be a positive number", "error");
//       return false;
//     }
//     if (parseFloat(form.amountPaid || 0) < 0) {
//       showAlert("Amount paid cannot be negative", "error");
//       return false;
//     }
//     if (parseFloat(form.amountPaid || 0) > parseFloat(form.totalPrice)) {
//       showAlert("Amount paid cannot exceed total price", "error");
//       return false;
//     }
//     if (form.needsFollowUp && !form.followUpDate) {
//       showAlert("Follow-up date is required when follow-up is needed", "error");
//       return false;
//     }
//     if (form.needsFollowUp && !form.followUpTime) {
//       showAlert("Follow-up time is required when follow-up is needed", "error");
//       return false;
//     }
//     return true;
//   };

//   const getAuthToken = () => {
//     try {
//       return localStorage.getItem("token") || localStorage.getItem("authToken");
//     } catch (error) {
//       console.error("Error getting token from localStorage:", error);
//       return null;
//     }
//   };

//   const handleSubmit = async (action = "save") => {
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const token = getAuthToken();
//       if (!token) {
//         showAlert("Authentication token not found. Please log in again.", "error");
//         setLoading(false);
//         return;
//       }

//       const requestBody = {
//         first_name: form.firstName.trim(),
//         last_name: form.lastName.trim(),
//         phone: form.phoneNumber.trim() || null,
//         date_of_consultation: form.consultationDate,
//         type_of_prosthesis: form.typeOfProsthesis,
//         total_price: parseFloat(form.totalPrice),
//         amount_paid: parseFloat(form.amountPaid) || 0,
//         needs_followup: form.needsFollowUp,
//       };

//       if (form.needsFollowUp) {
//         requestBody.follow_up_date = form.followUpDate;
//         requestBody.follow_up_time = form.followUpTime;
//       }

//       console.log("Sending request:", requestBody);

//       const response = await fetch("https://backenddentist-production-12fe.up.railway.app/api/consultations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
//       const data = await response.json();
//       console.log("Response:", data);

//       if (response.ok && data.success) {
//         showAlert(`Consultation ${action === "print" ? "saved and receipt generated" : "saved"} successfully!`, "success");

//         if (action === "print") {
//           // You can implement receipt printing logic here
//           console.log("Receipt data:", data.data);
//         }

//         // Reset form after successful submission
//         setForm({
//           firstName: "",
//           lastName: "",
//           phoneNumber: "",
//           typeOfProsthesis: "",
//           totalPrice: "",
//           amountPaid: "",
//           consultationDate: new Date().toISOString().split("T")[0],
//           needsFollowUp: false,
//           followUpDate: "",
//           followUpTime: "09:00",
//         });
//       } else {
//         showAlert(data.message || "Failed to save consultation", "error");
//       }
//     } catch (error) {
//       console.error("Error saving consultation:", error);
//       showAlert("Network error. Please check your connection and try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setForm({
//       firstName: "",
//       lastName: "",
//       phoneNumber: "",
//       typeOfProsthesis: "",
//       totalPrice: "",
//       amountPaid: "",
//       consultationDate: new Date().toISOString().split("T")[0],
//       needsFollowUp: false,
//       followUpDate: "",
//       followUpTime: "09:00",
//     });
//     setAlert(null);
//   };

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <Layout>
//       <div className=" max-h-screen m-8 bg-white px-6 py-4">
//         <div className="max-w-6xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-2xl font-semibold text-gray-900">New Consultation</h1>
//           </div>

//           {/* Form Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             {/* Patient Information */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
//                   <input
//                     type="text"
//                     value={form.firstName}
//                     onChange={(e) => handleInputChange("firstName", e.target.value)}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
//                   <input
//                     type="text"
//                     value={form.lastName}
//                     onChange={(e) => handleInputChange("lastName", e.target.value)}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                   <input
//                     type="text"
//                     value={form.phoneNumber}
//                     onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Date</label>
//                   <div className="relative">
//                     <input
//                       type="date"
//                       value={form.consultationDate}
//                       onChange={(e) => handleInputChange("consultationDate", e.target.value)}
//                       className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     />
//                     <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">{formatDate(form.consultationDate)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Treatment Details */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Details</h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Type of Prosthesis *</label>
//                   <Select
//                     value={form.typeOfProsthesis}
//                     onChange={(value) => handleInputChange("typeOfProsthesis", value)}
//                     options={prosthesisOptions}
//                     placeholder="Select prosthesis type"
//                   />
//                   <input type="text" />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Total Price *</label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={form.totalPrice}
//                     onChange={(e) => handleInputChange("totalPrice", e.target.value)}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={form.amountPaid}
//                     onChange={(e) => handleInputChange("amountPaid", e.target.value)}
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Balance</label>
//                   <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 font-medium">
//                     ${calculateRemainingBalance().toFixed(2)}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* Follow-up */}
//             <div className="bg-white rounded-lg border border-gray-200 p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Follow-up</h2>

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <label className="text-sm font-medium text-gray-700">Needs Follow-up Appointment?</label>
//                   <Toggle
//                     checked={form.needsFollowUp}
//                     onChange={() => handleInputChange("needsFollowUp", !form.needsFollowUp)}
//                   />
//                 </div>

//                 {form.needsFollowUp && (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date *</label>
//                       <input
//                         type="date"
//                         value={form.followUpDate}
//                         onChange={(e) => handleInputChange("followUpDate", e.target.value)}
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         required
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Time *</label>
//                       <input
//                         type="time"
//                         value={form.followUpTime}
//                         onChange={(e) => handleInputChange("followUpTime", e.target.value)}
//                         className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//                         required
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3">
//             <Button variant="default" onClick={handleCancel} disabled={loading}>
//               Cancel
//             </Button>
//             <Button variant="secondary" onClick={() => handleSubmit("print")} disabled={loading}>
//               {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//               Save & Print Receipt
//             </Button>
//             <Button variant="primary" onClick={() => handleSubmit("save")} disabled={loading}>
//               {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
//               Save Consultation
//             </Button>
//           </div>

//           {/* Modal Alert */}
//           {alert && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//               <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
//                 <div className="flex items-center gap-2">
//                   {alert.variant === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
//                   {alert.variant === "error" && <AlertCircle className="h-6 w-6 text-red-600" />}
//                   <span className="text-gray-900">{alert.message}</span>
//                 </div>
//                 <button
//                   onClick={() => setAlert(null)}
//                   className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProtectedRoute(ConsultationForm, ["dentist", "assistant"]);







"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Layout from "../layout/layout";
import ProtectedRoute from "../../lib/ProtectedRoutes";

const Button = ({ children, variant = "default", className = "", onClick, disabled = false, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  const classes = `${baseClasses} ${variants[variant]} h-9 px-4 py-2 ${className}`;

  return (
    <button className={classes} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

const Toggle = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

const Select = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 text-left bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ConsultationForm = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    typeOfProsthesis: "",
    teinte: "", // Added teinte field
    totalPrice: "",
    amountPaid: "",
    consultationDate: new Date().toISOString().split("T")[0],
    needsFollowUp: false,
    followUpDate: "",
    followUpTime: "09:00",
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateRemainingBalance = () => {
    const total = parseFloat(form.totalPrice) || 0;
    const paid = parseFloat(form.amountPaid) || 0;
    return total - paid;
  };

  const prosthesisOptions = ["totale haut et bas", "totale haut", "tatale bas", "partiel haut", "partiel bas", "unitaire"];

  const showAlert = (message, variant = "default") => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 5000);
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      showAlert("Le prénom est obligatoire", "error");
      return false;
    }
    if (!form.lastName.trim()) {
      showAlert("Le nom de famille est obligatoire", "error");
      return false;
    }
    if (!form.typeOfProsthesis) {
      showAlert("Le type de prothèse est obligatoire", "error");
      return false;
    }
    if (!form.totalPrice || parseFloat(form.totalPrice) < 0) {
      showAlert("Le prix total doit être un nombre positi", "error");
      return false;
    }
    if (parseFloat(form.amountPaid || 0) < 0) {
      showAlert("Le montant payé ne peut pas être négatif", "error");
      return false;
    }
    if (parseFloat(form.amountPaid || 0) > parseFloat(form.totalPrice)) {
      showAlert("Le montant payé ne peut pas dépasser le prix total", "error");
      return false;
    }
    if (form.needsFollowUp && !form.followUpDate) {
      showAlert("La date du suivi est obligatoire lorsque le suivi est nécessaire", "error");
      return false;
    }
    if (form.needsFollowUp && !form.followUpTime) {
      showAlert("L’heure du suivi est obligatoire lorsque le suivi est nécessaire", "error");
      return false;
    }
    if (form.teinte && form.teinte.length > 50) {
      showAlert("La teinte ne doit pas dépasser 50 caractères", "error");
      return false;
    }
    return true;
  };

  const getAuthToken = () => {
    try {
      return localStorage.getItem("token") || localStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting token from localStorage:", error);
      return null;
    }
  };

  const handleSubmit = async (action = "save") => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        showAlert("Jeton d’authentification introuvable. Veuillez vous reconnecter", "error");
        setLoading(false);
        return;
      }

      const requestBody = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone: form.phoneNumber.trim() || null,
        date_of_consultation: form.consultationDate,
        type_of_prosthesis: form.typeOfProsthesis,
        teinte: form.teinte.trim() || null, // Include teinte in request body
        total_price: parseFloat(form.totalPrice),
        amount_paid: parseFloat(form.amountPaid) || 0,
        needs_followup: form.needsFollowUp,
      };

      if (form.needsFollowUp) {
        requestBody.follow_up_date = form.followUpDate;
        requestBody.follow_up_time = form.followUpTime;
      }

      console.log("Sending request:", requestBody);

      const response = await fetch("https://backenddentist-production-12fe.up.railway.app/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      console.log("Response:", data);

      if (response.ok && data.success) {
        showAlert(`Consultation ${action === "print" ? "saved and receipt generated" : "enregistrée"} successfully!`, "avec succès");

        if (action === "print") {
          // You can implement receipt printing logic here
          console.log("Receipt data:", data.data);
        }

        // Reset form after successful submission
        setForm({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          typeOfProsthesis: "",
          teinte: "", // Reset teinte
          totalPrice: "",
          amountPaid: "",
          consultationDate: new Date().toISOString().split("T")[0],
          needsFollowUp: false,
          followUpDate: "",
          followUpTime: "09:00",
        });
      } else {
        showAlert(data.message || "Failed to save consultation", "error");
      }
    } catch (error) {
      console.error("Error saving consultation:", error);
      showAlert("Network error. Please check your connection and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      typeOfProsthesis: "",
      teinte: "", // Reset teinte
      totalPrice: "",
      amountPaid: "",
      consultationDate: new Date().toISOString().split("T")[0],
      needsFollowUp: false,
      followUpDate: "",
      followUpTime: "09:00",
    });
    setAlert(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="max-h-screen m-8 bg-white px-6 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Nouvelle Consultation </h1>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Patient Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du Patient </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de famille *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"> Numéro de téléphone</label>
                  <input
                    type="text"
                    value={form.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de Consultation </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.consultationDate}
                      onChange={(e) => handleInputChange("consultationDate", e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(form.consultationDate)}</p>
                </div>
              </div>
            </div>

            {/* Treatment Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails du Traitement </h2>

              <div className="space-y-4">
               {/* Type de prothèse */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Type de prothèse
  </label>
  <input
    type="text"
    value={form.typeOfProsthesis}
    onChange={(e) => handleInputChange("typeOfProsthesis", e.target.value)}
    placeholder="Entrez le type de prothèse"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg 
               focus:outline-none focus:ring-2 focus:ring-blue-500 
               focus:border-transparent"
  />
</div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teinte</label>
                  <input
                    type="text"
                    value={form.teinte}
                    onChange={(e) => handleInputChange("teinte", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Entrer la teinte"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix Total *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.totalPrice}
                    onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant Payé</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amountPaid}
                    onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Solde restant </label>
                  <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 font-medium">
                    DA{calculateRemainingBalance().toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-up */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Suivi</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Nécessite un rendez-vous de suivi ?</label>
                  <Toggle
                    checked={form.needsFollowUp} // Fixed syntax error
                    onChange={() => handleInputChange("needsFollowUp", !form.needsFollowUp)}
                  />
                </div>

                {form.needsFollowUp && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date du suivi *</label>
                      <input
                        type="date"
                        value={form.followUpDate}
                        onChange={(e) => handleInputChange("followUpDate", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Heure du suivi*</label>
                      <input
                        type="time"
                        value={form.followUpTime}
                        onChange={(e) => handleInputChange("followUpTime", e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="default" onClick={handleCancel} disabled={loading}>
              Annuler
            </Button>
            <Button className="hidden" variant="secondary" onClick={() => handleSubmit("print")} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save & Print Receipt
            </Button>
            <Button variant="primary" onClick={() => handleSubmit("save")} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
Enregistrer la consultation            </Button>
          </div>

          {/* Modal Alert */}
          {alert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
                <div className="flex items-center gap-2">
                  {alert.variant === "success" && <CheckCircle className="h-6 w-6 text-green-600" />}
                  {alert.variant === "error" && <AlertCircle className="h-6 w-6 text-red-600" />}
                  <span className="text-gray-900">{alert.message}</span>
                </div>
                <button
                  onClick={() => setAlert(null)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProtectedRoute(ConsultationForm, ["dentist", "assistant"]);