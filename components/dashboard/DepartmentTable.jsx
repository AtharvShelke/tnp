import { useEffect, useState } from "react";
import EditDepartmentModal from "./EditDepartmentModal";
import { deleteRequest, updateRequest } from "@/lib/apiRequest";

export default function DepartmentTable(props) {
  const [departments, setDepartments] = useState(props.data || []);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  useEffect(() => {
    setDepartments(props.data);
  }, [props.data]);

  // Handler for when the Edit link is clicked.
  const handleEditClick = (department) => {
    setSelectedDepartment(department);
    setModalOpen(true);
  };

  // Handler to close the modal.
  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleSaveChanges = async (updatedDepartment) => {
    // Define the endpoint based on your API structure.
    // For example, if your endpoint expects "departments/{id}".
    const endpoint = `departments/${updatedDepartment.id}`;
    const body = { title: updatedDepartment.title };

    const data = await updateRequest(endpoint, body);
    if (data) {
      // Update the local department list with the returned updated department.
      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === updatedDepartment.id ? data : dept
        )
      );
      setModalOpen(false);
      window.location.reload();
    }
  };

  // Delete functionality using the provided deleteRequest.
  const handleDelete = async (department) => {
    // Confirm before deletion.
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }
    const endpoint = `departments/${department.id}`;
    const data = await deleteRequest(endpoint);
    if (data) {
      // Remove the deleted department from local state.
      setDepartments((prev) =>
        prev.filter((dept) => dept.id !== department.id)
      );
      window.location.reload();
    }
  };

 
  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              {props.columns.map((column, i) => (
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
            {props.data.map((item, i) => (
              <tr className="odd:bg-white  even:bg-gray-50  border-b " key={i}>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {item.id}
                </th>
                <td className="px-6 py-4">{item.title}</td>

                <td className="px-6 py-4">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditClick(item);
                    }}
                    className="font-medium text-blue-600  hover:underline"
                  >
                    Edit
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDelete(item);
                      }}
                    className="ml-5 font-medium text-red-600  hover:underline"
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Render the edit modal */}
      <EditDepartmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        department={selectedDepartment}
        onSave={handleSaveChanges}
      />
    </>
  );
}
