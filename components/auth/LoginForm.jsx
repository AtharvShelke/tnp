'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import TextInput from '../FormInput/TextInput';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize form
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      console.log("SignIn Response:", loginData);

      if (loginData?.error) {
        console.error("Login error:", loginData.error);
        setLoading(false);
        // Optionally, show error message to user
        return;
      }

      if (loginData?.ok) {
        setLoading(false);
        router.push("/profileCheck");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setLoading(false);
      // Optionally show a user-friendly error message here
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 w-full">
      <TextInput
        label="Email"
        name="email"
        register={register}
        errors={errors}
        type="email" // Explicitly specify type for better UX (input field type for email)
        
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
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"}`}
      >
        {loading ? "Processing..." : "Sign In"}
      </button>

      <p className="text-sm font-light text-gray-500">
        Don't have an account?{" "}
        <a href="/register" className="font-medium text-blue-600 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}
