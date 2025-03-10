'use client';

import DownloadModal from '@/components/dashboard/DownloadModal';
import Loader from '@/components/Loader';
import { getRequest, makePostRequest } from '@/lib/apiRequest';
import { Github, GraduationCap, Landmark, Linkedin, Mail, Phone, University } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
    const params = useParams();
    const { id } = params;
    const [userdata, setUserdata] = useState({});
    const [studentdata, setStudentdata] = useState({});
    const [department, setDepartment] = useState({});
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const student = await getRequest(`student/${id}`);
                setStudentdata(student);

                if (student.departmentId) {
                    const departmentData = await getRequest(`departments/${student.departmentId}`);
                    setDepartment(departmentData);
                }
            } catch (error) {
                toast.error('Failed to fetch student details');
            }
        };

        const fetchUserDetails = async () => {
            try {
                const user = await getRequest(`user/${id}`);
                setUserdata(user);
            } catch (error) {
                toast.error('Failed to fetch user details');
            }
        };

        if (id) {
            fetchUserDetails();
            fetchStudentDetails();
        }
    }, [id]);

    const handleShortlist = async (studentId) => {
        try {
            setLoading(true);
            const recruiterId = session?.user?.id;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shortlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ studentId, recruiterId }), // Properly formatting the request body
            });
    
            const data = await response.json(); // Parsing response
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to shortlist student");
            }
    
            toast.success("Student shortlisted successfully!");
        } catch (error) {
            console.error("Shortlisting error:", error);
            toast.error(error.message || "Failed to shortlist student");
        } finally {
            setLoading(false);
        }
    };
    
if (loading) {
    <Loader/>
}
    return (
        <div className="max-w-5xl mx-auto my-8 p-6 rounded-xl shadow-lg bg-white border">
            <div className="flex flex-col md:flex-row items-center justify-between py-5 px-6 border-b bg-gray-50 rounded-t-xl">
                <div className="flex items-center gap-6">
                    <img 
                        className="w-24 h-24 rounded-full object-cover shadow-md" 
                        src={userdata.pfp || '/logo.jpg'} 
                        alt={userdata.name || 'User Profile'}
                        onError={(e) => e.target.src = '/logo.jpg'}
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{userdata.name}</h1>
                        <p className="text-gray-600 flex items-center gap-1">
                            <University className="w-4 h-4" /> {studentdata.admissionType}
                        </p>
                        <p className="text-gray-600 flex items-center gap-1">
                            <Landmark className="w-4 h-4" /> {department.title} (CGPA: {studentdata.cgpa})
                        </p>
                        <p className="text-gray-600 flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" /> Expected Graduation: {studentdata.passOutYear}
                        </p>
                    </div>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {userdata.email}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {studentdata.phone}</p>
                    {studentdata.githubLink && (
                        <p className="flex items-center gap-2">
                            <Github className="w-4 h-4" />
                            <a href={studentdata.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                GitHub
                            </a>
                        </p>
                    )}
                    {studentdata.linkedIn && (
                        <p className="flex items-center gap-2">
                            <Linkedin className="w-4 h-4" />
                            <a href={studentdata.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                LinkedIn
                            </a>
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                <div className="col-span-1 bg-gray-50 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold mb-3">Technical Skills</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                        {studentdata.technicalSkill?.length ? (
                            studentdata.technicalSkill.map((category, index) => (
                                <li key={index}>{category.domain}: {category.name.join(', ')}</li>
                            ))
                        ) : <p>No technical skills available.</p>}
                    </ul>

                    <h2 className="text-lg font-bold mt-6 mb-3">Education</h2>
                    {studentdata.education?.length ? (
                        studentdata.education.map((year, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-semibold">{year.institute} ({year.year})</p>
                                <p className="text-gray-600">{year.title} - {year.address}</p>
                                <p className="text-gray-600">Marks: {year.marks}</p>
                            </div>
                        ))
                    ) : <p>No education details available.</p>}
                </div>

                <div className="col-span-2 p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold mb-3">About</h2>
                    <p className="text-gray-600">{studentdata.about || 'No about info available.'}</p>

                    <h2 className="text-lg font-bold mt-6 mb-3">Projects</h2>
                    {studentdata.project?.length ? (
                        studentdata.project.map((proj, i) => (
                            <div key={i} className="mb-4 border-l-4 border-gray-900 pl-4">
                                <h3 className="font-semibold text-gray-700">{proj.name}</h3>
                                <p className="text-sm text-gray-600">{proj.type}</p>
                                <p className="text-sm text-gray-600"><strong>Technologies:</strong> {proj.technologies.join(', ')}</p>
                                <p className="text-sm text-gray-600">{proj.description}</p>
                                <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View on GitHub
                                </a>
                            </div>
                        ))
                    ) : <p>No projects available.</p>}
                </div>
            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 rounded-b-xl">
                <DownloadModal documents={studentdata.studentDocument || []} />
                {session?.user?.role === 'STUDENT' && (
                    <a href={`/student/profile/edit/${session?.user?.id}`} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                        Edit Profile
                    </a>
                )}
                {session?.user?.role === 'RECRUITER' && (
                    <button 
                        onClick={() => handleShortlist(userdata.id)} 
                        className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                    >
                        Shortlist Student
                    </button>
                )}
            </div>
        </div>
    );
}
