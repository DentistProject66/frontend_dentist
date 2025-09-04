// "use client";
// import React, { useState, useEffect } from 'react';
// import Layout from '../layout/layout';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import { format, isSameDay, isSameWeek, isSameMonth, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
// import ProtectedRoute from "../../lib/ProtectedRoutes"; 

// const AppointmentsPage = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showSlotsModal, setShowSlotsModal] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [dailyStats, setDailyStats] = useState(null);
//   const [token, setToken] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [filter, setFilter] = useState('all');
//   const [editForm, setEditForm] = useState({});
//   const [createForm, setCreateForm] = useState({
//     first_name: '',
//     last_name: '',
//     phone: '',
//     date_of_consultation: format(new Date(), 'yyyy-MM-dd'),
//     type_of_prosthesis: '',
//     total_price: '',
//     amount_paid: '',
//     needs_followup: true,
//     follow_up_date: '',
//     follow_up_time: ''
//   });
//   const [actionLoading, setActionLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Retrieve token
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const storedToken = localStorage.getItem('authToken');
//       setToken(storedToken);
//       if (!storedToken) {
//         setError("Aucun jeton d'authentification trouvé. Veuillez vous reconnecter.");
//         setLoading(false);
//       }
//     }
//   }, []);

//   // Fetch all appointments
//   useEffect(() => {
//     const fetchAppointments = async () => {
//       if (!token) return;
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:5000/api/appointments', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok && data.success) {
//           const transformedAppointments = data.data.appointments.map(apt => ({
//             id: apt.id,
//             patient: apt.patient_full_name,
//             time: formatTime(apt.appointment_time),
//             service: apt.treatment_type || 'Consultation générale',
//             status: apt.status,
//             contact: apt.patient_phone,
//             dentist: `Dr. ${apt.dentist_id}`,
//             date: new Date(apt.appointment_date).toISOString().split('T')[0],
//             treatment: apt.treatment_type || 'Consultation générale',
//             notes: apt.notes || 'Aucune note',
//             raw_date: new Date(apt.appointment_date),
//             patient_name: apt.patient_name,
//             patient_phone: apt.patient_phone,
//             appointment_date: apt.appointment_date,
//             appointment_time: apt.appointment_time
//           }));
//           setAppointments(transformedAppointments);
//           setFilteredAppointments(transformedAppointments);
//         } else {
//           throw new Error(data.message || "Erreur lors de la récupération des rendez-vous");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (token) fetchAppointments();
//   }, [token]);

//   // Fetch daily statistics
//   useEffect(() => {
//     const fetchDailyStats = async () => {
//       if (!token || !selectedDate) return;
//       try {
//         const dateStr = format(selectedDate, 'yyyy-MM-dd');
//         const response = await fetch(`http://localhost:5000/api/appointments/daily?date=${dateStr}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (response.ok && data.success) {
//           setDailyStats(data.data.statistics);
//         }
//       } catch (err) {
//         console.error('Error fetching daily stats:', err);
//       }
//     };
//     if (token) fetchDailyStats();
//   }, [token, selectedDate]);

//   // Filter appointments
//   useEffect(() => {
//     const today = new Date();
//     let filtered = appointments;

//     // Apply time-based filter
//     if (filter === 'today') {
//       filtered = filtered.filter(apt => isSameDay(new Date(apt.raw_date), today));
//     } else if (filter === 'week') {
//       const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
//       const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
//       filtered = filtered.filter(apt => {
//         const aptDate = new Date(apt.raw_date);
//         return aptDate >= startOfCurrentWeek && aptDate <= endOfCurrentWeek;
//       });
//     } else if (filter === 'month') {
//       const startOfCurrentMonth = startOfMonth(today);
//       const endOfCurrentMonth = endOfMonth(today);
//       filtered = filtered.filter(apt => {
//         const aptDate = new Date(apt.raw_date);
//         return aptDate >= startOfCurrentMonth && aptDate <= endOfCurrentMonth;
//       });
//     }

//     // Apply search by name
//     if (searchTerm) {
//       filtered = filtered.filter(apt => 
//         apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredAppointments(filtered);
//   }, [filter, appointments, searchTerm]);

