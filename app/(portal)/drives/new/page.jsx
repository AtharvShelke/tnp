"use client";
import React, { useEffect, useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";
import RoundInputForm from "@/components/FormInput/RoundInputForm";
import SelectInput from "@/components/FormInput/SelectInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import TextInput from "@/components/FormInput/TextInput";
import { useFieldArray, useForm } from "react-hook-form";
import DateInput from "@/components/FormInput/DateInput";
import SubmitButton from "@/components/FormInput/SubmitButton";

import ImageInput from "@/components/FormInput/ImageInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NewDrive({ initialData = {}, isUpdate = false }) {
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments`, {
        method: "GET",
        headers: {
          "Cache-Control": 'no-store',
          'Pragma': 'no-cache',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const department = await response.json()
      
      setDepartments(department);

    }
    fetchDepartments();

  }, []);


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const status = [
    { id: 'Upcoming', title: "Upcoming" },
    { id: "Active", title: "Active" },
    { id: "Closed", title: "Closed" },
  ];
  const router = useRouter();
 
  const { fields, append, remove } = useFieldArray({ control, name: 'rounds' })

  const onSubmit = async (data) => {
    setLoading(true);

    try {
        // Explicitly structure the data object
        const postData = {
            referenceNumber: data.referenceNumber,
            title: data.title,
            departmentId: data.departmentId,
            status: data.status,
            industryType: data.industryType,
            role: data.role,
            location: data.location,
            description: data.description,
            eligibility: data.eligibility,
            link: data.link,
            rounds: data.rounds || [], 
            driveDate: data.driveDate,
            lastDriveDate: data.lastDriveDate,
            imageUrl: imageUrl, 
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        setLoading(false);

        if (response.ok) {
            toast.success("Successfully added the drive");
            reset();
            router.push("/drives");
        } else {
            const errorText = await response.text(); // Get error response text
            console.log(errorText);
            toast.error(`Error: ${errorText || "An error occurred"}`);
        }
    } catch (error) {
        setLoading(false);
        toast.error(`Error: ${error.message}`);
    }
};

  return (
    <div>
      <FormHeader title="Drive" href="/dashboard" />
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
          <SelectInput
            register={register}
            className="w-full"
            name="departmentId"
            label="Department"
            options={departments}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="status"
            label="Status"
            options={status}
          />

          <TextInput
            label="Industry Type"
            name="industryType"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Role"
            name="role"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Location"
            name="location"
            register={register}
            errors={errors}
            type="text"
          />
          <TextareaInput
            label="Description"
            name="description"
            register={register}
            errors={errors}
          />
          <TextareaInput
            label="Eligibility"
            name="eligibility"
            register={register}
            errors={errors}
          />
          <TextInput
            label="Application Link"
            name="link"
            register={register}
            errors={errors}
            type="text"
          />
          <div className="">
            <h3 className="text-lg sont-semibold text-gray-700">Rounds</h3>
            {fields.map((field, index) => (
              <div key={field.id}>
                <TextInput
                  label="Round Name"
                  name={`rounds[${index}].title`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 mt-4"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append()}
              className="mt-2 mb-4 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Round
            </button>
          </div>
        </div>

        <DateInput
          label={"Date of Drive"}
          name={"driveDate"}
          register={register}
          errors={errors}
        />
        <DateInput
          label={"Last Date of Drive"}
          name={"lastDriveDate"}
          register={register}
          errors={errors}
        />
        <ImageInput
          label="Drive Image"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="imageUploader"
        />


        <SubmitButton isLoading={loading} title={'Drive'} />
      </form>
    </div>
  );
}
{/* <RoundInputForm
          register={register}
          errors={errors}
        />
        <div className="my-5">
        <label htmlFor="numRounds" className="">Number of rounds:</label>
        <input type="text" name="numRounds" placeholder="Number of Rounds" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
        onChange={handleChange}/>
        {Array.from({ length: numR }, (_, index) => (
          <div key={index} className="my-3">
           <TextInput
            label={`Round ${index+1}`}
            name={`round[${index}].title`}
            register={register}
            errors={errors}
            type="text"
          />
           
          </div>
        ))}
        </div> */}