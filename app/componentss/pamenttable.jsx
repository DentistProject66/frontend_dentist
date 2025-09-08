// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Download } from 'lucide-react';

// const PaymentsTable = ({ token }) => {
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
//         // Filter for payments with remaining_balance = "0.00"
//         const fullyPaid = data.data.payments.filter(
//           (payment) => payment.remaining_balance === '0.00'
//         );
//         setPaymentsData(fullyPaid);
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
//     const headers = ['Date', 'Patient', 'Amount Paid', 'Type of Prosthesis'];
//     const csvContent = [
//       headers.join(','),
//       ...filteredData.map((row) =>
//         [
//           row.payment_date,
//           row.patient_name,
//           parseFloat(row.amount_paid).toFixed(2),
//           row.type_of_prosthesis,
//         ].join(',')
//       ),
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'fully-paid-payments.csv';
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
//             placeholder="Search fully paid payments..."
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
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4 text-gray-500">
//                       No fully paid payments found.
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
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Results count */}
//           {filteredData.length > 0 && (
//             <div className="mt-1 text-sm text-gray-600">
//               Showing {filteredData.length} of {paymentsData.length} fully paid payments
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default PaymentsTable;


import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import PaginationComponent from './PaginationComponent'; // Adjust the import path as needed

const PaymentsTable = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch payments data from API
  useEffect(() => {
    if (!token) return;

    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch payments');
        
        // Group payments by consultation_id and filter for fully paid consultations
        const paymentsByConsultation = {};
        data.data.payments.forEach(payment => {
          const consultationId = payment.consultation_id;
          if (!paymentsByConsultation[consultationId]) {
            paymentsByConsultation[consultationId] = {
              consultation_id: consultationId,
              patient_name: payment.patient_name,
              type_of_prosthesis: payment.type_of_prosthesis,
              total_amount_paid: 0,
              payments: [],
              remaining_balance: parseFloat(payment.remaining_balance || 0),
              latest_payment_date: payment.payment_date
            };
          }
          
          paymentsByConsultation[consultationId].total_amount_paid += parseFloat(payment.amount_paid || 0);
          paymentsByConsultation[consultationId].payments.push(payment);
          
          // Update latest payment date and remaining balance
          if (new Date(payment.payment_date) > new Date(paymentsByConsultation[consultationId].latest_payment_date)) {
            paymentsByConsultation[consultationId].latest_payment_date = payment.payment_date;
            paymentsByConsultation[consultationId].remaining_balance = parseFloat(payment.remaining_balance || 0);
          }
        });
        
        // Filter for fully paid consultations (remaining_balance = 0)
        const fullyPaidConsultations = Object.values(paymentsByConsultation).filter(
          consultation => consultation.remaining_balance === 0
        );
        
        setPaymentsData(fullyPaidConsultations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!searchTerm) return paymentsData;
    return paymentsData.filter(
      (row) =>
        row.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.latest_payment_date.includes(searchTerm)
    );
  }, [searchTerm, paymentsData]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Export to CSV
  const handleExport = () => {
    const headers = ['Date', 'Patient', 'Total Amount Paid', 'Type of Prosthesis'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map((row) =>
        [
          row.latest_payment_date,
          row.patient_name,
          row.total_amount_paid.toFixed(2),
          row.type_of_prosthesis,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fully-paid-payments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
            placeholder="Search fully paid payments..."
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
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Last Payment Date</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Patient</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Total Amount Paid</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Type de prothèse</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No fully paid payments found.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((consultation, index) => (
                    <tr key={consultation.consultation_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {new Date(consultation.latest_payment_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">{consultation.patient_name}</td>
                      <td className="py-2 px-4 text-sm text-gray-900">
                        {consultation.total_amount_paid.toFixed(2)} DA
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-900">{consultation.type_of_prosthesis}</td>
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
                {filteredData.length} fully paid consultations
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
    </div>
  );
};

export default PaymentsTable;