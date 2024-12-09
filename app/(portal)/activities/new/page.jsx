"use client";
import React, { useEffect, useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";

import SelectInput from "@/components/FormInput/SelectInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import TextInput from "@/components/FormInput/TextInput";
import { useForm } from "react-hook-form";
import DateInput from "@/components/FormInput/DateInput";
import SubmitButton from "@/components/FormInput/SubmitButton";
import ImageInput from "@/components/FormInput/ImageInput";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
          "Pragma": "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const department = await response.json();
      setDepartments(department);
    };
    fetchDepartments();
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prev) => {
      const exists = prev.some((dept) => dept.title === department.title);
      if (exists) {

        return prev.filter((dept) => dept.title !== department.title);
      } else {

        return [...prev, { title: department.title }];
      }
    });
  };
  const router = useRouter();

  const onSubmit = async (data) => {

    setLoading(true);
    data.imageUrl = imageUrl;
    data.activityDepartments = selectedDepartments;
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      setLoading(false);

      if (response.ok) {
        toast.success("Successfully added the drive");

        reset();
        router.push("/activities");
      } else {
        const errorText = await response.text();
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
            name="description"
            register={register}
            errors={errors}
          />

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Departments</label>
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full px-3 py-2 border rounded"
            >
              {selectedDepartments.length > 0
                ? `${selectedDepartments.length} selected`
                : "Select Departments"}
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 w-full bg-white border rounded shadow mt-1 z-10">
                {departments.map((department) => (
                  <label
                    key={department.id}
                    className="flex items-center p-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDepartments.some((dept) => dept.title === department.title)}
                      onChange={() => handleCheckboxChange(department)}
                      className="mr-2"
                    />
                    {department.title}
                  </label>
                ))}
              </div>
            )}
          </div>


          <TextInput
            label="Application Link"
            name="link"
            register={register}
            errors={errors}
            type="text"
          />
        </div>

        <DateInput
          label={"Date of Activity"}
          name={"date"}
          register={register}
          errors={errors}
        />

        <ImageInput
          label="Activity Image"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="imageUploader"
        />
        <SubmitButton isLoading={loading} title={'Activity'} />
      </form>
    </div>
  );
}
