"use client";
import React, { useEffect, useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";

import TextareaInput from "@/components/FormInput/TextareaInput";
import TextInput from "@/components/FormInput/TextInput";
import { useFieldArray, useForm } from "react-hook-form";
import DateInput from "@/components/FormInput/DateInput";
import SubmitButton from "@/components/FormInput/SubmitButton";

import ImageInput from "@/components/FormInput/ImageInput";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getRequest } from "@/lib/apiRequest";
import { useSession } from "next-auth/react";

export default function NewDrive({ initialData = {}, isUpdate = false }) {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      // departments
      const department = await getRequest(`departments`)
      setDepartments(department);
    };
    fetchDepartments();
  }, []);
  const { data: session, status } = useSession();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prev) => {
      const exists = prev.some((dept) => dept.id === department.id);
      if (exists) {
        return prev.filter((dept) => dept.id !== department.id);
      } else {
        return [...prev, { id: department.id, title: department.title }];
      }
    });
  };


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
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");


  const router = useRouter();

  const { fields, append, remove } = useFieldArray({ control, name: "rounds" });

  const onSubmit = async (data) => {

    setLoading(true);
    data.creatorId = session?.user?.id;
    data.imageUrl = imageUrl;
    data.driveDepartments = selectedDepartments;


    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setLoading(false);

      if (response.ok) {
        toast.success("Successfully added the drive");

        reset();
        router.push("/drives");
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
                      checked={selectedDepartments.some((dept) => dept.id === department.id)}
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
            label="Industry Type"
            name="industryType"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Job CTC"
            name="ctc"
            register={register}
            errors={errors}
            type="text"
          />
          <TextareaInput
            label="About"
            name="about"
            register={register}
            errors={errors}
          />
          <TextInput
            label="Bond"
            name="bond"
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
          <TextInput
            label="Download Link"
            name="downloadlink"
            register={register}
            errors={errors}
            type="text"
          />
          <div className="">
            <h3 className="text-lg font-semibold text-gray-700">Rounds</h3>
            {fields.map((field, index) => (
              <div key={field.id} >
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
                  className="text-red-500 hover:text-red-700 mt-2 px-2 py-1 rounded text-sm border border-red-500 "
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append()}
              className="mt-2 mb-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Round
            </button>
          </div>
        </div>

        <div className="flex gap-5">
          <DateInput
            label={"Date of Drive"}
            name={"driveDate"}
            register={register}
            errors={errors}
            className="w-1/2 mb-5"
          />
          <DateInput
            label={"Last Date of Drive"}
            name={"lastDriveDate"}
            register={register}
            errors={errors}
            className="w-1/2 mb-5"
          />
        </div>
        <ImageInput
          label="Drive Image"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="imageUploader"
        />

        <SubmitButton isLoading={loading} title={"Drive"} />
      </form>
    </div>
  );
}
