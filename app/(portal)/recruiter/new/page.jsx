"use client";

import React, { useEffect, useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";
import TextInput from "@/components/FormInput/TextInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import SubmitButton from "@/components/FormInput/SubmitButton";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import { makePostRequest, getRequest } from "@/lib/apiRequest";

export default function NewRecruiter({ initialData = {}, isUpdate = false }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({ defaultValues: initialData });

    const router = useRouter();
    const { data: session, status } = useSession(); 
    const [loading, setLoading] = useState(false);
    const [checkingProfile, setCheckingProfile] = useState(true);
    useEffect(() => {
      const checkRecruiterProfile = async () => {
          if (!session?.user?.id) return;
  
          try {
              const response = await fetch(`/api/recruiter/${session.user.id}`);
  
              if (response.ok) {
                  const data = await response.json();
                  if (data.isProfileComplete) {
                      toast.success("Profile already exists. Redirecting...");
                      router.push("/dashboard");
                  } else {
                      console.log("No existing profile found. Proceeding with form.");
                  }
              } else if (response.status === 404) {
                  // 404 means no profile exists, which is expected for new recruiters
                  console.log("No recruiter profile found. Allowing form submission.");
              } else {
                  throw new Error(`Unexpected error: ${response.statusText}`);
              }
          } catch (error) {
              console.error("Error checking recruiter profile:", error);
          } finally {
              setCheckingProfile(false);
          }
      };
  
      if (status === "authenticated") {
          checkRecruiterProfile();
      } else if (status === "unauthenticated") {
          setCheckingProfile(false);
      }
  }, [session, status, router]);
  
  
  

    const onSubmit = async (data) => {
        if (!session?.user?.id) {
            toast.error("User session not found. Please log in again.");
            return;
        }

        setLoading(true);

        try {
            const formData = {
                userId: session.user.id,
                phone: data.phone,
                about: data.about || "",
                linkedIn: data.linkedIn,
                company: data.company,
                companyDescription: data.companyDescription || "",
                isProfileComplete: true,
            };

            console.log("Submitting data:", formData);

            const response = await makePostRequest(reset, setLoading, "recruiter", "Recruiter", formData);

            if (!response || response.error) {
                throw new Error(response?.error || "Failed to create recruiter profile. Please try again.");
            }

            toast.success("Recruiter profile created successfully!");
       
            signOut();
        } catch (error) {
            console.error("Error in onSubmit:", error);
            toast.error(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading" || checkingProfile) {
        return <p className="text-center my-10">Checking profile...</p>;
    }

    return (
        <div>
            <FormHeader title="Recruiter Registration" href="/profileCheck" />
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
                <SubmitButton isLoading={loading} title="Register as Recruiter" />
            </form>
        </div>
    );
}
