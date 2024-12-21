'use client';
import CoordinatorReq from '@/components/dashboard/CoordinatorReq';
import CoordinatorTable from '@/components/dashboard/CoordinatorTable';
import { useEffect, useState } from 'react';

export default function AllCoordinatorsPage() {
  const [req, setReq] = useState([]);
  const [userData, setUserData] = useState([]);
  const [coordinatorData, setCoordinatorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = ['id', 'name', 'department', 'phoneNo', 'email'];
  const reqColumns = ['id', 'name', 'email', 'status'];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store',
            Pragma: 'no-cache',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const requests = await response.json();
        setReq(requests);

        // Fetch user data for all requests
        if (requests.length > 0) {
          const userPromises = requests.map(async (item) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${item.userId}`, {
              method: 'GET',
              headers: {
                'Cache-Control': 'no-store',
                Pragma: 'no-cache',
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const user = await response.json();
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
        
        const coordinatorResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinator`, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-store',
            "Pragma": 'no-cache',
          },
        });
        if (!coordinatorResponse.ok) {
          throw new Error(`HTTP error! Status: ${coordinatorResponse.status}`);
        }
        const coordinators = await coordinatorResponse.json();

        
        const combinedDataPromises = coordinators.map(async (coordinator) => {
          const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${coordinator.userId}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-store',
              Pragma: 'no-cache',
            },
          });
          if (!userResponse.ok) {
            throw new Error(`HTTP error! Status: ${userResponse.status}`);
          }
          const userData = await userResponse.json();
          const departmentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments/${coordinator.departmentId}`, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-store',
              Pragma: 'no-cache',
            },
          })
          if (!departmentResponse.ok) {
            throw new Error(`HTTP error! Status: ${departmentResponse.status}`);
          }
          const departmentData = await departmentResponse.json();

          return {
            id: coordinator.id,
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="py-12 px-10">
      <h1 className="font-bold text-xl mb-5">Coordinator Requests</h1>
      <CoordinatorReq columns={reqColumns} data={userData} />
      <h1 className="font-bold text-xl my-5">All Coordinators</h1>
      <CoordinatorTable columns={columns} data={coordinatorData} />
    </div>
  );
}
