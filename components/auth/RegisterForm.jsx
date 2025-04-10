"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import TextInput from "../FormInput/TextInput";
import ImageInput from "../FormInput/ImageInput";
import Loader from "../Loader";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    const payload = { ...data, pfp: imageUrl };

    if (process.env.NODE_ENV === "development") {
      console.log("Register Payload:", payload);
    }

    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

      const res = await fetch(`${baseUrl}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok) {
        toast.success("User created successfully!");
        reset();
        router.push("/login");
      } else if (res.status === 409) {
        setError("email", {
          type: "manual",
          message: "User with this email already exists",
        });
        toast.error("User already exists!");
      } else {
        toast.error(responseData.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Register error:", err.message);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 md:space-y-6 w-full max-h-96 overflow-y-scroll"
    >
      <TextInput
        label="Email"
        name="email"
        register={register}
        errors={errors}
        type="email"
        autoComplete="email"
        required
      />
      <TextInput
        label="Name"
        name="name"
        register={register}
        errors={errors}
        type="text"
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
        className={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-700 rounded-lg ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
        }`}
      >
        {loading ? <Loader /> : "Sign Up"}
      </button>
    </form>
  );
}
