import StudentApprovalCard from '@/components/dashboard/StudentApprovalCard'
import React from 'react'

const data = [
  {
    id: 1,
    name: "Student",
    prn:"202201103093",
    pfp: "/logo.jpg",
    existingValues: {
      cgpa: "7",
      phone: "8375334604",
      address: "xyz",
    },
    changes: {
      cgpa: "8",
      phone: "8275334604",
      address: "abc",
    },
  },
  {
    id: 2,
    name: "Student",
    pfp: "/logo.jpg",
    prn:"202201103096",
    existingValues: {
        address: "xyz",
        email: "abc@gmail.com",
        passOutYear: "2026",
    },
    changes: {
      address: "abc",
      email: "xyz@gmail.com",
      passOutYear: "2027",
    },
  },

  {
    id: 2,
    name: "Student",
    pfp: "/logo.jpg",
    prn:"202201103096",
    existingValues: {
        address: "xyz",
        email: "abc@gmail.com",
        passOutYear: "2026",
    },
    changes: {
      address: "abc",
      email: "xyz@gmail.com",
      passOutYear: "2027",
    },
  },
  {
    id: 2,
    name: "Student",
    pfp: "/logo.jpg",
    prn:"202201103096",
    existingValues: {
        address: "xyz",
        email: "abc@gmail.com",
        passOutYear: "2026",
    },
    changes: {
      address: "abc",
      email: "xyz@gmail.com",
      passOutYear: "2027",
    },
  },
  {
    id: 2,
    name: "Student",
    pfp: "/logo.jpg",
    prn:"202201103096",
    existingValues: {
        address: "xyz",
        email: "abc@gmail.com",
        passOutYear: "2026",
    },
    changes: {
      address: "abc",
      email: "xyz@gmail.com",
      passOutYear: "2027",
    },
  },
  {
    id: 2,
    name: "Student",
    pfp: "/logo.jpg",
    prn:"202201103096",
    existingValues: {
        address: "xyz",
        email: "abc@gmail.com",
        passOutYear: "2026",
    },
    changes: {
      address: "abc",
      email: "xyz@gmail.com",
      passOutYear: "2027",
    },
  },
]

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Student Requests</h1>
          <p className="mt-2 text-sm text-gray-600">Review and manage student profile updates</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((student, i) => (
            <StudentApprovalCard
              id={student.id}
              prn={student.prn}
              name={student.name}
              pfp={student.pfp}
              existingValues={student.existingValues}
              changes={student.changes}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page
