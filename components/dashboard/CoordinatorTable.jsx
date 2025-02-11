import { deleteRequest } from "@/lib/apiRequest"
import toast from "react-hot-toast";
import EditCoordinatorModal from "./EditCoordinatorModal";
import { useState } from "react";
import { updateRequest } from '@/lib/apiRequest';



export default function CoordinatorTable(props) {
    const [selectedCoordinator, setSelectedCoordinator] = useState(null);
     const [isModalOpen, setIsModalOpen] = useState(false);

     const handleEditClick = (coordinator) => {
        setSelectedCoordinator(coordinator);
        setIsModalOpen(true);
      };
    
      // Function to update coordinator data
      const updateCoordinatorData = async (updatedCoordinator) => {
        const result = await updateRequest(`coordinator/${updatedCoordinator.id}`, updatedCoordinator);
    
        if (result && props.setCoordinatorData) {
          props.setCoordinatorData((prevData) =>
            prevData.map((coordinator) =>
              coordinator.id === result.id ? result : coordinator
            )
          );
        }
        window.location.reload();

      };

    const handleDelete = async (id) => {
        try {
          const result = await deleteRequest(`coordinator/${id}`);
          if (result) {
            toast.success("Coordinator deleted successfully");
            window.location.reload(); // This will reload the page after the success message
          }
        } catch (error) {
          toast.error("Failed to Delete: ");
        }
      };
      

  return (
    

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
                {(props.columns).map((column,i)=>(
                    <th scope="col" key={i} className="px-6 py-3">
                    {column}
                </th>
                ))}
                
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {(props.data).map((item, i)=>(
                <tr className="odd:bg-white  even:bg-gray-50  border-b " key={i}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.id}
                </th>
                <td className="px-6 py-4">
                    {item.name}
                </td>
                <td className="px-6 py-4">
                    {item.department}
                </td>
                <td className="px-6 py-4">
                    {item.phoneNo}
                </td>
                <td className="px-6 py-4">
                    {item.email}
                </td>
                
                
                <td className="px-6 py-4">
                    <a onClick={() => handleEditClick(item)} className="font-medium text-blue-600  hover:underline">Edit</a>
                    <a onClick={() => handleDelete(item.id)} className="ml-5 font-medium text-red-600  hover:underline cursor-pointer">Delete</a>
                </td>
            </tr>
            ))}
            
        </tbody>
    </table>
    <EditCoordinatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coordinator={selectedCoordinator}
        onUpdate={updateCoordinatorData} // ✅ Pass onUpdate function
      />
</div>

  )
}
