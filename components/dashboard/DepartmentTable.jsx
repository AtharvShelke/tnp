import { useEffect, useState } from "react";
import EditDepartmentModal from "./EditDepartmentModal";
import { deleteRequest, updateRequest } from "@/lib/apiRequest";
import DeleteConfirmationModal from "@/app/(portal)/departments/DeleteDepartmentModal";
import { useRouter } from "next/navigation";


export default function DepartmentTable(props) {
  const [departments, setDepartments] = useState(props.data || []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null); 
  const router = useRouter();
  useEffect(() => {
    setDepartments(props.data);
  }, [props.data]);

  const handleEditClick = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleSaveChanges = async (updatedDepartment) => {
    const endpoint = `departments/${updatedDepartment.id}`;
    const body = { title: updatedDepartment.title };

    const data = await updateRequest(endpoint, body);
    if (data) {
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === updatedDepartment.id ? data : dept
        )
      );
      setModalOpen(false);
      router.refresh()
    }
  };

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setDeleteModalOpen(true); // Open delete confirmation modal
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDepartmentToDelete(null); // Reset department
  };

  const handleDeleteConfirm = async () => {
    const endpoint = `departments/${departmentToDelete.id}`;
    const data = await deleteRequest(endpoint);
    if (data) {
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== departmentToDelete.id)
      );
      setDeleteModalOpen(false);
      setDepartmentToDelete(null); 
      router.refresh();
    }
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {props.columns.map((column, i) => (
                <th scope="col" key={i} className="px-4 py-3 sm:px-6 sm:py-4">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((item, i) => (
              <tr className="odd:bg-white even:bg-gray-50 border-b" key={i}>
                <td className="px-4 py-4 sm:px-6 sm:py-4">{item.title}</td>
                <td className="px-4 py-4 sm:px-6 sm:py-4 flex">
                  <button
                    
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditClick(item);
                    }}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteClick(item); 
                    }}
                    className="ml-5 font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

  
      <EditDepartmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        department={selectedDepartment}
        onSave={handleSaveChanges}
      />

 
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        departmentName={departmentToDelete?.title} 
      />
    </>
  );
}
