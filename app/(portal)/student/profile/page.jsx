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
        <div className="max-w-6xl mx-auto my-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900">
                <div className="flex items-center gap-6">
                    <img src={userdata.pfp || '/logo.jpg'} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                    <div>
                        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">{userdata.name}</h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1"><University className="w-4 h-4" /> {studentdata.admissionType}</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1"><Landmark className="w-4 h-4" /> {department} (CGPA: {studentdata.cgpa})</p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1"><GraduationCap className="w-4 h-4" /> Expected Graduation: {studentdata.passOutYear}</p>
                    </div>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {userdata.email}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {studentdata.phone}</p>
                    {studentdata.githubLink && <p className="flex items-center gap-2"><Github className="w-4 h-4" /> <a href={studentdata.githubLink} className="text-blue-600 hover:underline">GitHub</a></p>}
                    {studentdata.linkedIn && <p className="flex items-center gap-2"><Linkedin className="w-4 h-4" /> <a href={studentdata.linkedIn} className="text-blue-600 hover:underline">LinkedIn</a></p>}
                </div>
            </div>

            <div className="border-b border-zinc-200 dark:border-zinc-700 px-6">
                <nav className="flex space-x-8 overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium transition-all duration-200 text-sm ${activeTab === tab.id
                                ? 'border-zinc-900 text-zinc-900 dark:text-white dark:border-white'
                                : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 dark:text-zinc-400 dark:hover:text-white dark:hover:border-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="px-6 py-8 bg-white dark:bg-zinc-900">
                {renderTabContent()}
            </div>

            <div className="flex justify-between items-center px-6 py-5 border-t bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700">
                <DownloadModal documents={studentdata.studentDocument || []} />
                <a href={`/student/profile/edit/${currentUserId}`} className="bg-zinc-900 text-white px-4 py-2 rounded-md hover:bg-zinc-700 transition-all">
                    Edit Profile
                </a>
            </div>
        </div>
    );
}

const PersonalTab = ({ studentdata }) => (
    <div className="space-y-6">
        <Section title="Personal Details">
            <Item label="Date of Birth" value={studentdata.dob ? new Date(studentdata.dob).toLocaleDateString() : 'N/A'} />
            <Item label="Gender" value={studentdata.gender} />
            <Item label="Address" value={studentdata.address} />
            <Item label="Languages" value={studentdata.language?.join(', ')} />
            <Item label="Year Gap" value={`${studentdata.yearGap || 0} year(s)`} />
            <Item label="Backlogs" value={`Live: ${studentdata.liveBack || 0}, Dead: ${studentdata.deadBack || 0}`} />
            <Item label="Placement Status" value={studentdata.placed ? 'Placed' : 'Not Placed'} />
        </Section>
        <Section title="About">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{studentdata.about || 'No about info available.'}</p>
        </Section>
        <Section title="Preferences">
            <Item label="1st Preference" value={studentdata.preference1} />
            <Item label="2nd Preference" value={studentdata.preference2} />
            <Item label="3rd Preference" value={studentdata.preference3} />
        </Section>

        <Section title="Technical Skills">
            <ul className="list-disc ml-6 text-sm text-zinc-600 dark:text-zinc-400">
                {studentdata.technicalSkill?.map((category, index) => (
                    <li key={index}>{category.domain}: {category.name.join(', ')}</li>
                )) || <p>No technical skills available.</p>}
            </ul>
        </Section>

        <Section title="Other Interests">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{studentdata.otherInterests?.join(', ') || 'No interests mentioned'}</p>
        </Section>
    </div>
);

const EducationTab = ({ studentdata }) => (
    <Section title="Education">
        {studentdata.education?.map((year, i) => (
            <div key={i} className="mb-4">
                <p className="font-semibold text-zinc-700 dark:text-white">{year.institute} ({year.year})</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{year.title} - {year.address}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Marks: {year.marks}</p>
            </div>
        )) || <p>No education details available.</p>}
    </Section>
);

const ProjectsTab = ({ studentdata }) => (
    <div className="space-y-6">

        <Section title="Projects">
            {studentdata.project?.map((proj, i) => (
                <div key={i} className="mb-4 border-l-4 border-zinc-900 dark:border-white pl-4">
                    <h3 className="font-semibold text-zinc-800 dark:text-white">{proj.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{proj.type}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400"><strong>Technologies:</strong> {proj.technologies.join(', ')}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{proj.description}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400"><strong>Role:</strong> {proj.role}</p>
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View on GitHub</a>
                </div>
            )) || <p>No projects available.</p>}
        </Section>
    </div>
);

const DocumentsTab = ({ studentdata }) => (
    <Section title="Documents">
        {studentdata.studentDocument?.length > 0 ? (
            <ul className="list-disc ml-6 text-sm text-zinc-600 dark:text-zinc-400">
                {studentdata.studentDocument.map((doc, i) => (
                    <li key={i}>
                        <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {doc.title}
                        </a>
                    </li>
                ))}
            </ul>
        ) : <p>No documents uploaded.</p>}
    </Section>
);

const Section = ({ title, children }) => (
    <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">{title}</h2>
        <div className="space-y-2">{children}</div>
    </div>
);

const Item = ({ label, value }) => (
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <strong className="text-zinc-800 dark:text-white">{label}:</strong> {value || 'N/A'}
    </p>
);