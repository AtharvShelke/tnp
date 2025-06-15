'use client';

import DownloadModal from '@/components/dashboard/DownloadModal';
import { getRequest } from '@/lib/apiRequest';
import { Github, GraduationCap, Landmark, Linkedin, Mail, Phone, University } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
    const [userdata, setUserdata] = useState({});
    const [studentdata, setStudentdata] = useState({});
    const [department, setDepartment] = useState();
    const [activeTab, setActiveTab] = useState('personal');

    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const data = await getRequest(`user/${currentUserId}`);
                setUserdata(data);
            } catch (error) {
                toast.error('Failed to fetch user details');
            }
        };
        const fetchStudentDetails = async () => {
            try {
                const data = await getRequest(`student/${currentUserId}`);
                setDepartment(data.department.title)
                setStudentdata(data);
            } catch (error) {
                toast.error('Failed to fetch student details');
            }
        };
        if (currentUserId) {
            fetchUserDetails();
            fetchStudentDetails();
        }
    }, [currentUserId]);

    const tabs = [
        { id: 'personal', label: 'Personal' },
        { id: 'education', label: 'Education' },
        { id: 'projects', label: 'Projects' },
        { id: 'documents', label: 'Documents' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'personal':
                return <PersonalTab studentdata={studentdata} />;
            case 'education':
                return <EducationTab studentdata={studentdata} />;
            case 'projects':
                return <ProjectsTab studentdata={studentdata} />;
            case 'documents':
                return <DocumentsTab studentdata={studentdata} />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Profile Header */}
            <div className="px-8 py-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="relative">
                        <img 
                            src={userdata.pfp || '/default-avatar.png'} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md" 
                        />
                        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white dark:border-zinc-800"></div>
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{userdata.name}</h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <University className="w-4 h-4" /> {studentdata.admissionType}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        <Landmark className="w-4 h-4" /> {department}
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
                                {userdata.email}
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
                {/* Tabs */}
                <div className="mb-6">
                    <nav className="flex space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg">
                    {renderTabContent()}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex justify-between items-center">
                <DownloadModal documents={studentdata.studentDocument || []} />
                <a 
                    href={`/student/profile/edit/${currentUserId}`} 
                    className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                    Edit Profile
                </a>
            </div>
        </div>
    );
}

const PersonalTab = ({ studentdata }) => (
    <div className="space-y-8">
        <Section title="Personal Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard label="Date of Birth" value={studentdata.dob ? new Date(studentdata.dob).toLocaleDateString() : 'N/A'} />
                <InfoCard label="Gender" value={studentdata.gender} />
                <InfoCard label="Languages" value={studentdata.language?.join(', ')} />
                <InfoCard label="Placement Status" value={
                    studentdata.placed ? (
                        <span className="text-green-600 dark:text-green-400">Placed</span>
                    ) : (
                        <span className="text-amber-600 dark:text-amber-400">Not Placed</span>
                    )
                } />
            </div>
        </Section>

        <Section title="Address">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300">{studentdata.address || 'No address provided'}</p>
            </div>
        </Section>

        <Section title="About">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                <p className="text-zinc-700 dark:text-zinc-300">{studentdata.about || 'No about info available.'}</p>
            </div>
        </Section>

        <Section title="Preferences">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PreferenceCard 
                    title="1st Preference" 
                    value={studentdata.preference1} 
                    highlight={true}
                />
                <PreferenceCard 
                    title="2nd Preference" 
                    value={studentdata.preference2} 
                />
                <PreferenceCard 
                    title="3rd Preference" 
                    value={studentdata.preference3} 
                />
            </div>
        </Section>

        <Section title="Technical Skills">
            <div className="space-y-4">
                {studentdata.technicalSkill?.map((category, index) => (
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
                )) || <p className="text-zinc-500 dark:text-zinc-400">No technical skills available.</p>}
            </div>
        </Section>

        <Section title="Other Interests">
            <div className="flex flex-wrap gap-2">
                {studentdata.otherInterests?.map((interest, i) => (
                    <span key={i} className="text-xs bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded-full">
                        {interest}
                    </span>
                )) || <p className="text-zinc-500 dark:text-zinc-400">No interests mentioned</p>}
            </div>
        </Section>
    </div>
);

const EducationTab = ({ studentdata }) => (
    <Section title="Education History">
        <div className="space-y-6">
            {studentdata.education?.map((year, i) => (
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
            )) || <p className="text-zinc-500 dark:text-zinc-400">No education details available.</p>}
        </div>
    </Section>
);

const ProjectsTab = ({ studentdata }) => (
    <div className="space-y-8">
        <Section title="Projects">
            <div className="grid grid-cols-1 gap-6">
                {studentdata.project?.map((proj, i) => (
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
                        
                        <div className="mt-4">
                            <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Role</h4>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{proj.role}</p>
                        </div>
                    </div>
                )) || <p className="text-zinc-500 dark:text-zinc-400">No projects available.</p>}
            </div>
        </Section>
    </div>
);

const DocumentsTab = ({ studentdata }) => (
    <Section title="Documents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentdata.studentDocument?.length > 0 ? (
                studentdata.studentDocument.map((doc, i) => (
                    <div key={i} className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-zinc-900 dark:text-white">{doc.title}</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Uploaded document</p>
                        </div>
                        <a 
                            href={doc.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                        >
                            View
                        </a>
                    </div>
                ))
            ) : (
                <p className="text-zinc-500 dark:text-zinc-400">No documents uploaded.</p>
            )}
        </div>
    </Section>
);

const Section = ({ title, children }) => (
    <div className="mb-8 last:mb-0">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">{title}</h2>
        {children}
    </div>
);

const InfoCard = ({ label, value }) => (
    <div>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{label}</p>
        <p className="text-zinc-900 dark:text-white font-medium mt-1">{value || 'N/A'}</p>
    </div>
);

const PreferenceCard = ({ title, value, highlight = false }) => (
    <div className={`p-4 rounded-lg border ${highlight ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800'}`}>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</p>
        <p className={`mt-1 font-medium ${highlight ? 'text-blue-700 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
            {value || 'Not specified'}
        </p>
    </div>
);