'use client'
import DataTable from '@/components/dashboard/StudentTable';
import { getRequest } from '@/lib/apiRequest';
import formDateFromString from '@/lib/formDateFromString';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { GraduationCap, Mail, Phone, University, Search, Download, LayoutGrid, Table } from 'lucide-react';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function ShortlistPage() {
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [depts, setDepts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [placedFilter, setPlacedFilter] = useState('');
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchShortlistData = async () => {
      try {
        let shortlistData = [];
        if (userRole === "ADMIN" || userRole === "COORDINATOR") {
          shortlistData = await getRequest(`shortlist`);
        } else if (userRole === 'RECRUITER') {
          shortlistData = await getRequest(`shortlist/${userId}`);
        }

        // Process the shortlist data to extract student information
        const processedData = shortlistData.map(item => {
          const student = item.user.Student[0];
          const department = student.department;
          
          // Add department to departments list if not already present
          setDepts(prev => {
            const exists = prev.some(d => d.id === department.id);
            return exists ? prev : [...prev, department];
          });

          return {
            userId: item.userId,
            prn: student.PRN,
            name: item.user.name,
            department: department.title,
            dob: formDateFromString(student.dob),
            gender: student.gender,
            email: item.user.email,
            phone: student.phone,
            address: student.address,
            cgpa: student.cgpa,
            yearGap: student.yearGap,
            liveBacklogs: student.liveBack,
            deadBacklogs: student.deadBack,
            admissionType: student.admissionType,
            passOutYear: student.passOutYear,
            preference1: student.preference1,
            preference2: student.preference2,
            preference3: student.preference3,
            placed: student.placed,
            pfp: item.user.pfp || '/default-avatar.png',
          };
        });

        setStudentData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error("Error fetching shortlist data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShortlistData();
  }, [userId, userRole]);

  // Function to handle filtering
  const applyFilters = () => {
    let filtered = studentData.filter((student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.cgpa.toString().includes(searchQuery)
    );

    if (cgpaFilter) {
      filtered = filtered.filter(student => student.cgpa >= parseFloat(cgpaFilter));
    }

    if (departmentFilter) {
      filtered = filtered.filter(student => student.department.toLowerCase() === departmentFilter.toLowerCase());
    }

    if (placedFilter) {
      if (placedFilter === 'placed') {
        filtered = filtered.filter(student => student.placed);
      } else if (placedFilter === 'notPlaced') {
        filtered = filtered.filter(student => !student.placed);
      }
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, cgpaFilter, departmentFilter, placedFilter, studentData]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shortlisted Students</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center bg-white p-2 rounded-lg shadow-sm w-full max-w-md">
          <Search className="w-5 h-5 text-gray-500 mx-2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full outline-none p-2"
          />
        </div>

        <div className="flex items-center gap-5">
          <input
            type="number"
            placeholder="CGPA"
            value={cgpaFilter}
            onChange={(e) => setCgpaFilter(e.target.value)}
            className="border rounded-lg p-2 text-gray-800 w-40"
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border rounded-lg p-2 text-gray-800 w-40"
          >
            <option value="">All</option>
            {depts.map((d) => (
              <option key={d.id} value={d.title}>{d.title}</option>
            ))}
          </select>
          
          <select
            value={placedFilter}
            onChange={(e) => setPlacedFilter(e.target.value)}
            className="border rounded-lg p-2 text-gray-800 w-40"
          >
            <option value="">All Students</option>
            <option value="placed">Placed</option>
            <option value="notPlaced">Not Placed</option>
          </select>
          
          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'card' ? 'admin' : 'card')}
            className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all shadow-md"
          >
            {viewMode === 'card' ? <Table className="w-5 h-5 mr-2" /> : <LayoutGrid className="w-5 h-5 mr-2" />}
            {viewMode === 'card' ? 'Table View' : 'Card View'}
          </button>
        </div>
      </div>

      {/* Toggle Between Views */}
      {viewMode === 'admin' ? (
        <DataTable columns={['prn', 'name', 'dob', 'department', 'gender', 'email', 'phone', 'address', 'cgpa', 'admissionType', 'passOutYear', 'liveBacklogs', 'deadBacklogs', 'yearGap', 'preference1', 'preference2', 'preference3', 'placed']} data={filteredData} userRole={userRole}/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((student) => (
              <div
                key={student.userId}
                className="bg-white p-6 pb-16 rounded-2xl shadow-lg border border-gray-200 flex flex-col transition duration-200 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group"
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 opacity-20 rounded-2xl pointer-events-none" />

                {/* Profile Picture */}
                <img
                  src={student.pfp}
                  alt={student.name}
                  className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white mx-auto transition group-hover:scale-105"
                />

                {/* Name & Department */}
                <h2 className="text-lg font-bold text-gray-800 mt-4 text-center">{student.name}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <University className="w-5 h-5 text-gray-500" /> {student.department}
                </p>

                {/* CGPA */}
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  CGPA: <span className="font-semibold text-gray-800">{student.cgpa}</span>
                </p>

                {/* View Profile Button */}
                <Link
                  href={`/students/profile/${student.userId}`}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4/5 bg-gray-900 text-white py-2 text-center rounded-lg hover:bg-gray-700 transition font-medium shadow-md group-hover:scale-105"
                >
                  View Profile
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No students found.</p>
          )}
        </div>
      )}
    </div>
  );
}