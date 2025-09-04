"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

const EditPayment = ({ payment, patientId, onClose, onPaymentUpdated }) => {
  const [form, setForm] = useState({
    amountPaid: payment.amount_paid || '',
    paymentDate: payment.payment_date ? new Date(payment.payment_date).toISOString().split('T')[0] : '',
    paymentMethod: payment.payment_method ? payment.payment_method.toLowerCase() : '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No valid authentication token found. Please log in.');
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/payments/${payment.id}/patient/${patientId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            patient_id: patientId,
            amount_paid: parseFloat(form.amountPaid),
            payment_date: form.paymentDate,
            payment_method: form.paymentMethod,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        onPaymentUpdated();
        onClose();
      } else {
        setError(data.message || 'Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amountPaid}
              onChange={(e) => handleInputChange('amountPaid', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
            <input
              type="date"
              value={form.paymentDate}
              onChange={(e) => handleInputChange('paymentDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div className='hidden'>
            <label className=" text-sm font-medium text-gray-700 mb-1 hidden">Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayment;