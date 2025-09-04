"use client";
import React, { useState } from "react";
import { X, Calendar, CreditCard, FileText, User, Phone, Clock } from "lucide-react";

const ViewDetails = ({ patient, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const formatCurrency = (amount) => {
    if (!amount || amount === "N/A") return "N/A";
    return `$${parseFloat(amount).toFixed(2)}`;
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

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  const InfoRow = ({ icon: Icon, label, value, valueColor = "text-gray-900" }) => (
    <div className="flex items-start space-x-3 py-2">
      {Icon && <Icon className="w-5 h-5 text-gray-400 mt-0.5" />}
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className={`ml-2 text-sm ${valueColor}`}>{value || "N/A"}</span>
      </div>
    </div>
  );

  const ConsultationCard = ({ consultation }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{consultation.treatment}</h4>
          <p className="text-sm text-gray-500">{consultation.date}</p>
        </div>
        {consultation.needsFollowup && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Follow-up Required
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Total:</span>
          <span className="ml-2 font-medium">{formatCurrency(consultation.totalPrice)}</span>
        </div>
        <div>
          <span className="text-gray-600">Paid:</span>
          <span className="ml-2 font-medium">{formatCurrency(consultation.amountPaid)}</span>
        </div>
        <div>
          <span className="text-gray-600">Balance:</span>
          <span
            className={`ml-2 font-medium ${
              parseFloat(consultation.remainingBalance || 0) > 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {formatCurrency(consultation.remainingBalance)}
          </span>
        </div>
        <div>
          <span className="text-gray-600">Receipt:</span>
          <span className="ml-2 font-mono text-xs">{consultation.receiptNumber}</span>
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ appointment }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">{appointment.treatment}</h4>
          <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            appointment.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {appointment.status}
        </span>
      </div>
    </div>
  );

  const PaymentCard = ({ payment }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">Payment on {payment.date}</h4>
          <p className="text-sm text-gray-500">Receipt: {payment.receiptNumber}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Amount Paid:</span>
          <span className="ml-2 font-medium">{formatCurrency(payment.amountPaid)}</span>
        </div>
        <div>
          <span className="text-gray-600">Payment Method:</span>
          <span className="ml-2 font-medium">{payment.paymentMethod}</span>
        </div>
        <div>
          <span className="text-gray-600">Remaining Balance:</span>
          <span
            className={`ml-2 font-medium ${
              parseFloat(payment.remainingBalance || 0) > 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {formatCurrency(payment.remainingBalance)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
              <p className="text-sm text-gray-500">Patient Details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-6 border-b border-gray-200">
          <TabButton
            id="overview"
            label="Overview"
            isActive={activeTab === "overview"}
            onClick={setActiveTab}
          />
          <TabButton
            id="financial"
            label="Financial"
            isActive={activeTab === "financial"}
            onClick={setActiveTab}
          />
          <TabButton
            id="appointments"
            label="Appointments"
            isActive={activeTab === "appointments"}
            onClick={setActiveTab}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <InfoRow icon={User} label="Full Name" value={patient.name} />
                <InfoRow icon={Phone} label="Phone Number" value={patient.phone} />
                <InfoRow icon={Calendar} label="Registered" value={formatDate(patient.createdAt)} />
              </div>

              {/* Latest Treatment */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Treatment Status
                </h3>
                <InfoRow
                  icon={FileText}
                  label="Latest Treatment"
                  value={
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.statusColor}`}
                    >
                      {patient.status}
                    </span>
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Last Consultation"
                  value={formatDate(patient.lastConsult)}
                />
                {patient.nextAppointmentDate && patient.nextAppointmentDate !== "N/A" && (
                  <>
                    <InfoRow
                      icon={Calendar}
                      label="Next Appointment"
                      value={formatDate(patient.nextAppointmentDate)}
                    />
                    <InfoRow
                      icon={Clock}
                      label="Appointment Time"
                      value={formatTime(patient.nextAppointmentTime)}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "financial" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>

              {/* Summary of Total Balance */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Overall Financials</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-medium">{formatCurrency(patient.totalPrice)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Paid:</span>
                    <span className="ml-2 font-medium">{formatCurrency(patient.amountPaid)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Balance:</span>
                    <span
                      className={`ml-2 font-medium ${
                        parseFloat(patient.remainingBalance || 0) > 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {formatCurrency(patient.remainingBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation History */}
              {patient.consultations && patient.consultations.length > 0 ? (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Consultation History</h4>
                  {patient.consultations.map((consultation, index) => (
                    <ConsultationCard key={consultation.id || index} consultation={consultation} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-6">No consultation history available.</p>
              )}

              {/* Payment History */}
              {patient.payments && patient.payments.length > 0 ? (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Payment History</h4>
                  {patient.payments.map((payment, index) => (
                    <PaymentCard key={payment.id || index} payment={payment} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No payment history available.</p>
              )}
            </div>
          )}

          {activeTab === "appointments" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment History</h3>
              {patient.appointments && patient.appointments.length > 0 ? (
                patient.appointments.map((appointment, index) => (
                  <AppointmentCard key={appointment.id || index} appointment={appointment} />
                ))
              ) : (
                <p className="text-sm text-gray-500">No appointments scheduled.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {/* <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            className="px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#2E86AB" }}
          >
            Edit Patient
          </button>
        </div>*/}
      </div> 
    </div>
  );
};

export default ViewDetails;