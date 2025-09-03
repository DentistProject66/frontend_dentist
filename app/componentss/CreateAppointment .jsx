"use client";
import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, User, Phone, FileText } from "lucide-react";

const CreateAppointment = ({ patient, onClose, onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    appointment_date: "",
    appointment_time: "",
    treatment_type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  const treatmentOptions = [
    "Consultation",
    "Crown Follow-up",
    "Root Canal Follow-up",
    "Cleaning",
    "Extraction Follow-up",
    "Filling Follow-up",
    "Implant Follow-up",
    "Orthodontic Follow-up",
    "General Check-up",
    "Emergency",
    "Other"
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00"
  ];

  // Fetch patient details when component mounts
  useEffect(() => {
    const fetchPatientDetails = async () => {
      const token = localStorage.getItem("authToken");
      if (!token || token.trim() === "") {
        setError("No valid authentication token found. Please log in.");
        setIsLoadingDetails(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/patients/${patient.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setPatientDetails(data.data);
          console.log("Patient details loaded:", data.data);
        } else {
          throw new Error(data.message || "Failed to fetch patient details");
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setError(error.message || "An error occurred while fetching patient details.");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchPatientDetails();
  }, [patient.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.appointment_date) {
      setError("Please select an appointment date");
      return false;
    }
    if (!formData.appointment_time) {
      setError("Please select an appointment time");
      return false;
    }
    if (!formData.treatment_type) {
      setError("Please select a treatment type");
      return false;
    }

    // Check if the selected date is in the past
    const selectedDate = new Date(formData.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError("Appointment date cannot be in the past");
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
      setError("No valid authentication token found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Get the most recent consultation_id if available
      const latestConsultationId = patientDetails?.consultations?.[0]?.id || null;

      const appointmentData = {
        patient_id: patient.id,
        consultation_id: latestConsultationId,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        patient_name: patient.name,
        patient_phone: patient.phone,
        treatment_type: formData.treatment_type
      };

      console.log("Creating appointment with data:", appointmentData);

      const response = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log("Appointment created successfully:", data);
        if (onAppointmentCreated) {
          onAppointmentCreated();
        }
        onClose();
      } else {
        throw new Error(data.message || "Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      setError(error.message || "An error occurred while creating the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Create Appointment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Patient Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{patient.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-3 h-3 mr-1" />
                {patient.phone}
              </div>
              {/* Show latest consultation info if available */}
              {!isLoadingDetails && patientDetails?.consultations?.[0] && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Latest: {patientDetails.consultations[0].type_of_prosthesis} 
                  {patientDetails.consultations[0].needs_followup === 1 && " (Follow-up needed)"}
                </div>
              )}
              {!isLoadingDetails && patientDetails?.consultations?.length === 0 && (
                <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  No previous consultations found
                </div>
              )}
              {isLoadingDetails && (
                <div className="mt-2 text-xs text-gray-500">
                  Loading consultation history...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Appointment Date */}
          <div>
            <label htmlFor="appointment_date" className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="appointment_date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleInputChange}
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Appointment Time */}
          <div>
            <label htmlFor="appointment_time" className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Time
            </label>
            <div className="relative">
              <select
                id="appointment_time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                required
              >
                <option value="">Select time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </option>
                ))}
              </select>
              <Clock className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Treatment Type */}
          <div>
            <label htmlFor="treatment_type" className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Type
            </label>
            <div className="relative">
              <select
                id="treatment_type"
                name="treatment_type"
                value={formData.treatment_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                required
              >
                <option value="">Select treatment type</option>
                {treatmentOptions.map((treatment) => (
                  <option key={treatment} value={treatment}>
                    {treatment}
                  </option>
                ))}
              </select>
              <FileText className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Show consultation info for transparency */}
          {!isLoadingDetails && patientDetails?.consultations?.[0] && (
            <div className="">
              
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
           
            <button
              type="submit"
              disabled={isSubmitting || isLoadingDetails}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating...
                </>
              ) : isLoadingDetails ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;