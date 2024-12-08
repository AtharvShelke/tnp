"use client";
import React, { useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";


import TextInput from "@/components/FormInput/TextInput";
import { useForm } from "react-hook-form";

import SubmitButton from "@/components/FormInput/SubmitButton";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewDepartment({ initialData = {}, isUpdate = false }) {
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

  const [loading, setLoading] = useState(false);

  
  const onSubmit = async (data) => {

    setLoading(true);

    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments`, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(data)

      });
      setLoading(false)
      if (response.ok) {
        toast.success('Successfully added the department')
        reset();
      } else {
        const errorText = await response.text(); // Get the response text in case it's not JSON
        console.log(errorText);
        toast.error(`Error: ${errorText || 'An error occurred'}`);
      }
      router.push('/departments')
    } catch (error) {
      setLoading(false);
        
        toast.error(`Error: ${error.message}`);
    }

  }
  return (
    <div>
      <FormHeader title="Department" href="/dashboard" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

          <TextInput
            label="Title"
            name="title"
            register={register}
            errors={errors}
            type="text"
          />



        </div>




        <SubmitButton isLoading={loading} title={'Department'} />
      </form>
    </div>
  );
}
