"use client";
import React from "react";

const Modal = ({ isOpen, onClose, title, message, onConfirm, confirmText = "Confirm", cancelText = "Cancel", isError = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className={`text-lg font-semibold ${isError ? "text-red-600" : "text-gray-900"} mb-4`}>{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          {cancelText && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-white font-medium rounded-md hover:opacity-90 transition-opacity ${
                isError ? "bg-red-600" : "bg-[#2E86AB]"
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;