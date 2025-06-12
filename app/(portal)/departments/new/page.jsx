"use client";
import React, { useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";


import { Input } from "@/components/ui/input"

import { useForm } from "react-hook-form";

import SubmitButton from "@/components/FormInput/SubmitButton";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { postRequest } from "@/lib/functions";
import TextInput from "@/components/FormInput/TextInput";

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
      await postRequest('departments', data, 'Successfully Created department');
      reset();
      router.push('/departments');
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
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
