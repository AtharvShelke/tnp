'use client';
import { ArrowRight, X } from 'lucide-react';
import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, name, prn, existingValues, changes, onAccept, onReject }) => {
  if (!isOpen) return null;

  const existingKeys = Object.keys(existingValues);
  const changeKeys = Object.keys(changes);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-hidden="true"
    >
      <div className="relative w-full max-w-2xl p-4 bg-white rounded-lg shadow">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-md text-gray-600">{prn}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 flex justify-center items-center"
          >
            <X />
            <span className="sr-only">Close modal</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="p-2 border rounded-md">
            <p className="text-center font-medium">Existing Data</p>
            {existingKeys.map((key) => (
              <p key={key} className="text-gray-500">
                {key}: {existingValues[key]}
              </p>
            ))}
          </div>
          <div className="p-2 border rounded-md">
            <p className="text-center font-medium">Changes</p>
            {changeKeys.map((key) => (
              <p key={key} className="text-gray-500">
                {key}: {changes[key]}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t">
          <button
            onClick={onAccept}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="px-5 py-2.5 ml-3 text-sm font-medium text-gray-900 bg-white border rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;