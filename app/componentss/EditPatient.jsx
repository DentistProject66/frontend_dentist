// "use client";
// import React, { useState } from "react";
// import { X, Edit, User, Phone } from "lucide-react";

// const EditPatient = ({ patient, onClose, onPatientUpdated }) => {
//   const [formData, setFormData] = useState({
//     first_name: patient.name?.split(" ")[0] || "",
//     last_name: patient.name?.split(" ").slice(1).join(" ") || "",
//     phone: patient.phone || "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setError(null);
//   };

//   const validateForm = () => {
//     if (!formData.first_name.trim()) {
//       setError("First name is required");
//       return false;
//     }
//     if (!formData.last_name.trim()) {
//       setError("Last name is required");
//       return false;
//     }
//     if (!formData.phone.trim()) {
//       setError("Phone number is required");
//       return false;
//     }
    
//     // Basic phone validation (adjust pattern as needed)
//     const phoneRegex = /^[0-9+\-\s()]+$/;
//     if (!phoneRegex.test(formData.phone)) {
//       setError("Please enter a valid phone number");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);
//     setError(null);

//     const token = localStorage.getItem("authToken");
//     if (!token || token.trim() === "") {
//       setError("No valid authentication token found. Please log in.");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const updateData = {
//         first_name: formData.first_name.trim(),
//         last_name: formData.last_name.trim(),
//         phone: formData.phone.trim()
//       };

//       console.log("Updating patient with data:", updateData);

//       const response = await fetch(`https://backenddentist-production-12fe.up.railway.app/api/patients/${patient.id}`, {
//         method: "PUT",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updateData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => null);
//         throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       if (data.success) {
//         console.log("Patient updated successfully:", data);
//         if (onPatientUpdated) {
//           onPatientUpdated();
//         }
//         onClose();
//       } else {
//         throw new Error(data.message || "Failed to update patient");
//       }
//     } catch (error) {
//       console.error("Error updating patient:", error);
//       setError(error.message || "An error occurred while updating the patient");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900 flex items-center">
//             <Edit className="w-5 h-5 mr-2 text-blue-600" />
//             Edit Patient
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Current Patient Info */}
//         <div className="p-6 bg-gray-50 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
//               <User className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h3 className="font-medium text-gray-900">Current: {patient.name}</h3>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Phone className="w-3 h-3 mr-1" />
//                 {patient.phone}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {error && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-red-800 text-sm">{error}</p>
//             </div>
//           )}

//           {/* First Name */}
//           <div>
//             <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
//               First Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="first_name"
//               name="first_name"
//               value={formData.first_name}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter first name"
//               required
//             />
//           </div>

//           {/* Last Name */}
//           <div>
//             <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
//               Last Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="last_name"
//               name="last_name"
//               value={formData.last_name}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter last name"
//               required
//             />
//           </div>

//           {/* Phone Number */}
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter phone number"
//                 required
//               />
//               <Phone className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Edit className="w-4 h-4 mr-2" />
//                   Update Patient
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPatient;




"use client";
import React, { useState } from "react";
import { X, Edit, User, Phone } from "lucide-react";

const EditPatient = ({ patient, onClose, onPatientUpdated }) => {
  const [formData, setFormData] = useState({
    first_name: patient.name?.split(" ")[0] || "",
    last_name: patient.name?.split(" ").slice(1).join(" ") || "",
    phone: patient.phone || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setError("Le prénom est requis");
      return false;
    }
    if (!formData.last_name.trim()) {
      setError("Le nom est requis");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Le numéro de téléphone est requis");
      return false;
    }

    // Validation basique du téléphone
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Veuillez entrer un numéro de téléphone valide");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token || token.trim() === "") {
      setError("Aucun jeton d’authentification valide trouvé. Veuillez vous reconnecter.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updateData = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone.trim(),
      };

      const response = await fetch(
        `https://backenddentist-production-12fe.up.railway.app/api/patients/${patient.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Erreur HTTP ! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (onPatientUpdated) {
          onPatientUpdated();
        }
        onClose();
      } else {
        throw new Error(data.message || "Échec de la mise à jour du patient");
      }
    } catch (error) {
      setError(error.message || "Une erreur est survenue lors de la mise à jour du patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Edit className="w-5 h-5 mr-2 text-blue-600" />
            Modifier un patient
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Informations actuelles du patient */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Actuel : {patient.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-3 h-3 mr-1" />
                {patient.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Prénom */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez le prénom"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Entrez le nom"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez le numéro de téléphone"
                required
              />
              <Phone className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Mise à jour...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Terminer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;
