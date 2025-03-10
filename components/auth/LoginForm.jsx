"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextInput from "../FormInput/TextInput";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const loginData = await signIn("credentials", { ...data, redirect: false });

      if (loginData?.error) {
        console.error("Login error:", loginData.error);
        setLoading(false);
        return;
      }

      if (loginData?.ok) {
        router.push("/profileCheck");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <TextInput
        label="Email Address"
        name="email"
        register={register}
        errors={errors}
        type="email"
        required
        className="transition-all border-gray-300 focus:ring-2 focus:ring-blue-500"
      />
      <TextInput
        label="Password"
        name="password"
        register={register}
        errors={errors}
        type="password"
        required
        className="transition-all border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-6 py-3 font-semibold tracking-wide text-white transition rounded-lg bg-blue-600 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500 hover:scale-105"
        }`}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
