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

export default function AllStudentsPage() {
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [graduationYearFilter, setGraduationYearFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [placedFilter, setPlacedFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const userRole = session?.user?.role;

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const students = await getRequest("student");
        console.log("STUDENT_DATA", (students));

        // Extract unique departments from student data
        const deptMap = new Map();
        students.forEach(student => {
          if (student.department && !deptMap.has(student.department.id)) {
            deptMap.set(student.department.id, {
              id: student.department.id,
              title: student.department.title
            });
          }
        });
        setDepartments(Array.from(deptMap.values()));

        const combinedData = students.map(student => ({
          userId: student.userId,
          prn: student.PRN,
          name: student?.user?.name || 'N/A',
          department: student?.department?.title || 'Unknown',
          dob: formDateFromString(student.dob),
          gender: student.gender,
          email: student.user?.email || 'N/A',
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
          pfp: student.user?.pfp || '/default-avatar.png',
          technicalSkills: student.technicalSkill,
          education: student.education,
          projects: student.project,
          documents: student.studentDocument
        }));

        setStudentData(combinedData);
        setFilteredData(combinedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

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

    if (graduationYearFilter) {
      filtered = filtered.filter(student => student.passOutYear.toString() === graduationYearFilter);
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
  }, [searchQuery, cgpaFilter, departmentFilter, graduationYearFilter, placedFilter, studentData]);

  const handleDownload = () => {
    const dataToExport = filteredData.map(({ prn, name, dob, department, gender, email, phone, address, admissionType, passOutYear, cgpa, liveBacklogs, deadBacklogs, yearGap, preference1, preference2, preference3, placed }) => ({
      prn, name, dob, department, gender, email, phone, address, admissionType, passOutYear, cgpa, liveBacklogs, deadBacklogs, yearGap, preference1, preference2, preference3, placed
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'students.xlsx');
  };

  // Get unique graduation years for the filter dropdown
  const graduationYears = useMemo(() => {
    const years = new Set();
    studentData.forEach(student => {
      if (student.passOutYear) {
        years.add(student.passOutYear);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [studentData]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Students</h1>

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
            step="0.1"
            min="0"
            max="10"
          />

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border rounded-lg p-2 text-gray-800 w-40"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.title}>{dept.title}</option>
            ))}
          </select>

          <select
            value={graduationYearFilter}
            onChange={(e) => setGraduationYearFilter(e.target.value)}
            className="border rounded-lg p-2 text-gray-800 w-40"
          >
            <option value="">All Years</option>
            {graduationYears.map(year => (
              <option key={year} value={year}>{year}</option>
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
          
          <button
            onClick={() => setViewMode(viewMode === 'card' ? 'admin' : 'card')}
            className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all shadow-md"
          >
            {viewMode === 'card' ? <Table className="w-5 h-5 mr-2" /> : <LayoutGrid className="w-5 h-5 mr-2" />}
            {viewMode === 'card' ? 'Table View' : 'Card View'}
          </button>

          {(userRole === 'ADMIN' || userRole === 'COORDINATOR') && (
            <button
              onClick={handleDownload}
              className="flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all shadow-md"
            >
              <Download className="w-5 h-5 mr-2" />
              Download
            </button>
          )}
        </div>
      </div>

      {/* Toggle Between Views */}
      {viewMode === 'admin' ? (
        <DataTable 
          columns={['prn', 'name', 'dob', 'department', 'gender', 'email', 'phone', 'address', 'cgpa', 'admissionType', 'passOutYear', 'liveBacklogs', 'deadBacklogs', 'yearGap', 'preference1', 'preference2', 'preference3', 'placed']} 
          data={filteredData} 
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((student) => (
              <div
                key={student.userId}
                className="bg-white p-6 pb-16 rounded-2xl shadow-lg border border-gray-200 flex flex-col transition duration-200 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-100 opacity-20 rounded-2xl pointer-events-none" />

                <img
                  src={student.pfp}
                  alt={student.name}
                  className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white mx-auto transition group-hover:scale-105"
                />

                <h2 className="text-lg font-bold text-gray-800 mt-4 text-center">{student.name}</h2>
                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <University className="w-5 h-5 text-gray-500" /> {student.department}
                </p>

                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  CGPA: <span className="font-semibold text-gray-800">{student.cgpa}</span>
                </p>

                <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  Graduation: <span className="font-semibold text-gray-800">{student.passOutYear}</span>
                </p>

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