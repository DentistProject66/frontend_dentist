// "use client";
// import React, { useState, useEffect } from 'react';
// import Layout from '../layout/layout';
// import PaymentsTable from '../componentss/pamenttable';
// import InPaymentTable from '../componentss/inpaymenttable';
// import RevenueReports from '../componentss/rapport';
// import ProtectedRoute from "../../lib/ProtectedRoutes"; 

// const Page = () => {
//   const [change1, setChange1] = useState(true);
//   const [change2, setChange2] = useState(false);
//   const [change3, setChange3] = useState(false);
//   const [summaryData, setSummaryData] = useState({
//     todayRevenue: 0,
//     weekRevenue: 0,
//     monthRevenue: 0,
//     unpaidTotal: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const storedToken = localStorage.getItem('authToken');
//       setToken(storedToken);
//     }
//   }, []);

//   useEffect(() => {
//     if (!token) return;

//     const fetchSummaryData = async () => {
//       try {
//         setLoading(true);
//         const todayRes = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments/reports?period=today', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const todayData = await todayRes.json();
//         if (!todayData.success) throw new Error(todayData.message);

//         const weekRes = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments/reports?period=week', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const weekData = await weekRes.json();
//         if (!weekData.success) throw new Error(weekData.message);

//         const monthRes = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments/reports?period=month', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const monthData = await monthRes.json();
//         if (!monthData.success) throw new Error(monthData.message);

//         const todayRevenue = parseFloat(todayData.data.total_statistics.total_income) || 0;
//         const weekRevenue = parseFloat(weekData.data.total_statistics.total_income) || 0;
//         const monthRevenue = parseFloat(monthData.data.total_statistics.total_income) || 0;
//         const unpaidTotal = monthData.data.outstanding_payments.reduce(
//           (sum, item) => sum + parseFloat(item.remaining_balance),
//           0
//         );

//         setSummaryData({ todayRevenue, weekRevenue, monthRevenue, unpaidTotal });
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummaryData();
//   }, [token]);

//   const changeColorHandler1 = () => {
//     setChange1(true);
//     setChange2(false);
//     setChange3(false);
//   };
//   const changeColorHandler2 = () => {
//     setChange1(false);
//     setChange2(true);
//     setChange3(false);
//   };
//   const changeColorHandler3 = () => {
//     setChange1(false);
//     setChange2(false);
//     setChange3(true);
//   };

//   return (
//     <Layout>
//       <div className={`container flex flex-col  px-24 p-8 gap-8 ${change3 ? 'gap-2 p-8' : 'gap-8'} overflow-x-hidden`}>
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-900">Gestion de Paiement</h1>
//         </div>
//         {loading ? (
//           <div>Loading...</div>
//         ) : error ? (
//           <div className="text-red-500">Error: {error}</div>
//         ) : (
//           <div className="grid grid-cols-1 -m-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
//             <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
//               <h3 className="text-gray-500 text-lg">Les revenus d'aujourd'hui</h3>
//               <h1 className="font-bold text-xl text-blue-500">{summaryData.todayRevenue} Da</h1>
//             </div>
//             <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
//               <h3 className="text-gray-500 text-lg">Les revenus de semaine</h3>
//               <h1 className="font-bold text-xl text-green-500">{summaryData.weekRevenue} Da</h1>
//             </div>
//             <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
//               <h3 className="text-gray-500 text-lg">Les revenus de mois</h3>
//               <h1 className="font-bold text-xl text-green-600">{summaryData.monthRevenue} Da</h1>
//             </div>
//             <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
//               <h3 className="text-gray-500 text-lg">Total des impayés</h3>
//               <h1 className="font-bold text-xl text-red-500">{summaryData.unpaidTotal} Da</h1>
//             </div>
//           </div>
//         )}
//         <div className="w-full h-[1cm] -m-2 grid grid-cols-1 md:grid-cols-3 gap-0">
//           <button
//             onClick={changeColorHandler1}
//             className={`flex rounded-[8px] justify-center text-black items-center ${
//               change1 ? 'bg-blue-500 text-white' : 'bg-white text-black'
//             }`}
//           >
//             <h3>Paiement récent</h3>
//           </button>
//           <button
//             onClick={changeColorHandler2}
//             className={`flex rounded-[8px] justify-center text-black items-center ${
//               change2 ? 'bg-blue-500 text-white' : 'bg-white text-black'
//             }`}
//           >
//             <h3>Paiement impayé</h3>
//           </button>
//           <button
//             onClick={changeColorHandler3}
//             className={`flex rounded-[8px] justify-center  text-black items-center ${
//               change3 ? 'bg-blue-500 text-white' : 'bg-white text-black'
//             }`}
//           >
//             <h3>Rapport</h3>
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           {change1 && <PaymentsTable token={token} />}
//           {change2 && <InPaymentTable token={token} />}
//           {change3 && <RevenueReports token={token} />}
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ProtectedRoute(Page, ["dentist"]);



"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../layout/layout';
import PaymentsTable from '../componentss/pamenttable';
import InPaymentTable from '../componentss/inpaymenttable';
import RevenueReports from '../componentss/rapport';
import ProtectedRoute from "../../lib/ProtectedRoutes"; 

