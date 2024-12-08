import DownloadModal from '@/components/dashboard/DownloadModal';
import { Github, GraduationCap, Landmark, Linkedin, Mail, Phone } from 'lucide-react';
import React from 'react';

export default function StudentProfilePage() {
    const student = {
        FIRST_NAME: 'John',
        LAST_NAME: 'Doe',
        profile:
            'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        EMAIL: 'johndoe@gmail.com',
        department: 'Computer Science',
        Pass_out_Year: 2026,
        education: [
            {
                board: 'SSC',
                address: 'Chh. Sambhajinagar',
                institute: 'XYZ Public School',
                marks: 90,
                year: 2020,
            },
            {
                board: 'HSC',
                institute: 'ABC College',
                marks: 90,
                year: 2022,
                address: 'Chh. Sambhajinagar',
            },

        ],


        college: 'JNEC',
        college_address: 'Chh. Sambhajinagar',
        CGPA: 9.0,

        other_interests: 'Hiking, Riding, Reading',
        technicalSkills: [
            {
                category: 'Programming Languages',
                skills: ['Java', 'Python', 'C++', 'JavaScript'],
            },
            {
                category: 'Web Development',
                skills: ['HTML', 'CSS', 'React.js', 'Node.js', 'Express.js'],
            },
            {
                category: 'Database Management',
                skills: ['MySQL', 'MongoDB', 'PostgreSQL'],
            },
        ],
        about:
            'Dedicated and results-driven final-year Computer Science Engineering student with a CGPA of 9.0. Proficient in programming languages (Java, Python, JavaScript), web development (React.js, Node.js), and database management (MySQL, MongoDB).',
        projects: [
            {
                type: 'Major',
                name: 'E-commerce Platform',
                description:
                    'Developed a full-stack e-commerce platform with user authentication, product management, and payment gateway integration.',
                technologies: ['React.js', 'Node.js', 'MongoDB', 'Stripe API'],
                role: 'Full Stack Developer',
                githubLink: 'https://github.com/username/ecommerce-platform',
            },
            {
                type: 'Minor',
                name: 'Weather App',
                description:
                    'Built a web application that provides real-time weather updates using the OpenWeather API.',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
                role: 'Full Stack Developer',
                githubLink: 'https://github.com/username/weather-app',
            },
        ],
        phone: 8275334604,
        github: 'github.com/johndoe',
        linkedIn: 'linkedIn.com/johndoe',
        documents: [
            {
                title: 'X_Marksheet',
                link: '#'
            },
            {
                title: 'XII_Marksheet',
                link: '#'
            },
            {
                title: 'Sem1_Marksheet',
                link: '#'
            },
            {
                title: 'Sem2_Marksheet',
                link: '#'
            },
            {
                title: 'Sem3_Marksheet',
                link: '#'
            },
            {
                title: 'Sem4_Marksheet',
                link: '#'
            },
            {
                title: 'Sem5_Marksheet',
                link: '#'
            },
            {
                title: 'Sem6_Marksheet',
                link: '#'
            },
        ]
    };

    return (
        <div className="border max-w-screen-xl my-5 mx-5 rounded-xl shadow-lg bg-white">
            <div className="flex items-center justify-between py-5 px-6 border-b bg-gray-50">
                <div className="flex items-center gap-4">
                    <img
                        className="w-24 h-24 rounded-full object-cover"
                        src={student.profile}
                        alt="Profile"
                    />
                    <div className="font-medium">
                        <div className="font-bold text-xl">
                            {student.FIRST_NAME} {student.LAST_NAME}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            <Mail className="w-4 h-4" />
                            {student.EMAIL}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            <Landmark className="w-4 h-4" />
                            {student.department}
                        </div>
                        <div className="text-sm text-gray-600 flex gap-1 items-center">
                            <GraduationCap className="w-4 h-4" />
                            Expected Graduation: {student.Pass_out_Year}
                        </div>

                    </div>

                </div>
                <div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Phone className="w-4 h-4" />
                        {student.phone}
                    </div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Github className="w-4 h-4" />
                        <a
                            href={student.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm cursor-pointer"
                        >
                            {student.github}
                        </a>
                    </div>
                    <div className="text-sm text-gray-600 flex gap-1 items-center">
                        <Linkedin className="w-4 h-4" />
                        <a
                            href={student.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm flex items-center cursor-pointer"
                        >
                            {student.linkedIn}
                        </a>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 border-r bg-gray-50 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">Technical Skills</h2>
                    {student.technicalSkills.map((category, index) => (
                        <div key={index} className="mb-4">
                            <h3 className="font-semibold text-gray-700">{category.category}</h3>
                            <ul className="list-disc ml-6 text-gray-600">
                                {category.skills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <h2 className="text-lg font-bold mt-6 mb-3">Education</h2>
                    {student.education.map((year, i) => (
                        <div key={i}>
                            <div className=' font-semibold w-[90%] flex justify-between mt-3'><h1>{year.institute}</h1><h1>{year.year}</h1></div>
                            <div className=' font-light w-[90%] flex justify-between text-gray-600'><h1>{year.board}</h1><h1>{year.address}</h1></div>
                            <p className="text-gray-600">{year.marks}</p>
                        </div>
                    ))}

                    <div className='font-semibold w-[90%] flex justify-between mt-3'><h1>{student.college}</h1></div>
                    <div className=' font-light w-[90%] flex justify-between text-gray-600'><h1>{student.college_address}</h1></div>
                    <p className="text-gray-600">{student.CGPA}</p>

                    <h2 className="text-lg font-bold mt-6 mb-3">Other Interests</h2>
                    <p className="text-gray-600">{student.other_interests}</p>
                </div>
                <div className="relative col-span-2 px-6 py-4">
                    <h2 className="text-lg font-bold mb-3">About</h2>
                    <p className="text-gray-600">{student.about}</p>
                    <h2 className="text-lg font-bold mt-6 mb-3">Projects</h2>
                    {student.projects.map((project, i) => (
                        <div key={i} className="mb-4">
                            <h3 className="font-semibold text-gray-700">{project.name}</h3>
                            <p className="text-sm text-gray-600">{project.description}</p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Technologies:</span>{' '}
                                {project.technologies.join(', ')}
                            </p>
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View on GitHub
                            </a>
                        </div>
                    ))}
                    <a href='/student/profile/edit' className=" absolute bottom-4 right-10 border border-gray-900 px-4 py-2 rounded-md text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
                        Edit Profile
                    </a>
                    <DownloadModal className='absolute bottom-4 ' documents={student.documents} />
                </div>

            </div>
        </div>
    );
}
