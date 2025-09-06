import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PaymentCurveChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: '2025-08-01',
    to: '2025-08-31',
  });

  // Get token from localStorage
  const getToken = () => {
    try {
      return localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('access_token');
    } catch (e) {
      console.error('Error getting token from localStorage:', e);
      return null;
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  // Fetch payment data from reports API
  useEffect(() => {
    const fetchPaymentCurveData = async () => {
      const token = getToken();
      if (!token) {
        setError('No authentication token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://backenddentist-production-12fe.up.railway.app/api/payments/reports?date_from=${dateRange.from}&date_to=${dateRange.to}`,
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch payment data');

        // Process daily_income data from reports API
        const dailyIncomeData = data.data.daily_income || [];
        
        // Create a map of existing daily income data
        const dailyIncomeMap = {};
        dailyIncomeData.forEach((item) => {
          const date = item.payment_date.split('T')[0]; // Get YYYY-MM-DD format
          dailyIncomeMap[date] = {
            date: date,
            totalAmount: parseFloat(item.daily_income) || 0,
            paymentCount: parseInt(item.payment_count) || 0
          };
        });

        // Fill missing dates with 0 values for complete timeline
        const startDate = new Date(dateRange.from);
        const endDate = new Date(dateRange.to);
        const processedData = [];

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          const dateString = date.toISOString().split('T')[0];
          const dayData = dailyIncomeMap[dateString] || {
            date: dateString,
            totalAmount: 0,
            paymentCount: 0
          };
          
          processedData.push(dayData);
        }

        setChartData(processedData);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentCurveData();
  }, [dateRange]);

  // Handle date range changes
  const handleFromDateChange = (e) => {
    setDateRange({ ...dateRange, from: e.target.value });
  };

  const handleToDateChange = (e) => {
    setDateRange({ ...dateRange, to: e.target.value });
  };

  // Export to Excel
  const handleExportExcel = () => {
    const excelData = chartData.map((item) => ({
      Date: item.date,
      'Daily Revenue (DA)': item.totalAmount,
      'Number of Payments': item.paymentCount,
      'Average Payment (DA)': item.paymentCount > 0 ? (item.totalAmount / item.paymentCount).toFixed(2) : 0
    }));

    const totalRevenue = chartData.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalPayments = chartData.reduce((sum, item) => sum + item.paymentCount, 0);
    const activeDays = chartData.filter(item => item.totalAmount > 0).length;

    excelData.push({
      Date: 'SUMMARY',
      'Daily Revenue (DA)': '',
      'Number of Payments': '',
      'Average Payment (DA)': ''
    });

    excelData.push({
      Date: 'Total Revenue',
      'Daily Revenue (DA)': totalRevenue,
      'Number of Payments': totalPayments,
      'Average Payment (DA)': totalPayments > 0 ? (totalRevenue / totalPayments).toFixed(2) : 0
    });

    excelData.push({
      Date: 'Daily Average',
      'Daily Revenue (DA)': activeDays > 0 ? (totalRevenue / activeDays).toFixed(2) : 0,
      'Number of Payments': activeDays > 0 ? (totalPayments / activeDays).toFixed(2) : 0,
      'Average Payment (DA)': ''
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Payment Curve');

    const metadata = [
      { Property: 'Report Title', Value: 'Payment Curve Analysis' },
      { Property: 'Description', Value: 'Daily payment trends over selected period' },
      { Property: 'Date From', Value: dateRange.from },
      { Property: 'Date To', Value: dateRange.to },
      { Property: 'Generated On', Value: new Date().toLocaleDateString() },
      { Property: 'Total Days', Value: chartData.length },
      { Property: 'Active Days', Value: activeDays },
      { Property: 'Total Revenue', Value: `${totalRevenue.toLocaleString()} DA` },
    ];

    const metaWs = XLSX.utils.json_to_sheet(metadata);
    metaWs['!cols'] = [{ wch: 20 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, metaWs, 'Report Info');

    XLSX.writeFile(wb, 'payment-curve-report.xlsx');
  };

  // Chart.js data configuration
  const chartConfig = {
    labels: chartData.map((item) => formatDateForDisplay(item.date)),
    datasets: [
      {
        label: 'Daily Revenue (DA)',
        data: chartData.map((item) => item.totalAmount),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#666',
        },
        ticks: {
          color: '#666',
          maxTicksLimit: 15, // Limit number of x-axis labels
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (DA)',
          color: '#666',
        },
        ticks: {
          color: '#666',
          callback: (value) => `${value.toLocaleString()} DA`,
        },
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#666',
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            return chartData[dataIndex].date;
          },
          afterBody: function(context) {
            const dataIndex = context[0].dataIndex;
            const item = chartData[dataIndex];
            return [
              `Payments: ${item.paymentCount}`,
              `Average: ${item.paymentCount > 0 ? (item.totalAmount / item.paymentCount).toLocaleString() : 0} DA`
            ];
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-[90%] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Payment Curve Analysis</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={dateRange.from}
              onChange={handleFromDateChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={handleToDateChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            disabled={chartData.length === 0}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className="h-[8cm] w-full">
            <Line data={chartConfig} options={chartOptions} />
          </div>
          {chartData.length > 0 ? (
            <div className="mt-1 text-sm text-gray-600 flex justify-between">
              <span>
                Showing {chartData.length} days | Total: {chartData.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()} DA
              </span>
              <span>
                {chartData.reduce((sum, item) => sum + item.paymentCount, 0)} payments total
              </span>
            </div>
          ) : (
            <div className="mt-1 text-sm text-gray-600">
              No payment data available for the selected period
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentCurveChart;