'use client';

import DepartmentTable from "@/components/dashboard/DepartmentTable";
import NewHeader from "@/components/dashboard/NewHeader";
import { getRequest } from "@/lib/apiRequest";
import { useEffect, useState } from "react";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {

            try {
                const data = await getRequest('departments')
                setDepartments(data)
            } catch (error) {
                console.log(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchDepartments();

    }, []);

    const columns = ['id', 'title']
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <NewHeader title={'Department'} link={'/departments/new'} />
            <div className="px-10"> <DepartmentTable columns={columns} data={departments} /></div>
        </div>
    );
}
