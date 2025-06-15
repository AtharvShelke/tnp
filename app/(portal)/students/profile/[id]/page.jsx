'use client';

import DownloadModal from '@/components/dashboard/DownloadModal';
import Loader from '@/components/Loader';
import { getRequest, makePostRequest } from '@/lib/apiRequest';
import { Github, GraduationCap, Landmark, Linkedin, Mail, Phone, University, Check } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function StudentProfilePage1() {
    const params = useParams();
    const { id } = params;
    const [studentdata, setStudentdata] = useState({});
    const [isShortlisted, setIsShortlisted] = useState(false);
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const student = await getRequest(`student/${id}`);
                setStudentdata(student);

                if (session?.user?.role === 'RECRUITER' && student.user?.ShortlistedStudents) {
                    const recruiterId = session.user.id;
                    const isShortlisted = student.user.ShortlistedStudents.some(
                        shortlist => shortlist.recruiterId === recruiterId
                    );
                    setIsShortlisted(isShortlisted);
                }
            } catch (error) {
                toast.error('Failed to fetch student details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudentDetails();
        }
    }, [id, session]);

    const handleShortlist = async (studentId) => {
        try {
            setLoading(true);
            const recruiterId = session?.user?.id;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/shortlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ studentId, recruiterId }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || "Failed to shortlist student");
            }
    
            toast.success("Student shortlisted successfully!");
            setIsShortlisted(true);
        } catch (error) {
            console.error("Shortlisting error:", error);
            toast.error(error.message || "Failed to shortlist student");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-6xl mx-auto my-10 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Profile Header */}
            <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="relative">
                        <img 
                            src={studentdata?.user?.pfp || '/default-avatar.png'} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md" 
                            onError={(e) => e.target.src = '/default-avatar.png'}
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{studentdata?.user?.name}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <University className="w-4 h-4" /> {studentdata.admissionType}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <Landmark className="w-4 h-4" /> {studentdata?.department?.title}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <GraduationCap className="w-4 h-4" /> Expected {studentdata.passOutYear}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {studentdata.githubLink && (
                                    <a href={studentdata.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                        <Github className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                                    </a>
                                )}
                                {studentdata.linkedIn && (
                                    <a href={studentdata.linkedIn} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                        <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                                <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                {studentdata?.user?.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                                <Phone className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                                {studentdata.phone || 'Not provided'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Academic Summary */}
            <div className="px-8 py-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">CGPA</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">{studentdata.cgpa || 'N/A'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Backlogs</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {studentdata.liveBack || 0} Live, {studentdata.deadBack || 0} Dead
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Year Gap</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">{studentdata.yearGap || 0} year(s)</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Status</p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {studentdata.placed ? (
                                <span className="text-green-600 dark:text-green-400">Placed</span>
                            ) : (
                                <span className="text-amber-600 dark:text-amber-400">Not Placed</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-6">
                {/* About Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">About</h2>
                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                        <p className="text-zinc-700 dark:text-zinc-300">{studentdata.about || 'No about info available.'}</p>
                    </div>
                </div>

                {/* Technical Skills */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">Technical Skills</h2>
                    <div className="space-y-4">
                        {studentdata.technicalSkill?.length ? (
                            studentdata.technicalSkill.map((category, index) => (
                                <div key={index} className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                                    <h4 className="font-medium text-zinc-900 dark:text-white mb-2">{category.domain}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {category.name.map((skill, i) => (
                                            <span key={i} className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-zinc-500 dark:text-zinc-400">No technical skills available.</p>}
                    </div>
                </div>

                {/* Education */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">Education</h2>
                    <div className="space-y-6">
                        {studentdata.education?.length ? (
                            studentdata.education.map((year, i) => (
                                <div key={i} className="relative pl-8 pb-6 border-l-2 border-blue-200 dark:border-blue-900">
                                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500"></div>
                                    <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-zinc-900 dark:text-white">{year.institute}</h3>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">{year.title}</p>
                                            </div>
                                            <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                                {year.year}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{year.address}</p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Marks: {year.marks}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-zinc-500 dark:text-zinc-400">No education details available.</p>}
                    </div>
                </div>

                {/* Projects */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">Projects</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {studentdata.project?.length ? (
                            studentdata.project.map((proj, i) => (
                                <div key={i} className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-xl border-l-4 border-blue-600 dark:border-blue-500">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-zinc-900 dark:text-white">{proj.name}</h3>
                                            <p className="text-sm text-blue-600 dark:text-blue-400">{proj.type}</p>
                                        </div>
                                        {proj.githubLink && (
                                            <a 
                                                href={proj.githubLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-xs bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                                            >
                                                <Github className="w-3 h-3" /> View
                                            </a>
                                        )}
                                    </div>
                                    
                                    <div className="mt-3">
                                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{proj.description}</p>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Technologies</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.technologies.map((tech, j) => (
                                                <span key={j} className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-full">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : <p className="text-zinc-500 dark:text-zinc-400">No projects available.</p>}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex justify-between items-center">
                <DownloadModal documents={studentdata.studentDocument || []} />
                {session?.user?.role === 'STUDENT' && (
                    <a 
                        href={`/student/profile/edit/${session?.user?.id}`} 
                        className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        Edit Profile
                    </a>
                )}
                {session?.user?.role === 'RECRUITER' && (
                    <button 
                        onClick={() => !isShortlisted && handleShortlist(studentdata.userId)} 
                        disabled={isShortlisted}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                            isShortlisted 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white'
                        }`}
                    >
                        {isShortlisted ? (
                            <>
                                <Check className="w-5 h-5" />
                                Shortlisted
                            </>
                        ) : (
                            'Shortlist Student'
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}