"use client";
import React, { useEffect, useState } from "react";
import FormHeader from "@/components/dashboard/FormHeader";
import TextInput from "@/components/FormInput/TextInput";
import { useFieldArray, useForm } from "react-hook-form";
import SubmitButton from "@/components/FormInput/SubmitButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SelectInput from "@/components/FormInput/SelectInput";
import DateInput from "@/components/FormInput/DateInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import { signOut, useSession } from "next-auth/react";
import { UploadDropzone } from "@/lib/uploadthing";
import { getRequest } from "@/lib/apiRequest";

export default function NewStudent({ initialData = {}, isUpdate = false }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });
  const router = useRouter();
  const { data: session, status } = useSession();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDepartments = async () => {
      // departments
      try {
        const department = await getRequest('departments')
        setDepartments(department);
      } catch (error) {
        toast.error("Failed to load departments. Please try again.");
        console.error(error);
      }
    };
    fetchDepartments();
  }, []);

  const gender = [
    {
      id: 'Male',
      title: 'Male'
    },
    {
      id: 'Female',
      title: 'Female'
    },

  ]
  const projectType = [
    {
      id: 'Major',
      title: 'Major'
    },
    {
      id: 'Minor',
      title: 'Minor'
    },

  ]
  const grad = [
    {
      id: 2025,
      title: 2025
    },
    {
      id: 2026,
      title: 2026
    },
    {
      id: 2027,
      title: 2027
    },
    {
      id: 2028,
      title: 2028
    },
    {
      id: 2029,
      title: 2029
    },


  ]
  const admissionType = [
    {
      id: 'Regular',
      title: 'Regular'
    },
    {
      id: 'Direct Second Year',
      title: 'Direct Second Year'
    },
  ]



  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: "education",
  });

  const { fields: technicalSkillFields, append: appendTechnicalSkill, remove: removeTechnicalSkill } = useFieldArray({
    control,
    name: "technicalSkill",
  });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "project",
  });
  const { fields: studentDocumentsFields, append: appendStudentDocument, remove: removeStudentDocument } = useFieldArray({
    control,
    name: "studentDocument",
  });


  const onSubmit = async (data) => {
    data.userId = session?.user?.id;
    data.isProfileComplete = true;
    data.placed = false;

    console.log(data);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      toast.success('Student added successfully');
      signOut();
      router.push('/login')
    } else {
      const errorText = await response.text();
      console.log(errorText);
      toast.error(`Error: ${errorText || "An error occurred"}`);
    }
  };


  return (
    <div>
      <FormHeader title="Student Registration" href="/dashboard" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-5"
      >
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

          <TextInput
            label="PRN"
            name="PRN"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Phone"
            name="phone"
            register={register}
            errors={errors}
            type="text"
          />
          <TextareaInput
            label="About Yourself"
            name="about"
            register={register}
            errors={errors}
          />
          <TextareaInput
            label="Address"
            name="address"
            register={register}
            errors={errors}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="departmentId"
            label="Select the Department"
            options={departments}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="gender"
            label="Select the Gender"
            options={gender}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="admissionType"
            label="Admission Type"
            options={admissionType}
          />
          <SelectInput
            register={register}
            className="w-full"
            name="passOutYear"
            label="Expected Graduation"
            options={grad}
          />
          <DateInput
            label={"Date of Birth"}
            name={"dob"}
            register={register}
            errors={errors}
            className="col-span-2"
          />

          <TextInput
            label="CGPA"
            name="cgpa"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Languages Known"
            name="language"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Other Interests"
            name="otherInterests"
            register={register}
            errors={errors}
            type="text"
          />
          <TextInput
            label="Github Link"
            name="githubLink"
            register={register}
            errors={errors}
            type="text"
            className="w-full"
          />
          <TextInput
            label="LinkedIn"
            name="linkedIn"
            register={register}
            errors={errors}
            type="text"
            className="w-full"
          />

          <TextInput
            label="Live BackLogs"
            name="liveBack"
            register={register}
            errors={errors}

            className="w-full"
          />
          <TextInput
            label="Dead BackLogs"
            name="deadBack"
            register={register}
            errors={errors}

            className="w-full"
          />
          <TextInput
            label="Year Gap"
            name="yearGap"
            register={register}
            errors={errors}


          />
          <TextInput
            label="Preference 1"
            name="preference1"
            register={register}
            errors={errors}


          />
          <TextInput
            label="Preference 2"
            name="preference2"
            register={register}
            errors={errors}


          />
          <TextInput
            label="Preference 3"
            name="preference3"
            register={register}
            errors={errors}


          />
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700">Education</h3>
            {educationFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-2 gap-4 sm:gap-6">
                <TextInput
                  label="Name"
                  name={`education[${index}].title`}
                  register={register}
                  errors={errors}
                  type="text"
                  className="w-full"
                /><TextInput
                  label="Location"
                  name={`education[${index}].address`}
                  register={register}
                  errors={errors}
                  type="text"
                  className="w-full"
                />
                <TextInput
                  label="Institute"
                  name={`education[${index}].institute`}
                  register={register}
                  errors={errors}
                  type="text"
                  className="w-full"
                />
                <TextInput
                  label="Score"
                  name={`education[${index}].marks`}
                  register={register}
                  errors={errors}
                  type="text"
                  className="w-full"
                />
                <TextInput
                  label="Year"
                  name={`education[${index}].year`}
                  register={register}
                  errors={errors}
                  type="number"

                />
                {/* Other fields */}
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="w-max text-red-500 hover:text-red-700 mt-2 px-2 py-1 rounded text-sm border border-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendEducation()}
              className="mt-2 mb-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Education
            </button>

          </div>
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700">Technical Skills</h3>
            {technicalSkillFields.map((field, index) => (
              <div key={field.id} className="mt-5 flex flex-col gap-5">
                <TextInput
                  label="Skill Domain"
                  name={`technicalSkill[${index}].domain`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <TextInput
                  label="Skill Names"
                  name={`technicalSkill[${index}].name`}
                  register={register}
                  errors={errors}
                  type="text"
                />

                <button
                  type="button"
                  onClick={() => removeTechnicalSkill(index)}
                  className="w-max text-red-500 hover:text-red-700 mt-2 px-2 py-1 rounded text-sm border border-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTechnicalSkill()}
              className="mt-2 mb-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Skill
            </button>

          </div>
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700">Project</h3>
            {projectFields.map((field, index) => (
              <div key={field.id} className="mt-5 flex flex-col gap-5">
                <TextInput
                  label="Project Name"
                  name={`project[${index}].name`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <SelectInput
                  register={register}
                  className="w-full"
                  name={`project[${index}].type`}
                  label="Project Type"
                  options={projectType}
                />
                <TextareaInput
                  label="About"
                  name={`project[${index}].description`}
                  register={register}
                  errors={errors}
                />
                <TextInput
                  label="Project Technologies"
                  name={`project[${index}].technologies`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <TextInput
                  label="Project Role"
                  name={`project[${index}].role`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <TextInput
                  label="Project Github Link"
                  name={`project[${index}].githubLink`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="w-max text-red-500 hover:text-red-700 mt-2 px-2 py-1 rounded text-sm border border-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendProject()}
              className="mt-2 mb-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Project
            </button>

          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-gray-700">Documents</h3>
            {studentDocumentsFields.map((field, index) => (
              <div key={field.id} className="mt-5 flex flex-col gap-5">
                <TextInput
                  label="Name"
                  name={`studentDocument[${index}].title`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                {!watch(`studentDocument[${index}].link`) ? (
                  <UploadDropzone
                    endpoint="pdfUploader"
                    onClientUploadComplete={(res) => {
                      const pdfUrl = res[0]?.url || "";
                      setValue(`studentDocument[${index}].link`, pdfUrl);
                      if (pdfUrl) {
                        console.log(`PDF Uploaded: ${pdfUrl}`);
                      }
                    }}
                    onUploadError={(error) => {
                      console.log(`ERROR! ${error.message}`);
                    }}
                  />
                ) : (
                  <iframe
                    src={watch(`studentDocument[${index}].link`)}
                    className="mt-4 w-full h-64 border rounded"
                    title={`Document Preview ${index}`}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeStudentDocument(index)}
                  className="w-max text-red-500 hover:text-red-700 mt-2 px-2 py-1 rounded text-sm border border-red-500"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendStudentDocument({ title: "", link: "" })}
              className="mt-2 mb-4 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Document
            </button>
          </div>
        </div>




        <SubmitButton isLoading={loading} title={'Student'} />
      </form>
    </div>
  );
}
