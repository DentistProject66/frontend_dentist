
"use client";
import React from "react";
import PatientCard from "./PatientCard";

const PatientList = ({ patients, onPatientUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full overflow-hidden">
      {patients.map((patient, index) => (
        <PatientCard
          key={patient.id}
          patient={patient}
          index={index}
          onPatientUpdate={onPatientUpdate}
        />
      ))}
    </div>
  );
};

export default PatientList;