//   // Format time
//   const formatTime = (timeString) => {
//     const [hours, minutes] = timeString.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
//     return `${displayHour}:${minutes} ${ampm}`;
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
//       case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // API Functions
//   const updateAppointment = async (appointmentId, updateData) => {
//     try {
//       setActionLoading(true);
//       const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(updateData)
//       });
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setAppointments(prev => prev.map(apt => 
//           apt.id === appointmentId ? { ...apt, ...updateData } : apt
//         ));
//         setFilteredAppointments(prev => prev.map(apt => 
//           apt.id === appointmentId ? { ...apt, ...updateData } : apt
//         ));
//         return true;
//       } else {
//         throw new Error(data.message || 'Erreur lors de la mise à jour');
//       }
//     } catch (err) {
//       setError(err.message);
//       return false;
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       setActionLoading(true);
//       const response = await fetch(`http://localhost:5000/api/appointments/cancel/${appointmentId}`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
//         setFilteredAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
//         closeModal();
//         return true;
//       } else {
//         throw new Error(data.message || 'Erreur lors de l\'annulation');
//       }
//     } catch (err) {
//       setError(err.message);
//       return false;
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const completeAppointment = async (appointmentId) => {
//     try {
//       setActionLoading(true);
//       const response = await fetch(`http://localhost:5000/api/appointments/complete/${appointmentId}`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setAppointments(prev => prev.map(apt => 
//           apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
//         ));
//         setFilteredAppointments(prev => prev.map(apt => 
//           apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
//         ));
//         closeModal();
//         return true;
//       } else {
//         throw new Error(data.message || 'Erreur lors du marquage comme terminé');
//       }
//     } catch (err) {
//       setError(err.message);
//       return false;
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const confirmAppointment = async (appointmentId) => {
//     return await updateAppointment(appointmentId, { status: 'confirmed' });
//   };

//   const createAppointment = async (appointmentData) => {
//     try {
//       setActionLoading(true);
//       const response = await fetch('http://localhost:5000/api/consultations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           ...appointmentData,
//           needs_followup: true
//         })
//       });
//       const data = await response.json();
//       if (response.ok && data.success) {
//         // Refresh appointments list
//         const appointmentsResponse = await fetch('http://localhost:5000/api/appointments', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const appointmentsData = await appointmentsResponse.json();
//         if (appointmentsResponse.ok && appointmentsData.success) {
//           const transformedAppointments = appointmentsData.data.appointments.map(apt => ({
//             id: apt.id,
//             patient: apt.patient_full_name,
//             time: formatTime(apt.appointment_time),
//             service: apt.treatment_type || 'Consultation générale',
//             status: apt.status,
//             contact: apt.patient_phone,
//             dentist: `Dr. ${apt.dentist_id}`,
//             date: new Date(apt.appointment_date).toISOString().split('T')[0],
//             treatment: apt.treatment_type || 'Consultation générale',
//             notes: apt.notes || 'Aucune note',
//             raw_date: new Date(apt.appointment_date),
//             patient_name: apt.patient_name,
//             patient_phone: apt.patient_phone,
//             appointment_date: apt.appointment_date,
//             appointment_time: apt.appointment_time
//           }));
//           setAppointments(transformedAppointments);
//           setFilteredAppointments(transformedAppointments);
//         }
//         return true;
//       } else {
//         throw new Error(data.message || 'Erreur lors de la création du rendez-vous');
//       }
//     } catch (err) {
//       setError(err.message);
//       return false;
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const fetchAvailableSlots = async (date) => {
//     try {
//       const dateStr = format(date, 'yyyy-MM-dd');
//       const response = await fetch(`http://localhost:5000/api/appointments/slots/${dateStr}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setAvailableSlots(data.data);
//         setShowSlotsModal(true);
//       } else {
//         throw new Error(data.message || 'Erreur lors de la récupération des créneaux');
//       }
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   // Event Handlers
//   const handleAppointmentClick = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowModal(true);
//   };

//   const handleEditClick = (appointment) => {
//     setSelectedAppointment(appointment);
//     setEditForm({
//       appointment_date: appointment.appointment_date,
//       appointment_time: appointment.appointment_time.substring(0, 5),
//       patient_name: appointment.patient_name,
//       patient_phone: appointment.patient_phone,
//       treatment_type: appointment.treatment,
//       notes: appointment.notes,
//       status: appointment.status
//     });
//     setShowEditModal(true);
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedAppointment) {
//       const success = await updateAppointment(selectedAppointment.id, editForm);
//       if (success) {
//         setShowEditModal(false);
//         setSelectedAppointment(null);
//         setEditForm({});
//       }
//     }
//   };

//   const handleCreateSubmit = async (e) => {
//     e.preventDefault();
//     const success = await createAppointment(createForm);
//     if (success) {
//       setShowCreateModal(false);
//       setCreateForm({
//         first_name: '',
//         last_name: '',
//         phone: '',
//         date_of_consultation: format(new Date(), 'yyyy-MM-dd'),
//         type_of_prosthesis: '',
//         total_price: '',
//         amount_paid: '',
//         needs_followup: true,
//         follow_up_date: '',
//         follow_up_time: ''
//       });
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedAppointment(null);
//   };

//   const closeEditModal = () => {
//     setShowEditModal(false);
//     setSelectedAppointment(null);
//     setEditForm({});
//   };

//   const closeCreateModal = () => {
//     setShowCreateModal(false);
//     setCreateForm({
//       first_name: '',
//       last_name: '',
//       phone: '',
//       date_of_consultation: format(new Date(), 'yyyy-MM-dd'),
//       type_of_prosthesis: '',
//       total_price: '',
//       amount_paid: '',
//       needs_followup: true,
//       follow_up_date: '',
//       follow_up_time: ''
//     });
//   };

//   const closeSlotsModal = () => {
//     setShowSlotsModal(false);
//     setAvailableSlots([]);
//   };

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//     setFilter('all');
//   };

//   const clearSearch = () => {
//     setSearchTerm('');
//   };

//   const tileContent = ({ date, view }) => {
//     if (view === 'month') {
//       const hasAppointments = appointments.some(apt => isSameDay(new Date(apt.raw_date), date));
//       return hasAppointments ? <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div> : null;
//     }
//     return null;
//   };

//   return (
//     <Layout>
//       <div className="w-full min-h-screen bg-white flex flex-col p-8 md:p-8 overflow-x-hidden">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold py-4 text-gray-900">Gestion des Rendez-vous</h1>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Créer Rendez-vous
//             </button>
//             <button
//               onClick={() => fetchAvailableSlots(selectedDate)}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Voir créneaux disponibles
//             </button>
//           </div>
//         </div>

//         {/* Error display */}
//         {error && (
//           <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
//             {error}
//             <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
//           </div>
//         )}

//         {/* Search and Filters */}
//         <div className="">
//           <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher par nom</label>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Saisir le nom du patient..."
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex gap-2">
//               {['all', 'today', 'week', 'month'].map(f => (
//                 <button
//                   key={f}
//                   onClick={() => setFilter(f)}
//                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                   }`}
//                 >
//                   {f === 'all' ? 'Tous' : f === 'today' ? "Aujourd'hui" : f === 'week' ? 'Cette Semaine' : 'Ce Mois'}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Daily Statistics */}
//         {dailyStats && (
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <p className="text-sm text-gray-600">Total</p>
//               <p className="text-2xl font-bold text-blue-600">{dailyStats.total_appointments}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <p className="text-sm text-gray-600">Confirmés</p>
//               <p className="text-2xl font-bold text-green-600">{dailyStats.confirmed}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <p className="text-sm text-gray-600">En attente</p>
//               <p className="text-2xl font-bold text-yellow-600">{dailyStats.pending}</p>
//             </div>
//             <div className="bg-white p-4 rounded-lg shadow-md">
//               <p className="text-sm text-gray-600">Terminés</p>
//               <p className="text-2xl font-bold text-blue-600">{dailyStats.completed}</p>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Calendar */}
//           <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md border p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendrier</h2>
//             <Calendar
//               onChange={handleDateChange}
//               value={selectedDate}
//               tileContent={tileContent}
//               className="border-none w-full"
//             />
//           </div>

//           {/* Appointment list */}
//           <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md border p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">
//               {(searchTerm) ? 
//                 `Résultats de recherche (${filteredAppointments.length})` : 
//                 `Rendez-vous pour ${format(selectedDate, 'dd MMMM yyyy')}`
//               }
//             </h2>
//             {loading ? (
//               <p className="text-center text-gray-500">Chargement...</p>
//             ) : filteredAppointments.length === 0 ? (
//               <p className="text-center text-gray-500">
//                 {(searchTerm) ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous'}
//               </p>
//             ) : (
//               <div className="space-y-4 max-h-80 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f7fafc' }}>
//                 {((searchTerm) ? 
//                   filteredAppointments : 
//                   filteredAppointments.filter(apt => isSameDay(new Date(apt.raw_date), selectedDate))
//                 ).map((appointment) => (
//                   <div
//                     key={appointment.id}
//                     className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                       <div onClick={() => handleAppointmentClick(appointment)} className="cursor-pointer flex-1">
//                         <p className="font-medium">{appointment.patient}</p>
//                         <p className="text-sm text-gray-600">
//                           {appointment.time} • {appointment.service}
//                           {(searchTerm) && (
//                             <span className="ml-2 text-blue-600">• {appointment.date}</span>
//                           )}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
//                           {appointment.status}
//                         </span>
//                         <div className="flex gap-1">
//                           {appointment.status === 'pending' && (
//                             <button
//                               onClick={() => confirmAppointment(appointment.id)}
//                               disabled={actionLoading}
//                               className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
//                             >
//                               Confirmer
//                             </button>
//                           )}
//                           {['pending', 'confirmed'].includes(appointment.status) && (
//                             <button
//                               onClick={() => completeAppointment(appointment.id)}
//                               disabled={actionLoading}
//                               className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
//                             >
//                               Terminer
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleEditClick(appointment)}
//                             className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
//                           >
//                             Modifier
//                           </button>
//                           <button
//                             onClick={() => cancelAppointment(appointment.id)}
//                             disabled={actionLoading}
//                             className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
//                           >
//                             Annuler
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Create Appointment Modal */}
//         {showCreateModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Créer un Nouveau Rendez-vous</h3>
//                 <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//               </div>
//               <form onSubmit={handleCreateSubmit} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
//                     <input
//                       type="text"
//                       required
//                       value={createForm.first_name}
//                       onChange={(e) => setCreateForm({...createForm, first_name: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
//                     <input
//                       type="text"
//                       required
//                       value={createForm.last_name}
//                       onChange={(e) => setCreateForm({...createForm, last_name: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
//                     <input
//                       type="tel"
//                       required
//                       value={createForm.phone}
//                       onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date de consultation *</label>
//                     <input
//                       type="date"
//                       required
//                       value={createForm.date_of_consultation}
//                       onChange={(e) => setCreateForm({...createForm, date_of_consultation: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Type de prothèse *</label>
//                   <select
//                     required
//                     value={createForm.type_of_prosthesis}
//                     onChange={(e) => setCreateForm({...createForm, type_of_prosthesis: e.target.value})}
//                     className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Sélectionner le type</option>
//                     <option value="Crown">Couronne</option>
//                     <option value="Bridge">Bridge</option>
//                     <option value="Denture">Dentier</option>
//                     <option value="Implant">Implant</option>
//                     <option value="Veneer">Facette</option>
//                     <option value="Other">Autre</option>
//                   </select>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Prix total *</label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       value={createForm.total_price}
//                       onChange={(e) => setCreateForm({...createForm, total_price: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé *</label>
//                     <input
//                       type="number"
//                       required
//                       min="0"
//                       step="0.01"
//                       value={createForm.amount_paid}
//                       onChange={(e) => setCreateForm({...createForm, amount_paid: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date de suivi</label>
//                     <input
//                       type="date"
//                       value={createForm.follow_up_date}
//                       onChange={(e) => setCreateForm({...createForm, follow_up_date: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Heure de suivi</label>
//                     <input
//                       type="time"
//                       value={createForm.follow_up_time}
//                       onChange={(e) => setCreateForm({...createForm, follow_up_time: e.target.value})}
//                       className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-6">
//                   <button
//                     type="button"
//                     onClick={closeCreateModal}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={actionLoading}
//                     className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
//                   >
//                     {actionLoading ? 'Création...' : 'Créer le Rendez-vous'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Details Modal */}
//         {showModal && selectedAppointment && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Détails du Rendez-vous</h3>
//                 <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//               </div>
//               <div className="space-y-2 text-sm text-gray-700">
//                 <p><strong>Patient:</strong> {selectedAppointment.patient}</p>
//                 <p><strong>Contact:</strong> {selectedAppointment.contact}</p>
//                 <p><strong>Dentiste:</strong> {selectedAppointment.dentist}</p>
//                 <p><strong>Date:</strong> {selectedAppointment.date}</p>
//                 <p><strong>Heure:</strong> {selectedAppointment.time}</p>
//                 <p><strong>Traitement:</strong> {selectedAppointment.treatment}</p>
//                 <p><strong>Statut:</strong> {selectedAppointment.status}</p>
//                 <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
//               </div>
//               <div className="mt-4 flex justify-end">
//                 <button
//                   onClick={closeModal}
//                   className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
//                 >
//                   Fermer
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {showEditModal && selectedAppointment && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Modifier le Rendez-vous</h3>
//                 <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//               </div>
//               <form onSubmit={handleEditSubmit} className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
//                     <input
//                       type="date"
//                       value={editForm.appointment_date || ''}
//                       onChange={(e) => setEditForm({...editForm, appointment_date: e.target.value})}
//                       className="w-full p-2 border rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
//                     <input
//                       type="time"
//                       value={editForm.appointment_time || ''}
//                       onChange={(e) => setEditForm({...editForm, appointment_time: e.target.value})}
//                       className="w-full p-2 border rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Nom du patient</label>
//                     <input
//                       type="text"
//                       value={editForm.patient_name || ''}
//                       onChange={(e) => setEditForm({...editForm, patient_name: e.target.value})}
//                       className="w-full p-2 border rounded-md"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
//                     <input
//                       type="tel"
//                       value={editForm.patient_phone || ''}
//                       onChange={(e) => setEditForm({...editForm, patient_phone: e.target.value})}
//                       className="w-full p-2 border rounded-md"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Type de traitement</label>
//                   <input
//                     type="text"
//                     value={editForm.treatment_type || ''}
//                     onChange={(e) => setEditForm({...editForm, treatment_type: e.target.value})}
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
//                   <select
//                     value={editForm.status || ''}
//                     onChange={(e) => setEditForm({...editForm, status: e.target.value})}
//                     className="w-full p-2 border rounded-md"
//                   >
//                     <option value="pending">En attente</option>
//                     <option value="confirmed">Confirmé</option>
//                     <option value="completed">Terminé</option>
//                     <option value="cancelled">Annulé</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//                   <textarea
//                     value={editForm.notes || ''}
//                     onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
//                     rows={2}
//                     className="w-full p-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="flex justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={closeEditModal}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
//                   >
//                     Annuler
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={actionLoading}
//                     className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
//                   >
//                     {actionLoading ? 'Enregistrement...' : 'Enregistrer'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Available Slots Modal */}
//         {showSlotsModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Créneaux pour {format(selectedDate, 'dd MMMM yyyy')}
//                 </h3>
//                 <button onClick={closeSlotsModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium text-green-700 mb-2">Créneaux disponibles</h4>
//                   <div className="grid grid-cols-3 gap-2">
//                     {availableSlots.available_slots?.map(slot => (
//                       <div key={slot} className="p-2 bg-green-100 text-green-800 rounded text-center text-sm">
//                         {slot}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="font-medium text-red-700 mb-2">Créneaux réservés</h4>
//                   <div className="grid grid-cols-3 gap-2">
//                     {availableSlots.booked_slots?.map(slot => (
//                       <div key={slot} className="p-2 bg-red-100 text-red-800 rounded text-center text-sm">
//                         {slot}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-4 flex justify-end">
//                 <button
//                   onClick={closeSlotsModal}
//                   className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
//                 >
//                   Fermer
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default ProtectedRoute(AppointmentsPage, ["dentist", "assistant"]);




"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../layout/layout';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay, isSameWeek, isSameMonth, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import ProtectedRoute from "../../lib/ProtectedRoutes"; 

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSlotsModal, setShowSlotsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [dailyStats, setDailyStats] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  const [editForm, setEditForm] = useState({});
  const [createForm, setCreateForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_consultation: format(new Date(), 'yyyy-MM-dd'),
    type_of_prosthesis: '',
    total_price: '',
    amount_paid: '',
    needs_followup: true,
    follow_up_date: '',
    follow_up_time: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Retrieve token
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      setToken(storedToken);
      if (!storedToken) {
        setError("Aucun jeton d'authentification trouvé. Veuillez vous reconnecter.");
        setLoading(false);
      }
    }
  }, []);

  // Fetch all appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const transformedAppointments = data.data.appointments.map(apt => ({
            id: apt.id,
            patient: apt.patient_full_name,
            time: formatTime(apt.appointment_time),
            service: apt.treatment_type || 'Consultation générale',
            status: apt.status,
            contact: apt.patient_phone,
            dentist: `Dr. ${apt.dentist_id}`,
            date: new Date(apt.appointment_date).toISOString().split('T')[0],
            treatment: apt.treatment_type || 'Consultation générale',
            notes: apt.notes || 'Aucune note',
            raw_date: new Date(apt.appointment_date),
            patient_name: apt.patient_name,
            patient_phone: apt.patient_phone,
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time
          }));
          setAppointments(transformedAppointments);
          setFilteredAppointments(transformedAppointments);
        } else {
          throw new Error(data.message || "Erreur lors de la récupération des rendez-vous");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAppointments();
  }, [token]);

  // Fetch daily statistics
  useEffect(() => {
    const fetchDailyStats = async () => {
      if (!token || !selectedDate) return;
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`http://localhost:5000/api/appointments/daily?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setDailyStats(data.data.statistics);
        }
      } catch (err) {
        console.error('Error fetching daily stats:', err);
      }
    };
    if (token) fetchDailyStats();
  }, [token, selectedDate]);

  // Filter appointments
  useEffect(() => {
    const today = new Date();
    let filtered = appointments;

    // Apply time-based filter
    if (filter === 'today') {
      filtered = filtered.filter(apt => isSameDay(new Date(apt.raw_date), today));
    } else if (filter === 'week') {
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
      const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.raw_date);
        return aptDate >= startOfCurrentWeek && aptDate <= endOfCurrentWeek;
      });
    } else if (filter === 'month') {
      const startOfCurrentMonth = startOfMonth(today);
      const endOfCurrentMonth = endOfMonth(today);
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.raw_date);
        return aptDate >= startOfCurrentMonth && aptDate <= endOfCurrentMonth;
      });
    }

    // Apply search by name
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  }, [filter, appointments, searchTerm]);

  // Format time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // API Functions
  const updateAppointment = async (appointmentId, updateData) => {
    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, ...updateData } : apt
        ));
        setFilteredAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, ...updateData } : apt
        ));
        return true;
      } else {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:5000/api/appointments/cancel/${appointmentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        setFilteredAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
        closeModal();
        return true;
      } else {
        throw new Error(data.message || 'Erreur lors de l\'annulation');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:5000/api/appointments/complete/${appointmentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
        ));
        setFilteredAppointments(prev => prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: 'completed' } : apt
        ));
        closeModal();
        return true;
      } else {
        throw new Error(data.message || 'Erreur lors du marquage comme terminé');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId) => {
    return await updateAppointment(appointmentId, { status: 'confirmed' });
  };

  const createAppointment = async (appointmentData) => {
    try {
      setActionLoading(true);
      const response = await fetch('http://localhost:5000/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...appointmentData,
          needs_followup: true
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Refresh appointments list
        const appointmentsResponse = await fetch('http://localhost:5000/api/appointments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const appointmentsData = await appointmentsResponse.json();
        if (appointmentsResponse.ok && appointmentsData.success) {
          const transformedAppointments = appointmentsData.data.appointments.map(apt => ({
            id: apt.id,
            patient: apt.patient_full_name,
            time: formatTime(apt.appointment_time),
            service: apt.treatment_type || 'Consultation générale',
            status: apt.status,
            contact: apt.patient_phone,
            dentist: `Dr. ${apt.dentist_id}`,
            date: new Date(apt.appointment_date).toISOString().split('T')[0],
            treatment: apt.treatment_type || 'Consultation générale',
            notes: apt.notes || 'Aucune note',
            raw_date: new Date(apt.appointment_date),
            patient_name: apt.patient_name,
            patient_phone: apt.patient_phone,
            appointment_date: apt.appointment_date,
            appointment_time: apt.appointment_time
          }));
          setAppointments(transformedAppointments);
          setFilteredAppointments(transformedAppointments);
        }
        return true;
      } else {
        throw new Error(data.message || 'Erreur lors de la création du rendez-vous');
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const response = await fetch(`http://localhost:5000/api/appointments/slots/${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAvailableSlots(data.data);
        setShowSlotsModal(true);
      } else {
        throw new Error(data.message || 'Erreur lors de la récupération des créneaux');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Event Handlers
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setEditForm({
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time.substring(0, 5),
      patient_name: appointment.patient_name,
      patient_phone: appointment.patient_phone,
      treatment_type: appointment.treatment,
      notes: appointment.notes,
      status: appointment.status
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedAppointment) {
      const success = await updateAppointment(selectedAppointment.id, editForm);
      if (success) {
        setShowEditModal(false);
        setSelectedAppointment(null);
        setEditForm({});
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const success = await createAppointment(createForm);
    if (success) {
      setShowCreateModal(false);
      setCreateForm({
        first_name: '',
        last_name: '',
        phone: '',
        date_of_consultation: format(new Date(), 'yyyy-MM-dd'),
        type_of_prosthesis: '',
        total_price: '',
        amount_paid: '',
        needs_followup: true,
        follow_up_date: '',
        follow_up_time: ''
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedAppointment(null);
    setEditForm({});
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm({
      first_name: '',
        last_name: '',
        phone: '',
        date_of_consultation: format(new Date(), 'yyyy-MM-dd'),
        type_of_prosthesis: '',
        total_price: '',
        amount_paid: '',
        needs_followup: true,
        follow_up_date: '',
        follow_up_time: ''
    });
  };

  const closeSlotsModal = () => {
    setShowSlotsModal(false);
    setAvailableSlots([]);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFilter('all');
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasAppointments = appointments.some(apt => isSameDay(new Date(apt.raw_date), date));
      return hasAppointments ? <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div> : null;
    }
    return null;
  };

  return (
    <Layout>
      <div className="w-full min-h-screen bg-white flex flex-col p-8 md:p-8 overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold py-4 text-gray-900">Gestion des Rendez-vous</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Créer Rendez-vous
            </button>
            <button
              onClick={() => fetchAvailableSlots(selectedDate)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir créneaux disponibles
            </button>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-2 font-bold">×</button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="">
          <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher par nom</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Saisir le nom du patient..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'today', 'week', 'month'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {f === 'all' ? 'Tous' : f === 'today' ? "Aujourd'hui" : f === 'week' ? 'Cette Semaine' : 'Ce Mois'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Statistics */}
        {dailyStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-blue-600">{dailyStats.total_appointments}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-green-600">{dailyStats.confirmed}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{dailyStats.pending}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-blue-600">{dailyStats.completed}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          {/* Calendar */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendrier</h2>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              className="border-none w-full"
            />
          </div>

          {/* Appointment list */}
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {(searchTerm) ? 
                `Résultats de recherche (${filteredAppointments.length})` : 
                `Rendez-vous pour ${format(selectedDate, 'dd MMMM yyyy')}`
              }
            </h2>
            {loading ? (
              <p className="text-center text-gray-500">Chargement...</p>
            ) : filteredAppointments.length === 0 ? (
              <p className="text-center text-gray-500">
                {(searchTerm) ? 'Aucun rendez-vous trouvé' : 'Aucun rendez-vous'}
              </p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e0 #f7fafc' }}>
                {((searchTerm) ? 
                  filteredAppointments : 
                  filteredAppointments.filter(apt => isSameDay(new Date(apt.raw_date), selectedDate))
                ).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div onClick={() => handleAppointmentClick(appointment)} className="cursor-pointer flex-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">
                          {appointment.time} • {appointment.service}
                          {(searchTerm) && (
                            <span className="ml-2 text-blue-600">• {appointment.date}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <div className="flex gap-1">
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => confirmAppointment(appointment.id)}
                              disabled={actionLoading}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                              Confirmer
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(appointment.status) && (
                            <button
                              onClick={() => completeAppointment(appointment.id)}
                              disabled={actionLoading}
                              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
                            >
                              Terminer
                            </button>
                          )}
                          <button
                            onClick={() => handleEditClick(appointment)}
                            className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                          >
                            Modifier
                          </button>
                          {['pending', 'confirmed'].includes(appointment.status) && (
                            <button
                              onClick={() => cancelAppointment(appointment.id)}
                              disabled={actionLoading}
                              className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create Appointment Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Créer un Nouveau Rendez-vous</h3>
                <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={createForm.first_name}
                      onChange={(e) => setCreateForm({...createForm, first_name: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      required
                      value={createForm.last_name}
                      onChange={(e) => setCreateForm({...createForm, last_name: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={createForm.phone}
                      onChange={(e) => setCreateForm({...createForm, phone: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de consultation *</label>
                    <input
                      type="date"
                      required
                      value={createForm.date_of_consultation}
                      onChange={(e) => setCreateForm({...createForm, date_of_consultation: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de prothèse *</label>
                  <select
                    required
                    value={createForm.type_of_prosthesis}
                    onChange={(e) => setCreateForm({...createForm, type_of_prosthesis: e.target.value})}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner le type</option>
                    <option value="Crown">Couronne</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Denture">Dentier</option>
                    <option value="Implant">Implant</option>
                    <option value="Veneer">Facette</option>
                    <option value="Other">Autre</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix total *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={createForm.total_price}
                      onChange={(e) => setCreateForm({...createForm, total_price: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant payé *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={createForm.amount_paid}
                      onChange={(e) => setCreateForm({...createForm, amount_paid: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date de suivi</label>
                    <input
                      type="date"
                      value={createForm.follow_up_date}
                      onChange={(e) => setCreateForm({...createForm, follow_up_date: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure de suivi</label>
                    <input
                      type="time"
                      value={createForm.follow_up_time}
                      onChange={(e) => setCreateForm({...createForm, follow_up_time: e.target.value})}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Création...' : 'Créer le Rendez-vous'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Détails du Rendez-vous</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Patient:</strong> {selectedAppointment.patient}</p>
                <p><strong>Contact:</strong> {selectedAppointment.contact}</p>
                <p><strong>Dentiste:</strong> {selectedAppointment.dentist}</p>
                <p><strong>Date:</strong> {selectedAppointment.date}</p>
                <p><strong>Heure:</strong> {selectedAppointment.time}</p>
                <p><strong>Traitement:</strong> {selectedAppointment.treatment}</p>
                <p><strong>Statut:</strong> {selectedAppointment.status}</p>
                <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Modifier le Rendez-vous</h3>
                <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={editForm.appointment_date || ''}
                      onChange={(e) => setEditForm({...editForm, appointment_date: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <input
                      type="time"
                      value={editForm.appointment_time || ''}
                      onChange={(e) => setEditForm({...editForm, appointment_time: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du patient</label>
                    <input
                      type="text"
                      value={editForm.patient_name || ''}
                      onChange={(e) => setEditForm({...editForm, patient_name: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={editForm.patient_phone || ''}
                      onChange={(e) => setEditForm({...editForm, patient_phone: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de traitement</label>
                  <input
                    type="text"
                    value={editForm.treatment_type || ''}
                    onChange={(e) => setEditForm({...editForm, treatment_type: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={editForm.status || ''}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    rows={2}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Available Slots Modal */}
        {showSlotsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Créneaux pour {format(selectedDate, 'dd MMMM yyyy')}
                </h3>
                <button onClick={closeSlotsModal} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Créneaux disponibles</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.available_slots?.map(slot => (
                      <div key={slot} className="p-2 bg-green-100 text-green-800 rounded text-center text-sm">
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Créneaux réservés</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.booked_slots?.map(slot => (
                      <div key={slot} className="p-2 bg-red-100 text-red-800 rounded text-center text-sm">
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeSlotsModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProtectedRoute(AppointmentsPage, ["dentist", "assistant"]);