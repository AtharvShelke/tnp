'use client'

import { useFieldArray, useForm } from "react-hook-form"
import TextInput from "../FormInput/TextInput"
import TextareaInput from "../FormInput/TextareaInput"
import SelectInput from "../FormInput/SelectInput"
import DateInput from "../FormInput/DateInput"
import { UploadDropzone } from "@/lib/uploadthing"
import SubmitButton from "../FormInput/SubmitButton"
import React, { useState, useEffect } from 'react';
import { makePostRequest, updateRequest } from "@/lib/apiRequest"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"


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

const NewStudent = ({ initialData = {}, departments, isUpdate = false, studentId = {} }) => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
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
    const currentValues = watch();
    const router = useRouter();
    const deepEqual = (obj1, obj2) => {
        if (typeof obj1 !== typeof obj2) return false;
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            if (obj1.length !== obj2.length) return false;
            return obj1.every((item, index) => deepEqual(item, obj2[index]));
        } else if (typeof obj1 === 'object' && typeof obj2 === 'object') {
            if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
            return Object.keys(obj1).every(key => deepEqual(obj1[key], obj2[key]));
        }
        return obj1 === obj2;
    };

    const getChangedAndExistingValues = () => {
        const changedValues = {};
        const existingValues = {};

        for (const key in currentValues) {
            if (!deepEqual(currentValues[key], initialData[key])) {
                changedValues[key] = currentValues[key];
                existingValues[key] = initialData[key];
            }
        }

        return { changedValues, existingValues };
    };

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
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);
    const compareObject = (obj1, obj2) => {
        console.log(Object.keys(obj1))
        console.log(Object.keys(obj2))
    }
    const onSubmit = async (data) => {
        const { changedValues, existingValues } = getChangedAndExistingValues();
        console.log("Changed Values:", JSON.stringify(changedValues));
        console.log("Existing Values:", JSON.stringify(existingValues));

        data.userId = session?.user?.id;
        data.isProfileComplete = true;
        data.placed = false;

        const requestAction = isUpdate ? updateRequest : makePostRequest;
        const requestUrl = isUpdate ? `student/${studentId}` : 'student';
        await requestAction(reset, setLoading, requestUrl, 'Student', changedValues);
        
        // console.log("Initial data: ",(initialData))
        // console.log("Submit data: ",(data))
        // console.log(compareObject(initialData, data))
    };
    return (
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
    )
}

export default NewStudent