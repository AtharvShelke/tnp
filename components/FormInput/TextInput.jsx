"use client";


export default function TextInput({
  label,
  name,
  isRequired = true,
  register,
  errors,
  type = "text",
  className = "sm:col-span-2",
}) {
  const errorMessage = errors?.[name]?.message; // Directly access error message if available
  
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        {...register(name, { required: isRequired })}
        id={name}
        autoComplete={name}
        placeholder={`Enter ${label}`}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 ${
          errorMessage ? "border-red-600 focus:ring-red-600" : ""
        }`}
      />
      {errorMessage && (
        <span className="text-sm text-red-600">{errorMessage || `${label} is required`}</span>
      )}
    </div>
  );
}
