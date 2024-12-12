'use client';
import CoordinatorReq from '@/components/dashboard/CoordinatorReq';
import CoordinatorTable from '@/components/dashboard/CoordinatorTable';
import { useEffect, useState } from 'react';

export default function AllCoordinatorsPage() {
  const [req, setReq] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = ['coordinatorId', 'name', 'phoneNo', 'email', 'branch'];
  const reqColumns = ['id', 'name', 'email', 'status'];

  const coordinators = [
    {
      coordinatorId: 'C001',
      name: 'Rajesh Kumar',
      phoneNo: '9876543210',
      email: 'rajesh.kumar@example.com',
      institute: 'ABC Institute of Technology',
      branch: 'Computer Science',
    },
    {
      coordinatorId: 'C002',
      name: 'Priya Sharma',
      phoneNo: '8765432109',
      email: 'priya.sharma@example.com',
      institute: 'XYZ College of Engineering',
      branch: 'Electronics',
    },
    {
      coordinatorId: 'C003',
      name: 'Anil Mehta',
      phoneNo: '7654321098',
      email: 'anil.mehta@example.com',
      institute: 'PQR Engineering University',
      branch: 'Mechanical',
    },
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetch coordinator approval requests
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
          setUserData(usersWithStatus);
        }
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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
      <CoordinatorTable columns={columns} data={coordinators} />
    </div>
  );
}
