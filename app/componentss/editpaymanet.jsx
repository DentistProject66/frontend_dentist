// "use client";
// import React, { useState } from 'react';
// import { X } from 'lucide-react';

// const EditPayment = ({ payment, patientId, onClose, onPaymentUpdated }) => {
//   const [form, setForm] = useState({
//     amountPaid: payment.amount_paid || '',
//     paymentDate: payment.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : '',
//     paymentMethod: payment.payment_method ? payment.payment_method.toLowerCase() : '',
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleInputChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         setError('No valid authentication token found. Please log in.');
//         return;
//       }

//       const response = await fetch(
//         `https://backenddentist-production-12fe.up.railway.app/api/payments/${payment.id}/patient/${patientId}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             patient_id: patientId,
//             amount_paid: parseFloat(form.amountPaid),
//             payment_date: form.paymentDate,
//             payment_method: form.paymentMethod,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok && data.success) {
//         onPaymentUpdated();
//         onClose();
//       } else {
//         setError(data.message || 'Failed to update payment');
//       }
//     } catch (error) {
//       console.error('Error updating payment:', error);
//       setError('Network error. Please check your connection and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Edit Payment</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         {error && <div className="text-red-600 mb-4">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
//             <input
//               type="number"
//               min="0"
//               step="0.01"
//               value={form.amountPaid}
//               onChange={(e) => handleInputChange('amountPaid', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
//             <input
//               type="date"
//               value={form.paymentDate}
//               onChange={(e) => handleInputChange('paymentDate', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div className='hidden'>
//             <label className=" text-sm font-medium text-gray-700 mb-1 hidden">Payment Method</label>
//             <select
//               value={form.paymentMethod}
//               onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select payment method</option>
//               <option value="cash">Cash</option>
//               <option value="check">Check</option>
//               <option value="card">Card</option>
//             </select>
//           </div>
//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Updating...' : 'Update Payment'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPayment;



// "use client";
// import React, { useState } from 'react';
// import { X } from 'lucide-react';

// const EditPayment = ({ payment, patientId, onClose, onPaymentUpdated }) => {
//   const [form, setForm] = useState({
//     amountPaidNow: '',
//     paymentMethod: payment.payment_method ? payment.payment_method.toLowerCase() : 'cash',
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Get today's date in YYYY-MM-DD format
//   const today = new Date().toISOString().split('T')[0];

//   // Original payment details
//   const amountPaidBefore = parseFloat(payment.amount_paid || 0).toFixed(2);
//   const totalPrice = parseFloat(payment.total_price || (parseFloat(payment.amount_paid) + parseFloat(payment.remaining_balance))).toFixed(2);

//   const handleInputChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       setError('No valid authentication token found. Please log in.');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Validate new payment amount
//       const newAmountPaid = parseFloat(form.amountPaidNow);
//       if (isNaN(newAmountPaid) || newAmountPaid <= 0) {
//         setError('Please enter a valid payment amount greater than 0.');
//         setLoading(false);
//         return;
//       }

//       // Fetch current consultation details to get existing amount_paid
//       const consultResponse = await fetch(
//         `https://backenddentist-production-12fe.up.railway.app/api/consultations/${payment.consultation_id}`,
//         {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const consultData = await consultResponse.json();
//       if (!consultResponse.ok || !consultData.success) {
//         throw new Error(consultData.message || `Failed to fetch consultation: HTTP ${consultResponse.status}`);
//       }

//       const currentConsultation = consultData.data;
//       const currentAmountPaid = parseFloat(currentConsultation.amount_paid || 0);
//       const consultationTotalPrice = parseFloat(currentConsultation.total_price || totalPrice);

//       // Calculate new total paid and remaining balance
//       const newTotalPaid = currentAmountPaid + newAmountPaid;
//       const newRemainingBalance = (consultationTotalPrice - newTotalPaid).toFixed(2);

//       // Validate payment doesn't exceed remaining balance
//       if (newAmountPaid > parseFloat(currentConsultation.remaining_balance)) {
//         setError(`Payment amount (${newAmountPaid} DA) exceeds remaining balance (${currentConsultation.remaining_balance} DA).`);
//         setLoading(false);
//         return;
//       }

//       // Create new payment record
//       const newPayment = {
//         consultation_id: payment.consultation_id,
//         patient_id: patientId,
//         patient_name: payment.patient_name,
//         payment_date: today,
//         amount_paid: newAmountPaid.toFixed(2),
//         payment_method: form.paymentMethod,
//       };

//       // Send POST request to create new payment
//       const paymentResponse = await fetch(
//         'https://backenddentist-production-12fe.up.railway.app/api/payments',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(newPayment),
//         }
//       );

//       const paymentData = await paymentResponse.json();
//       if (!paymentResponse.ok || !paymentData.success) {
//         throw new Error(paymentData.message || `Failed to create payment: HTTP ${paymentResponse.status}`);
//       }

//       // Update consultation with new total paid and remaining balance
//       const consultationUpdate = {
//         amount_paid: newTotalPaid.toFixed(2),
//         remaining_balance: newRemainingBalance,
//       };

//       const updateConsultResponse = await fetch(
//         `https://backenddentist-production-12fe.up.railway.app/api/consultations/${payment.consultation_id}`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(consultationUpdate),
//         }
//       );

