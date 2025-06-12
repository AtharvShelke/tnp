'use client';

import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "../FormInput/TextInput";
import TextareaInput from "../FormInput/TextareaInput";
import SelectInput from "../FormInput/SelectInput";
import DateInput from "../FormInput/DateInput";
import { UploadDropzone } from "@/lib/uploadthing";
import SubmitButton from "../FormInput/SubmitButton";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getRequest } from "@/lib/apiRequest";

const UpdateStudent = ({ initialData = {}, isUpdate = true, studentId = {} }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
    const [departments, setDepartment] = useState();
  const router = useRouter();
  const userRole = session?.user?.role;
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
    const fetchDepartments = async () => {
      try {
        const response = await getRequest('departments');
        
          setDepartment(response);
        
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialData,
  });

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

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = useCallback(async (data) => {
  if (!isDirty) {
    toast.error("No changes detected");
    return;
  }

  try {
    setLoading(true);
    
    // Prepare the data to send
    const payload = {
      ...data,
      departmentId: data.department?.id || data.departmentId,
      // Ensure dob is properly formatted as ISO string if it exists
      ...(data.dob && { dob: new Date(data.dob).toISOString() }),
    };
  delete payload.department;
    // Prepare nested relations only if they exist and are arrays
    const prepareRelation = (field) => {
      if (!data[field] || !Array.isArray(data[field])) return undefined;
      return {
        deleteMany: {},
        create: data[field].map(item => {
          if (field === 'technicalSkill') {
            return {
              domain: item.domain,
              name: Array.isArray(item.name) ? item.name : [item.name]
            };
          }
          if (field === 'project') {
            return {
              name: item.name,
              type: item.type,
              description: item.description,
              technologies: Array.isArray(item.technologies) ? item.technologies : [item.technologies],
              role: item.role,
              githubLink: item.githubLink
            };
          }
          if (field === 'education') {
            return {
              title: item.title,
              address: item.address,
              marks: item.marks,
              institute: item.institute,
              year: item.year
            };
          }
          if (field === 'studentDocument') {
            return {
              title: item.title,
              link: item.link
            };
          }
          return item;
        })
      };
    };

    // Add relations only if they exist
    const relations = ['education', 'technicalSkill', 'project', 'studentDocument'];
    relations.forEach(relation => {
      const prepared = prepareRelation(relation);
      if (prepared) {
        payload[relation] = prepared;
      }
    });

    // Remove fields that shouldn't be sent
    const fieldsToRemove = ['userId', 'id', 'isProfileComplete', 'placed', 'user', 'createdAt', 'updatedAt'];
    fieldsToRemove.forEach(field => delete payload[field]);

    // Determine the ID to use based on user role
    const endpointId = userRole === 'STUDENT' ? session?.user?.id : studentId;

    const response = await fetch(`/api/student/${endpointId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update student');
    }

    const result = await response.json();
    toast.success('Profile updated successfully!');
    
    // Redirect based on user role
    if (userRole === 'STUDENT') {
      router.push('/student/profile');
    } else {
      router.push(`/students/${studentId}`);
    }
    
  } catch (error) {
    console.error('Error updating student:', error);
    toast.error(`Update failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
}, [isDirty, session, router, userRole, studentId]);
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
              name="department"
              label="Department"
              options={departments}
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
                title={'Update Profile'}
                disabled={!isDirty}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;