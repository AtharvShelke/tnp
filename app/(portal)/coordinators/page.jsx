'use client';

import CoordinatorReq from '@/components/dashboard/CoordinatorReq';
import CoordinatorTable from '@/components/dashboard/CoordinatorTable';
import Loader from '@/components/Loader';
import { getRequest } from '@/lib/apiRequest';
import { useEffect, useState } from 'react';

export default function AllCoordinatorsPage() {
  const [requests, setRequests] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reqColumns = ['id', 'name', 'email', 'status'];
  const coordinatorColumns = ['id', 'name', 'department', 'phoneNo', 'email'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch both coordinator requests and coordinators in parallel
        const [requestsData, coordinatorsData] = await Promise.all([
          getRequest('coordinatorApproval'),
          getRequest('coordinator'),
        ]);

        // Fetch user data for requests in one batch
        const userRequests = await Promise.all(
          requestsData.map((req) => getRequest(`user/${req.userId}`))
        );

        // Map request data with user info
        const mappedRequests = requestsData.map((req, index) => ({
          id: req.userId,
          name: userRequests[index]?.name || 'N/A',
          email: userRequests[index]?.email || 'N/A',
          status: req.status,
        }));

        setRequests(mappedRequests);

        // Fetch all user and department data in one batch for coordinators
        const userResponses = await Promise.all(
          coordinatorsData.map((coordinator) => getRequest(`user/${coordinator.userId}`))
        );
        const departmentResponses = await Promise.all(
          coordinatorsData.map((coordinator) => getRequest(`departments/${coordinator.departmentId}`))
        );

        // Map coordinator data
        const mappedCoordinators = coordinatorsData.map((coordinator, index) => ({
          id: coordinator.userId,
          name: userResponses[index]?.name || 'N/A',
          email: userResponses[index]?.email || 'N/A',
          phoneNo: coordinator.phone || 'N/A',
          department: departmentResponses[index]?.title || 'Unknown',
        }));

        setCoordinators(mappedCoordinators);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="py-12 px-10">
      <h1 className="font-bold text-xl mb-5">Coordinator Requests</h1>
      <CoordinatorReq columns={reqColumns} data={requests} />

      <h1 className="font-bold text-xl my-5">All Coordinators</h1>
      <CoordinatorTable columns={coordinatorColumns} data={coordinators} setCoordinatorData={setCoordinators} />
    </div>
  );
}
