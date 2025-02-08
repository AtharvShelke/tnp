'use client'
import DownloadModal from '@/components/dashboard/DownloadModal';
import { getRequest } from '@/lib/apiRequest';
import { Github, GraduationCap, Landmark, Linkedin, Mail, Phone, University } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
    const [userdata, setUserdata] = useState([]);
    const [studentdata, setStudentdata] = useState([]);
    const [department, setDepartment] = useState([]);
    
    const { data: session, status } = useSession();
    const currentUserId = session?.user?.id
    
    
    useEffect(() => {
        const fetchUserDetails = async () => {
            
            try {
                const data = await getRequest(`user/${currentUserId}`);
                setUserdata(data)
            } catch (error) {
                console.error("Failed to fetch user details:", error.message);
                toast.error('Failed to fetch user details');
            }
        };
        const fetchStudentDetails = async () => {
            
            try {
                const data = await getRequest(`student/${currentUserId}`)
                setStudentdata(data)
            } catch (error) {
                console.error("Failed to fetch user details:", error.message);
                toast.error('Failed to fetch user details');
            }
        };


        if (currentUserId) {
            fetchUserDetails();
            fetchStudentDetails();

        }
    }, [currentUserId]);
    useEffect(() => {
        const fetchDepartment = async (departmentId) => {
           
            try {
                const data = await getRequest(`departments/${departmentId}`)
                setDepartment(data);
            } catch (error) {
                console.error("Failed to fetch user details:", error.message);
                toast.error('Failed to fetch user details');
            }
        };
        if (studentdata.departmentId) {
            fetchDepartment(studentdata.departmentId);
        }
    }, [studentdata.departmentId]);
    return (
        <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">

            <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src={userdata.pfp || '/logo.jpg'}
                        alt="Profile"
                    />
                    <div className="font-medium">
                        <div className="font-bold text-xl">
                            {userdata.name}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            <University className="w-4 h-4" />
                            {studentdata.admissionType}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            <Landmark className="w-4 h-4" />
                            {department.title} (CGPA : {studentdata.cgpa})
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            <GraduationCap className="w-4 h-4" />
                            Expected Graduation: {studentdata.passOutYear}
                        </div>

                    </div>

                </div>
                <div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Mail className="w-4 h-4" />
                        {userdata.email}
                    </div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Phone className="w-4 h-4" />
                        {studentdata.phone}
                    </div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Github className="w-4 h-4" />
                        <a
                            href={studentdata.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                            {studentdata.githubLink}
                        </a>
                    </div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Linkedin className="w-4 h-4" />
                        <a
                            href={studentdata.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer"
                        >
                            {studentdata.linkedIn}
                        </a>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">Technical Skills</h2>
                    {studentdata.technicalSkill?.length > 0 ? (
                        studentdata.technicalSkill.map((category, index) => (
                            <div key={index} className="mb-4">
                                <h3 className="font-semibold text-gray-700">{category.domain}</h3>
                                <ul className="list-disc ml-6 text-gray-600">
                                    {category.name.map((skill, i) => (
                                        <li key={i}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No technical skills available.</p>
                    )}

                    <h2 className="text-lg font-bold mt-6 mb-3">Education</h2>
                    {studentdata.education?.length > 0 ? (
                        studentdata.education.map((year, i) => (
                            <div key={i}>
                                <div className="font-semibold w-[90%] flex justify-between mt-3">
                                    <h1>{year.institute}</h1>
                                    <h1>{year.year}</h1>
                                </div>
                                <div className="font-light w-[90%] flex justify-between text-gray-600">
                                    <h1>{year.title}</h1>
                                    <h1>{year.address}</h1>
                                </div>
                                <p className="text-gray-600">{year.marks}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No education details available.</p>
                    )}
                    <h2 className="text-lg font-bold mt-6 mb-3">Preferences</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                        <li>
                            {studentdata.preference1}
                        </li>
                        <li>
                            {studentdata.preference2}
                        </li>
                        <li>
                            {studentdata.preference3}
                        </li>
                    </ul>
                    <h2 className="text-lg font-bold mt-6 mb-3">Languages Known</h2>

                    {studentdata.language?.length > 0 ? (
                        <div>
                            {studentdata.language.join(', ')}
                        </div>
                    ) : 'No Languages'}
                    <h2 className="text-lg font-bold mt-6 mb-3">Other Interest</h2>

                    {studentdata.otherInterests?.length > 0 ? (
                        <div>
                            {studentdata.otherInterests.join(', ')}
                        </div>
                    ) : 'No interests'}

                </div>

                <div className="relative col-span-2 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">About</h2>
                    <p className="text-gray-600">{studentdata.about}</p>
                    <h2 className="text-lg font-bold mt-6 mb-3">Projects</h2>

                    {studentdata.project?.length > 0 ? (
                        studentdata.project.map((proj, i) => {
                            return (
                                <div key={i} className="mb-4">
                                    <h3 className="font-semibold text-gray-700">{proj.name}</h3>
                                    <p className="text-sm text-gray-600">{proj.type}</p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Technologies:</span>{' '}
                                        {proj.technologies.join(', ')}
                                    </p>
                                    <p className="text-sm text-gray-600">{proj.description}</p>

                                    <a
                                        href={proj.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        View on GitHub
                                    </a>
                                </div>
                            )

                        })
                    ) : (
                        <p className="text-gray-600">No Project details available.</p>
                    )}
                    <div className='flex w-full items-center justify-between'>
                        <DownloadModal className=' ' documents={studentdata.studentDocument ? studentdata.studentDocument : []} />
                        <a href={`/student/profile/edit/${currentUserId}`} className="  border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Edit Profile
                        </a>
                    </div>



                </div>

            </div>
        </div>
    );
}
