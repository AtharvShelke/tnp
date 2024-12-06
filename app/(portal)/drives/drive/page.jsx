import DownloadModal from '@/components/dashboard/DownloadModal';
import { Github, GraduationCap, Landmark, Linkedin, Mail, Phone } from 'lucide-react';

export default function DrivePage() {
    const drive = {
        id: '213',
        title: 'TCS 2025',
        referenceNumber: '123',
        img: '/tcs.png',
        date: 'Oct 16, 2025', 
        last_date: 'Oct 30, 2025',
        job_ctc: 9,
        about: 'Tata Consultancy Services (TCS) is a global leader in IT services, consulting, and business solutions. Join TCS to embark on a journey of innovation and growth.',
        job_role: 'JDE-3',

        bond: '2 years',
        industry_type: 'IT Services and Consulting',
        job_description: 'Software Development Engineer responsible for designing, developing, and maintaining enterprise applications using modern technologies.',
        job_location: 'Mumbai, India',
        job_eligibility: 'Minimum 6 CGPA, no active backlogs, and proficiency in programming languages like Java, Python, or C++.',
        rounds: [
            'Online Aptitude Test',
            'Technical Interview',
            'Managerial Round',
            'HR Interview',
        ],
        departments: [
            'Computer Science Engineering',
            'Robotics and Artificial Intelligence',
            'Electrical and Computer Engineering',
            'Electronics and Computer Engineering',
        ],
        shared_on_date: 'Oct 1, 2025',
        application_link: 'https://careers.tcs.com/apply',
    };




    return (
        <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
            <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                    <img
                        className="w-30 h-24  object-contain"
                        src={drive.img}
                        alt="Profile"
                    />
                    <div className="font-medium">
                        <div className="font-bold text-xl">
                            {drive.title}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            {drive.industry_type}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            {drive.referenceNumber}
                        </div>


                    </div>

                </div>
                <div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <a href={drive.application_link} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Download
                        </a>
                        <a href={drive.application_link} className="border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                            Apply
                        </a>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-bold mb-2">Job Location</h2>
                    <p className="text-gray-600">{drive.job_location}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Job Role</h2>
                    <p className="text-gray-600">{drive.job_role}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Job CTC</h2>
                    <p className="text-gray-600">{drive.job_ctc}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Bond requirement</h2>
                    <p className="text-gray-600">{drive.bond}</p>
                    <h2 className="text-lg font-bold mt-6 mb-2">Departments</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                        {drive.departments.map((round, i) => (
                            <li key={i}>{round}</li>
                        ))}
                    </ul>
                    <h2 className="text-lg font-bold mt-6 mb-2">Rounds</h2>
                    <ul className="list-disc ml-6 text-gray-600">
                        {drive.rounds.map((round, i) => (
                            <li key={i}>{round}</li>
                        ))}
                    </ul>

                </div>
                <div className="relative col-span-2 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">Last Date</h2>
                    <p className="text-gray-600">{drive.last_date}</p>
                    <h2 className="text-lg font-bold my-3">About</h2>
                    <p className="text-gray-600">{drive.about}</p>
                    <h2 className="text-lg font-bold my-3">Job Description</h2>
                    <p className="text-gray-600">{drive.job_description}</p>
                    <h2 className="text-lg font-bold my-3">Job Eligibility</h2>
                    <p className="text-gray-600">{drive.job_eligibility}</p>
                    

                </div>

            </div>
        </div>
    );
}
