'use client';

import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "@/components/FormInput/TextInput";
import TextareaInput from "@/components/FormInput/TextareaInput";
import SelectInput from "@/components/FormInput/SelectInput";
import { UploadDropzone } from "@/lib/uploadthing";
import SubmitButton from "@/components/FormInput/SubmitButton";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getRequest, makePostRequest, updateStudentRequest } from "@/lib/apiRequest";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DateInput from "@/components/FormInput/DateInput";
import toast from "react-hot-toast";

const NewStudent = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [dept, setDept] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const router = useRouter();
  
  const genderOptions = useMemo(() => [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' }
  ], []);

  const projectTypeOptions = useMemo(() => [
    { id: 'Major', title: 'Major' },
    { id: 'Minor', title: 'Minor' }
  ], []);

  const graduationYears = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: 2025 + i,
      title: 2025 + i
    })), []);

  const admissionTypeOptions = useMemo(() => [
    { id: 'Regular', title: 'Regular' },
    { id: 'Direct Second Year', title: 'Direct Second Year' }
  ], []);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getRequest('departments');
        if (isMounted) {
          setDept(response);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, [isMounted]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm();

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

  const onSubmit = useCallback(async (formData) => {
    try {
      setLoading(true);
      const submissionData = {
        ...formData,
        userId: session?.user?.id,
        isProfileComplete: true,
        placed: false
      };
      
      await makePostRequest(
        reset,
        setLoading,
        'student',
        'Student',
        submissionData
      );
      signOut();
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(`Failed to create student`);
    } finally {
      setLoading(false);
    }
  }, [session, reset, router]);

  const handleAddEducation = useCallback(() => {
    appendEducation({ title: '', address: '', institute: '', marks: '', year: '' });
  }, [appendEducation]);

  const handleAddTechnicalSkill = useCallback(() => {
    appendTechnicalSkill({ domain: '', name: '' });
  }, [appendTechnicalSkill]);

  const handleAddProject = useCallback(() => {
    appendProject({
      name: '',
      type: '',
      description: '',
      technologies: '',
      role: '',
      githubLink: ''
    });
  }, [appendProject]);

  const handleAddDocument = useCallback(() => {
    appendStudentDocument({ title: "", link: "" });
  }, [appendStudentDocument]);

  if (!isMounted) return null;

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'academic', label: 'Academic Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'documents', label: 'Documents' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <TextInput
              label="PRN"
              name="PRN"
              register={register}
              errors={errors}
              required
            />
            <TextInput
              label="Phone"
              name="phone"
              register={register}
              errors={errors}
              required
            />

            <TextareaInput
              label="About Yourself"
              name="about"
              register={register}
              errors={errors}
              className="col-span-2"
            />

            <TextareaInput
              label="Address"
              name="address"
              register={register}
              errors={errors}
              className="col-span-2"
            />

            <SelectInput
              register={register}
              name="departmentId"
              label="Department"
              options={dept}
              required
            />

            <SelectInput
              register={register}
              name="gender"
              label="Gender"
              options={genderOptions}
              required
            />

            <SelectInput
              register={register}
              name="admissionType"
              label="Admission Type"
              options={admissionTypeOptions}
            />

            <SelectInput
              register={register}
              name="passOutYear"
              label="Expected Graduation"
              options={graduationYears}
            />

            <DateInput
              label="Date of Birth"
              name="dob"
              register={register}
              errors={errors}
              className="col-span-2"
            />

            <TextInput
              label="Github Link"
              name="githubLink"
              register={register}
              errors={errors}
              className="col-span-2"
            />

            <TextInput
              label="LinkedIn"
              name="linkedIn"
              register={register}
              errors={errors}
              className="col-span-2"
            />
          </div>
        )}

        {/* Academic Information Tab */}
        {activeTab === 'academic' && (
          <div className="grid gap-6 sm:grid-cols-2">
            <TextInput
              label="CGPA"
              name="cgpa"
              register={register}
              errors={errors}
              type="number"
              step="0.01"
              min="0"
              max="10"
            />

            <TextInput
              label="Languages Known"
              name="language"
              register={register}
              errors={errors}
            />

            <TextInput
              label="Other Interests"
              name="otherInterests"
              register={register}
              errors={errors}
              className="col-span-2"
            />

            <TextInput
              label="Live BackLogs"
              name="liveBack"
              register={register}
              errors={errors}
              type="number"
              min="0"
            />

            <TextInput
              label="Dead BackLogs"
              name="deadBack"
              register={register}
              errors={errors}
              type="number"
              min="0"
            />

            <TextInput
              label="Year Gap"
              name="yearGap"
              register={register}
              errors={errors}
              type="number"
              min="0"
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Education History</h3>
              {educationFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <TextInput
                    label="Name"
                    name={`education[${index}].title`}
                    register={register}
                    errors={errors}
                    type="text"
                    className="w-full"
                  />
                  <TextInput
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
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700 px-3 py-1.5 rounded text-sm border border-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEducation}
                className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add Education
              </button>
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Technical Skills</h3>
              {technicalSkillFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                  <div className="col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTechnicalSkill(index)}
                      className="text-red-500 hover:text-red-700 px-3 py-1.5 rounded text-sm border border-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddTechnicalSkill}
                className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
            {projectFields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
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
                  options={projectTypeOptions}
                />
                <TextareaInput
                  label="About"
                  name={`project[${index}].description`}
                  register={register}
                  errors={errors}
                />
                <div className="grid grid-cols-2 gap-4">
                  <TextInput
                    label="Technologies"
                    name={`project[${index}].technologies`}
                    register={register}
                    errors={errors}
                    type="text"
                  />
                  <TextInput
                    label="Your Role"
                    name={`project[${index}].role`}
                    register={register}
                    errors={errors}
                    type="text"
                  />
                </div>
                <TextInput
                  label="Github Link"
                  name={`project[${index}].githubLink`}
                  register={register}
                  errors={errors}
                  type="text"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="text-red-500 hover:text-red-700 px-3 py-1.5 rounded text-sm border border-red-500"
                  >
                    Remove Project
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddProject}
              className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Project
            </button>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Documents</h3>
            {studentDocumentsFields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <TextInput
                  label="Document Name"
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
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6"
                  />
                ) : (
                  <div className="space-y-2">
                    <iframe
                      src={watch(`studentDocument[${index}].link`)}
                      className="w-full h-64 border rounded"
                      title={`Document Preview ${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => setValue(`studentDocument[${index}].link`, "")}
                      className="text-sm text-blue-500 hover:text-blue-700"
                    >
                      Replace Document
                    </button>
                  </div>
                )}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeStudentDocument(index)}
                    className="text-red-500 hover:text-red-700 px-3 py-1.5 rounded text-sm border border-red-500"
                  >
                    Remove Document
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddDocument}
              className="mt-2 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Document
            </button>
          </div>
        )}

        {/* Navigation and Submit */}
        <div className="mt-8 flex justify-between">
          <div>
            {activeTab !== 'personal' && (
              <button
                type="button"
                onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) - 1].id)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div>
            {activeTab !== 'documents' ? (
              <button
                type="button"
                onClick={() => setActiveTab(tabs[tabs.findIndex(t => t.id === activeTab) + 1].id)}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            ) : (
              <SubmitButton
                isLoading={loading}
                title={'Create Student'}
                disabled={!isDirty}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewStudent;