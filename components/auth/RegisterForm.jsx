'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInput from '../FormInput/TextInput';
import toast from 'react-hot-toast';
import SelectInput from '../FormInput/SelectInput';
import ImageInput from '../FormInput/ImageInput';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState(""); // Renamed to 'emailErr' for clarity
  const [imageUrl, setImageUrl] = useState('')
  const [name, setName] = useState('')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
 
  const onSubmit = async (data) => {
   data.pfp = imageUrl;
   
    console.log(data)
    try {

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      setLoading(true);

      const response = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("User Created Successfully");
        reset();
        router.push("/login");
      } else {
        handleErrorResponse(response.status, responseData);
      }
    } catch (error) {
      console.log(error.message)
      toast.error("Oops! Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Handle server-side error for duplicate email and other errors
  const handleErrorResponse = (status, responseData) => {
    if (status === 409) {
      setEmailErr("User with this Email already exists");
      toast.error("User with this Email already exists");
    } else {
      console.error("Server Error:", responseData.message || "No message provided");
      toast.error("Oops! Something went wrong.");
    }
  };

 

  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 w-full max-h-96 overflow-y-scroll">

      <TextInput
        label="Email"
        name="email"
        register={register}
        errors={errors}
        type="email" user experience
        autoComplete="email"
        required
      />
      <TextInput
        label="Name"
        name="name"
        register={register}
        errors={errors}
        type="text" user experience
        autoComplete="name"
        required
      />

      <TextInput
        label="Password"
        name="password"
        register={register}
        errors={errors}
        type="password"
        required
      />
      <TextInput
        label="Confirm Password"
        name="confirmPassword"
        register={register}
        errors={errors}
        type="password"
        required
      />
      <ImageInput
          label="Profile Pic"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="imageUploader"
        />
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"}`}
      >
        {loading ? "Processing..." : "Sign Up"}
      </button>

      {emailErr && <p className="text-red-500 text-sm">{emailErr}</p>}
    </form>
  );
}
