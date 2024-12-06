"use client";
import React, { useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";

import SelectInput from "@/components/FormInput/SelectInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import TextInput from "@/components/FormInput/TextInput";
import { useForm } from "react-hook-form";
import DateInput from "@/components/FormInput/DateInput";
import SubmitButton from "@/components/FormInput/SubmitButton";
import ImageInput from "@/components/FormInput/ImageInput";

export default function NewActivity({ initialData = {}, isUpdate = false }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const activityStatus = [
    { id: 1, title: "Upcoming" },
    { id: 2, title: "Active" },
    { id: 3, title: "Closed" },
  ];

  const branch = [
    { id: 1, title: "Computer Science Engineering" },
    { id: 2, title: "Information Technology" },
    { id: 3, title: "Mechanical Engineering" },
    { id: 4, title: "Civil Engineering" },
    { id: 5, title: "Electrical Engineering" },
    { id: 6, title: "Electronics and Communication Engineering" },
    { id: 7, title: "Aerospace Engineering" },
    { id: 8, title: "Automobile Engineering" },
    { id: 9, title: "Chemical Engineering" },
    { id: 10, title: "Biomedical Engineering" },
    { id: 11, title: "Biotechnology Engineering" },
    { id: 12, title: "Environmental Engineering" },
    { id: 13, title: "Industrial Engineering" },
    { id: 14, title: "Mining Engineering" },
    { id: 15, title: "Petroleum Engineering" },
    { id: 16, title: "Production Engineering" },
  ];

  const onSubmit = async (data) => {
    
    setLoading(true);
    data.imageUrl = imageUrl;
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        setLoading(false)
        reset();
      }
      
    } catch (error) {
      setLoading(false);
      console.log(error)
    }
  };


  return (
    <div>
      <FormHeader title="Activity" href="/dashboard" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput
            label="Reference Number"
            name="referenceNumber"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Title"
            name="title"
            register={register}
            errors={errors}
            type="text"
          />
          <TextareaInput
            label="About"
            name="activityDescription"
            register={register}
            errors={errors}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="branchId"
            label="Select the branch"
            options={branch}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="activity_status"
            label="Activity Status"
            options={activityStatus}
          />
          
         
          <TextInput
            label="Application Link"
            name="applicationLink"
            register={register}
            errors={errors}
            type="text"
          />
        </div>
        
        <DateInput
          label={"Date of Activity"}
          name={"activityDate"}
          register={register}
          errors={errors}
        />
        
        <ImageInput
          label="Activity Image"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="imageUploader"
        />
        <SubmitButton isLoading={loading} title={'Activity'}/>
      </form>
    </div>
  );
}
