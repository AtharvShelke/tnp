'use client';
import CoordinatorReq from '@/components/dashboard/CoordinatorReq';
import CoordinatorTable from '@/components/dashboard/CoordinatorTable';
import { getRequest } from '@/lib/apiRequest';
import { useEffect, useState } from 'react';
import ClipLoader from "react-spinners/ClipLoader";

export default function AllCoordinatorsPage() {


  const [req, setReq] = useState([]);
  const [userData, setUserData] = useState([]);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#324sdf");
  const [error, setError] = useState(null);

  const columns = ['id', 'name', 'department', 'phoneNo', 'email'];
  const reqColumns = ['id', 'name', 'email', 'status'];

  useEffect(() => {
    const fetchRequests = async () => {
      // coordinatorApproval
      try {

        const requests = await getRequest('coordinatorApproval')
        setReq(requests);


        if (requests.length > 0) {
          const userPromises = requests.map(async (item) => {

            const user = await getRequest(`user/${item.userId}`)
            return { ...user, status: item.status };
          });

          const usersWithStatus = await Promise.all(userPromises);
          console.log(usersWithStatus)
          setUserData(usersWithStatus);
        }
      } catch (err) {
        console.error('Error fetching requests:', err.message);
        setError(err.message);
      }
    };

    const fetchCoordinators = async () => {
      try {
        // coordinator
        const coordinators = await getRequest(`coordinator`)


        const combinedDataPromises = coordinators.map(async (coordinator) => {
          // user/${coordinator.userId}
          const userData = await getRequest(`user/${coordinator.userId}`)
          // departments/${coordinator.departmentId}
          const departmentData = await getRequest(`departments/${coordinator.departmentId}`)

          return {
            id: coordinator.userId,
            department: departmentData.title,
            phoneNo: coordinator.phone,
            email: userData.email,
            name: userData.name,
          };
        });

        const combinedData = await Promise.all(combinedDataPromises);

        setCoordinatorData(combinedData);
      } catch (err) {
        console.error('Error fetching coordinators:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
    fetchCoordinators();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <ClipLoader
        color={color}
        loading={loading}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="py-12 px-10">
      <h1 className="font-bold text-xl mb-5">Coordinator Requests</h1>
      <CoordinatorReq columns={reqColumns} data={userData} />
      <h1 className="font-bold text-xl my-5">All Coordinators</h1>
      <CoordinatorTable
        columns={columns}
        data={coordinatorData}
        setCoordinatorData={setCoordinatorData} // Pass state updater
      />
    </div>
  );
}
