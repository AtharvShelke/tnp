'use client';

import DepartmentTable from "@/components/dashboard/DepartmentTable";
import NewHeader from "@/components/dashboard/NewHeader";
import Loader from "@/components/Loader";
import { getRequest } from "@/lib/apiRequest";
import { useEffect, useState } from "react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getRequest('departments');
        setDepartments(data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const columns = ['title'];
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="px-4 sm:px-6 lg:px-10 h-screen"> 
      <NewHeader title={'Department'} link={'/departments/new'} />
      <div className="overflow-x-auto md:overflow-x-visible"> 
        <DepartmentTable columns={columns} data={departments} />
      </div>
    </div>
  );
}