//       const updateConsultData = await updateConsultResponse.json();
//       if (!updateConsultResponse.ok || !updateConsultData.success) {
//         throw new Error(updateConsultData.message || `Failed to update consultation: HTTP ${updateConsultResponse.status}`);
//       }

//       onPaymentUpdated();
//       onClose();
//     } catch (error) {
//       console.error('Error updating payment:', error);
//       setError(error.message || 'An error occurred while updating the payment.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 max-w-md w-full">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Edit Payment</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         {error && <div className="text-red-600 mb-4">{error}</div>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (Before)</label>
//             <input
//               type="text"
//               value={`${amountPaidBefore} DA`}
//               readOnly
//               className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (Now)</label>
//             <input
//               type="number"
//               min="0.01"
//               step="0.01"
//               value={form.amountPaidNow}
//               onChange={(e) => handleInputChange('amountPaidNow', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               placeholder="Enter new payment amount"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
//             <input
//               type="text"
//               value={`${totalPrice} DA`}
//               readOnly
//               className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date (Today)</label>
//             <input
//               type="text"
//               value={today}
//               readOnly
//               className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
//             <select
//               value={form.paymentMethod}
//               onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               required
//             >
//               <option value="cash">Cash</option>
//               <option value="check">Check</option>
//               <option value="card">Card</option>
//             </select>
//           </div>
//           <div className="flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save Payment'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPayment;




"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditPayment = ({ payment, patientId, onClose, onPaymentUpdated }) => {
  const [form, setForm] = useState({
    amountPaidNow: '',
    paymentMethod: payment.payment_method ? payment.payment_method.toLowerCase() : 'cash',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Date d'aujourd'hui au format AAAA-MM-JJ
  const today = new Date().toISOString().split('T')[0];

  // Détails du paiement original
  const amountPaidBefore = parseFloat(payment.amount_paid || 0).toFixed(2);
  const totalPrice = parseFloat(payment.total_price || (parseFloat(payment.amount_paid) + parseFloat(payment.remaining_balance))).toFixed(2);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Aucun jeton d'authentification valide trouvé. Veuillez vous connecter.");
      setLoading(false);
      return;
    }

    try {
      // Validation du nouveau montant payé
      const newAmountPaid = parseFloat(form.amountPaidNow);
      if (isNaN(newAmountPaid) || newAmountPaid <= 0) {
        setError("Veuillez entrer un montant valide supérieur à 0.");
        setLoading(false);
        return;
      }

      // Récupération des détails de la consultation actuelle
      const consultResponse = await fetch(
        `https://backenddentist-production-12fe.up.railway.app/api/consultations/${payment.consultation_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const consultData = await consultResponse.json();
      if (!consultResponse.ok || !consultData.success) {
        throw new Error(consultData.message || `Échec de récupération de la consultation : HTTP ${consultResponse.status}`);
      }

      const currentConsultation = consultData.data;
      const currentAmountPaid = parseFloat(currentConsultation.amount_paid || 0);
      const consultationTotalPrice = parseFloat(currentConsultation.total_price || totalPrice);

      // Nouveau total payé et solde restant
      const newTotalPaid = currentAmountPaid + newAmountPaid;
      const newRemainingBalance = (consultationTotalPrice - newTotalPaid).toFixed(2);

      // Vérifier que le paiement ne dépasse pas le solde restant
      if (newAmountPaid > parseFloat(currentConsultation.remaining_balance)) {
        setError(`Le montant payé (${newAmountPaid} DA) dépasse le solde restant (${currentConsultation.remaining_balance} DA).`);
        setLoading(false);
        return;
      }

      // Créer un nouvel enregistrement de paiement
      const newPayment = {
        consultation_id: payment.consultation_id,
        patient_id: patientId,
        patient_name: payment.patient_name,
        payment_date: today,
        amount_paid: newAmountPaid.toFixed(2),
        payment_method: form.paymentMethod,
      };

      // Requête POST pour créer le paiement
      const paymentResponse = await fetch(
        'https://backenddentist-production-12fe.up.railway.app/api/payments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPayment),
        }
      );

      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok || !paymentData.success) {
        throw new Error(paymentData.message || `Échec de la création du paiement : HTTP ${paymentResponse.status}`);
      }

      // Mise à jour de la consultation
      const consultationUpdate = {
        amount_paid: newTotalPaid.toFixed(2),
        remaining_balance: newRemainingBalance,
      };

      const updateConsultResponse = await fetch(
        `https://backenddentist-production-12fe.up.railway.app/api/consultations/${payment.consultation_id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(consultationUpdate),
        }
      );

      const updateConsultData = await updateConsultResponse.json();
      if (!updateConsultResponse.ok || !updateConsultData.success) {
        throw new Error(updateConsultData.message || `Échec de mise à jour de la consultation : HTTP ${updateConsultResponse.status}`);
      }

      onPaymentUpdated();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement:', error);
      setError(error.message || "Une erreur est survenue lors de la mise à jour du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Modifier le paiement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé (Avant)</label>
            <input
              type="text"
              value={`${amountPaidBefore} DA`}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé (Maintenant)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amountPaidNow}
              onChange={(e) => handleInputChange('amountPaidNow', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Entrer le nouveau montant"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prix total</label>
            <input
              type="text"
              value={`${totalPrice} DA`}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date du paiement (Aujourd'hui)</label>
            <input
              type="text"
              value={today}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="cash">Espèces</option>
              <option value="check">Chèque</option>
              <option value="card">Carte</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer le paiement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;
