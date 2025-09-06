// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Download } from 'lucide-react';

// const InPaymentTable = ({ token }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [paymentsData, setPaymentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch payments data from API
//   useEffect(() => {
//     if (!token) return;

//     const fetchPayments = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (!data.success) throw new Error(data.message || 'Failed to fetch payments');
//         // Filter for payments with remaining_balance > "0.00"
//         const unpaid = data.data.payments.filter(
//           (payment) => payment.remaining_balance !== '0.00'
//         );
//         setPaymentsData(unpaid);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [token]);

//   // Filter and search logic
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return paymentsData;
//     return paymentsData.filter(
//       (row) =>
//         row.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.payment_date.includes(searchTerm)
//     );
//   }, [searchTerm, paymentsData]);

//   // Export to CSV
//   const handleExport = () => {
//     const headers = ['Date', 'Patient', 'Amount Paid', 'Type of Prosthesis', 'Remaining Balance'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredData.map((row) =>
//         [
//           row.payment_date,
//           row.patient_name,
//           parseFloat(row.amount_paid).toFixed(2),
//           row.type_of_prosthesis,
//           parseFloat(row.remaining_balance).toFixed(2),
//         ].join(',')
//       ),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'unpaid-payments.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full p-5 max-w-6xl mx-auto">
//       {/* Header with search and export */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
//         {/* Search bar */}
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search unpaid payments..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         {/* Export button */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//             disabled={filteredData.length === 0}
//           >
//             <Download size={16} />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Loading and Error States */}
//       {loading ? (
//         <div className="text-center py-4">Loading...</div>
//       ) : error ? (
//         <div className="text-center py-4 text-red-500">Error: {error}</div>
//       ) : (
//         <>
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Date</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Patient</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Amount Paid</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Type de prothèse</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Impayée</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-4 text-gray-500">
//                       No unpaid payments found.
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((payment, index) => (
//                     <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-2 px-4 text-sm text-gray-900">
//                         {new Date(payment.payment_date).toLocaleDateString()}
//                       </td>
//                       <td className="py-2 px-4 text-sm text-gray-900">{payment.patient_name}</td>
//                       <td className="py-2 px-4 text-sm text-gray-900">
//                         {parseFloat(payment.amount_paid).toFixed(2)} DA
//                       </td>
//                       <td className="py-2 px-4 text-sm text-gray-900">{payment.type_of_prosthesis}</td>
//                       <td className="py-2 px-4 text-sm text-gray-900">
//                         {parseFloat(payment.remaining_balance).toFixed(2)} DA
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Results count */}
//           {filteredData.length > 0 && (
//             <div className="mt-1 text-sm text-gray-600">
//               Showing {filteredData.length} of {paymentsData.length} unpaid payments
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default InPaymentTable;




// "use client";
// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Download } from 'lucide-react';
// import PaginationComponent from './PaginationComponent'; // Adjust the import path as needed

// const InPaymentTable = ({ token }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [paymentsData, setPaymentsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // Fetch payments data from API
//   useEffect(() => {
//     if (!token) return;

//     const fetchPayments = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await response.json();
//         if (!data.success) throw new Error(data.message || 'Failed to fetch payments');
//         // Filter for payments with remaining_balance > "0.00"
//         const unpaid = data.data.payments.filter(
//           (payment) => payment.remaining_balance !== '0.00'
//         );
//         setPaymentsData(unpaid);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, [token]);

//   // Filter and search logic
//   const filteredData = useMemo(() => {
//     if (!searchTerm) return paymentsData;
//     return paymentsData.filter(
//       (row) =>
//         row.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         row.payment_date.includes(searchTerm)
//     );
//   }, [searchTerm, paymentsData]);

//   // Paginate data
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredData.slice(startIndex, endIndex);
//   }, [filteredData, currentPage, itemsPerPage]);

//   // Calculate total pages
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Export to CSV
//   const handleExport = () => {
//     const headers = ['Date', 'Patient', 'Amount Paid', 'Type of Prosthesis', 'Remaining Balance'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredData.map((row) =>
//         [
//           row.payment_date,
//           row.patient_name,
//           parseFloat(row.amount_paid).toFixed(2),
//           row.type_of_prosthesis,
//           parseFloat(row.remaining_balance).toFixed(2),
//         ].join(',')
//       ),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'unpaid-payments.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // Handle page change
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full p-5 max-w-6xl mx-auto">
//       {/* Header with search and export */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
//         {/* Search bar */}
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search unpaid payments..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         {/* Export button */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={handleExport}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
//             disabled={filteredData.length === 0}
//           >
//             <Download size={16} />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Loading and Error States */}
//       {loading ? (
//         <div className="text-center py-4">Loading...</div>
//       ) : error ? (
//         <div className="text-center py-4 text-red-500">Error: {error}</div>
//       ) : (
//         <>
//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Date</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Patient</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Amount Paid</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Type de prothèse</th>
//                   <th className="text-left py-2 px-4 font-medium text-gray-700">Impayée</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.length === 0 ? (
//                   <tr>
//                     <td colSpan="5" className="text-center py-4 text-gray-500">
//                       No unpaid payments found.
//                     </td>
//                   </tr>
//                 ) : (
//                   paginatedData.map((payment, index) => (
//                     <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                       <td className="py-2 px-4 text-sm text-gray-900">
//                         {new Date(payment.payment_date).toLocaleDateString()}
//                       </td>
//                       <td className="py-2 px-4 text-sm text-gray-900">{payment.patient_name}</td>
//                       <td className="py-2 px-4 text-sm text-gray-900">
//                         {parseFloat(payment.amount_paid).toFixed(2)} DA
//                       </td>
//                       <td className="py-2 px-4 text-sm text-gray-900">{payment.type_of_prosthesis}</td>
//                       <td className="py-2 px-4 text-sm text-gray-900">
//                         {parseFloat(payment.remaining_balance).toFixed(2)} DA
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Results count and pagination */}
//           <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {filteredData.length > 0 && (
//               <div className="text-sm text-gray-600">
//                 Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
//                 {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
//                 {filteredData.length} unpaid payments
//               </div>
//             )}
//             {totalPages > 1 && (
//               <PaginationComponent
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default InPaymentTable;





"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Edit } from 'lucide-react';
import PaginationComponent from './PaginationComponent'; 
import EditPayment from './editpaymanet'; 

const InPaymentTable = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const itemsPerPage = 5;

  // Fetch payments data from API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch payments');
      // Filter for payments with remaining_balance > "0.00"
      const unpaid = data.data.payments.filter(
        (payment) => payment.remaining_balance !== '0.00'
      );
      setPaymentsData(unpaid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return paymentsData;
    return paymentsData.filter(
      (row) =>
        row.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.payment_date.includes(searchTerm)
    );
  }, [searchTerm, paymentsData]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Export to CSV
  const handleExport = () => {
    const headers = ['Date', 'Patient', 'Amount Paid', 'Type of Prosthesis', 'Remaining Balance'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row) =>
        [
          row.payment_date,
          row.patient_name,
          parseFloat(row.amount_paid).toFixed(2),
          row.type_of_prosthesis,
          parseFloat(row.remaining_balance).toFixed(2),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unpaid-payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle edit payment
  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  // Handle payment update
  const handlePaymentUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedPayment(null);
    fetchPayments(); // Refresh the table data
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full p-5 max-w-6xl mx-auto">
      {/* Header with search and export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search unpaid payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Export button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            disabled={filteredData.length === 0}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Amount Paid</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Type de prothèse</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Impayée</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No unpaid payments found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">{payment.patient_name}</td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {parseFloat(payment.amount_paid).toFixed(2)} DA
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">{payment.type_of_prosthesis}</td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {parseFloat(payment.remaining_balance).toFixed(2)} DA
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Payment"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results count and pagination */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {filteredData.length > 0 && (
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{' '}
                {filteredData.length} unpaid payments
              </div>
            )}
            {totalPages > 1 && (
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </>
      )}

      {/* Edit Payment Modal */}
      {isEditModalOpen && selectedPayment && (
        <EditPayment
          payment={selectedPayment}
          patientId={selectedPayment.patient_id}
          onClose={() => setIsEditModalOpen(false)}
          onPaymentUpdated={handlePaymentUpdated}
        />
      )}
    </div>
  );
};

export default InPaymentTable;