const Page = () => {
  const [change1, setChange1] = useState(true);
  const [change2, setChange2] = useState(false);
  const [change3, setChange3] = useState(false);
  const [summaryData, setSummaryData] = useState({
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    unpaidTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      setToken(storedToken);
    }
  }, []);

  // Function to calculate unpaid total from payments data
  const calculateUnpaidTotal = async (token) => {
    try {
      const response = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to fetch payments');
      
      // Group payments by consultation_id (same logic as InPaymentTable)
      const consultationsByID = {};
      data.data.payments.forEach(payment => {
        const consultationId = payment.consultation_id;
        if (!consultationsByID[consultationId]) {
          consultationsByID[consultationId] = {
            consultation_id: consultationId,
            remaining_balance: parseFloat(payment.remaining_balance || 0),
            latest_payment_date: payment.payment_date
          };
        }
        
        // Update remaining balance with the most recent payment data
        if (new Date(payment.payment_date) > new Date(consultationsByID[consultationId].latest_payment_date)) {
          consultationsByID[consultationId].latest_payment_date = payment.payment_date;
          consultationsByID[consultationId].remaining_balance = parseFloat(payment.remaining_balance || 0);
        }
      });
      
      // Calculate total unpaid amount from unique consultations with remaining balance > 0
      const unpaidTotal = Object.values(consultationsByID)
        .filter(consultation => consultation.remaining_balance > 0)
        .reduce((sum, consultation) => sum + consultation.remaining_balance, 0);
      
      return unpaidTotal;
    } catch (error) {
      console.error('Error calculating unpaid total:', error);
      return 0;
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        
        // Fetch today's revenue
        const todayRes = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments/reports?period=today', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const todayData = await todayRes.json();
        if (!todayData.success) throw new Error(todayData.message);

        // Fetch week's revenue
        const weekRes = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments/reports?period=week', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const weekData = await weekRes.json();
        if (!weekData.success) throw new Error(weekData.message);

        // Fetch month's revenue
        const monthRes = await fetch('https://backenddentist-production-12fe.up.railway.app/api/payments/reports?period=month', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const monthData = await monthRes.json();
        if (!monthData.success) throw new Error(monthData.message);

        // Calculate revenue data
        const todayRevenue = parseFloat(todayData.data.total_statistics.total_income) || 0;
        const weekRevenue = parseFloat(weekData.data.total_statistics.total_income) || 0;
        const monthRevenue = parseFloat(monthData.data.total_statistics.total_income) || 0;
        
        // Calculate unpaid total using the correct method
        const unpaidTotal = await calculateUnpaidTotal(token);

        setSummaryData({ todayRevenue, weekRevenue, monthRevenue, unpaidTotal });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, [token]);

  const changeColorHandler1 = () => {
    setChange1(true);
    setChange2(false);
    setChange3(false);
  };
  const changeColorHandler2 = () => {
    setChange1(false);
    setChange2(true);
    setChange3(false);
  };
  const changeColorHandler3 = () => {
    setChange1(false);
    setChange2(false);
    setChange3(true);
  };

  return (
    <Layout>
      <div className={`container flex flex-col  px-24 p-8 gap-8 ${change3 ? 'gap-2 p-8' : 'gap-8'} overflow-x-hidden`}>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gestion de Paiement</h1>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 -m-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
              <h3 className="text-gray-500 text-lg">Les revenus d'aujourd'hui</h3>
              <h1 className="font-bold text-xl text-blue-500">{summaryData.todayRevenue.toFixed(2)} Da</h1>
            </div>
            <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
              <h3 className="text-gray-500 text-lg">Les revenus de semaine</h3>
              <h1 className="font-bold text-xl text-green-500">{summaryData.weekRevenue.toFixed(2)} Da</h1>
            </div>
            <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
              <h3 className="text-gray-500 text-lg">Les revenus de mois</h3>
              <h1 className="font-bold text-xl text-green-600">{summaryData.monthRevenue.toFixed(2)} Da</h1>
            </div>
            <div className="flex flex-col gap-4 p-2 h-[3cm] bg-white">
              <h3 className="text-gray-500 text-lg">Total des impayés</h3>
              <h1 className="font-bold text-xl text-red-500">{summaryData.unpaidTotal.toFixed(2)} Da</h1>
            </div>
          </div>
        )}
        <div className="w-full h-[1cm] -m-2 grid grid-cols-1 md:grid-cols-3 gap-0">
          <button
            onClick={changeColorHandler1}
            className={`flex rounded-[8px] justify-center text-black items-center ${
              change1 ? 'bg-blue-500 text-white' : 'bg-white text-black'
            }`}
          >
            <h3>Paiement récent</h3>
          </button>
          <button
            onClick={changeColorHandler2}
            className={`flex rounded-[8px] justify-center text-black items-center ${
              change2 ? 'bg-blue-500 text-white' : 'bg-white text-black'
            }`}
          >
            <h3>Paiement impayé</h3>
          </button>
          <button
            onClick={changeColorHandler3}
            className={`flex rounded-[8px] justify-center  text-black items-center ${
              change3 ? 'bg-blue-500 text-white' : 'bg-white text-black'
            }`}
          >
            <h3>Rapport</h3>
          </button>
        </div>
        <div className="overflow-x-auto">
          {change1 && <PaymentsTable token={token} />}
          {change2 && <InPaymentTable token={token} />}
          {change3 && <RevenueReports token={token} />}
        </div>
      </div>
    </Layout>
  );
};

export default ProtectedRoute(Page, ["dentist"]);