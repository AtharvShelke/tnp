import CoordinatorTable from '@/components/dashboard/CoordinatorTable';
import DataTable from '@/components/dashboard/StudentTable'


export default function AllCoordinatorsPage() {
  const columns = ['Coordinator ID','Name', 'Phone no.', 'Email','Institute','Branch']
  
  const coordinators = [
    {
      Coordinator_ID: 'C001',
      Name: 'Rajesh Kumar',
      Phone_no: '9876543210',
      Email: 'rajesh.kumar@example.com',
      Institute: 'ABC Institute of Technology',
      Branch: 'Computer Science'
    },
    {
      Coordinator_ID: 'C002',
      Name: 'Priya Sharma',
      Phone_no: '8765432109',
      Email: 'priya.sharma@example.com',
      Institute: 'XYZ College of Engineering',
      Branch: 'Electronics'
    },
    {
      Coordinator_ID: 'C003',
      Name: 'Anil Mehta',
      Phone_no: '7654321098',
      Email: 'anil.mehta@example.com',
      Institute: 'PQR Engineering University',
      Branch: 'Mechanical'
    }
  ];
  return (
    <div className='py-12 px-10'>
      <h1 className='font-bold text-xl mb-5'>All Coordinators</h1>
      <CoordinatorTable columns={columns} data={coordinators}/>
    </div>
  )
}
