"use client";

import React, { useEffect, useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";
import TextInput from "@/components/FormInput/TextInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import SubmitButton from "@/components/FormInput/SubmitButton";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { getRequest, makePostRequest } from "@/lib/apiRequest";

export default function NewRecruiter({ initialData = {}, isUpdate = false }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const recruiterData = await getRequest(`recruiter/${session.user.id}`);
          if (recruiterData?.isProfileComplete) {
            toast.success("Profile already complete. Redirecting...");
            router.replace("/dashboard");
          }
        } catch (error) {
          console.error("Error checking recruiter profile:", error);
        }
      }
    };

    checkProfileCompletion();
  }, [session, status, router]);

  const onSubmit = async (data) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User session not found. Please log in again.");
      }

      data.userId = session.user.id;
      data.isProfileComplete = true;

      console.log("Frontend data:", data);

      setLoading(true);

      const response = await makePostRequest(reset, setLoading, "recruiter", "Recruiter", data);

      if (!response || response.error) {
        throw new Error(response?.error || "Failed to create recruiter profile. Please try again.");
      }

      toast.success("Recruiter profile created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p className="text-center my-10">Loading...</p>;
  }

  return (
    <div>
      <FormHeader title="Recruiter Registration" href="/dashboard" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput label="Phone" name="phone" register={register} errors={errors} type="text" />
          <TextareaInput label="About Yourself" name="about" register={register} errors={errors} />
          <TextInput label="LinkedIn" name="linkedIn" register={register} errors={errors} type="text" />
          <TextInput label="Company Name" name="company" register={register} errors={errors} />
          <TextareaInput label="About Company" name="companyDescription" register={register} errors={errors} />
        </div>
        <SubmitButton isLoading={loading} title={"Register as Recruiter"} />
      </form>
    </div>
  );
}
