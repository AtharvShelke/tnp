"use client";

import React from "react";

export default function TextareaInput({
  label,
  name,
  register,
  errors,
  isRequired = true,
  className = "sm:col-span-2",
}) {
  const errorMessage = errors?.[name]?.message; // Access error message directly if available
  
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900 mb-2"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          {...register(name, { required: isRequired })}
          id={name}
          rows={3}
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
            errorMessage ? 'ring-red-600' : ''
          }`}
          defaultValue=""
        />
        {errorMessage && (
          <span className="text-sm text-red-600">{errorMessage || `${label} is required`}</span>
        )}
      </div>
    </div>
  );
}
