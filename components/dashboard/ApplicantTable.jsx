import { useState } from "react";
import { deleteRequest, updateRequest } from "@/lib/apiRequest";
import formDateFromString from "@/lib/formDateFromString";

export default function ApplicantTable(props) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const handleEditClick = (applicant) => {
    setSelectedApplicant(applicant);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedApplicant(null);
  };

  const handleDelete = async (id) => {
    const response = await deleteRequest(`drives/${id}/application`);

    if(response){
      console.log("User Deleted");
      window.location.reload();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(selectedApplicant);
    const response = await updateRequest(`drives/${selectedApplicant.userId}/application`, {
      name: selectedApplicant.name,
      email: selectedApplicant.email,
      phone: selectedApplicant.phone,
      address: selectedApplicant.address,
      dob: selectedApplicant.dob,
      gender: selectedApplicant.gender,
      department: selectedApplicant.department,
      cgpa: selectedApplicant.cgpa,
      admissionType: selectedApplicant.admissionType,
      passOutYear: selectedApplicant.passOutYear,
      liveBack: selectedApplicant.liveBack,
      deadBack: selectedApplicant.deadBack,
      yearGap: selectedApplicant.yearGap,
      preference1: selectedApplicant.preference1,
      preference2: selectedApplicant.preference2,
      preference3: selectedApplicant.preference3,
      placed: selectedApplicant.placed
    });

    if(response){
      window.location.reload();
    }
    
    handleCloseModal();
  };

  return (
    <>
      <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {props.columns.map((column, i) => (
                <th scope="col" key={i} className="px-6 py-3 text-center">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((item, i) => (
              <tr className="odd:bg-white even:bg-gray-50 border-b" key={i}>
                <th scope="row" className="text-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.PRN}
                </th>
                <td className="px-6 py-4 text-center">{item.name}</td>
                <td className="px-6 py-4 text-center">{item.email}</td>
                <td className="px-6 py-4 text-center">{item.phone}</td>
                <td className="px-6 py-4 text-center">{item.address}</td>
                <td className="px-6 py-4 ">{formDateFromString(item.dob)}</td>
                <td className="px-6 py-4 text-center">{item.gender}</td>
                <td className="px-6 py-4 text-center">{item.department}</td>
                <td className="px-6 py-4 text-center">{item.cgpa}</td>
                <td className="px-6 py-4 text-center">{item.admissionType}</td>
                <td className="px-6 py-4 text-center">{item.passOutYear}</td>
                <td className="px-6 py-4 text-center">{item.liveBack}</td>
                <td className="px-6 py-4 text-center">{item.deadBack}</td>
                <td className="px-6 py-4 text-center">{item.yearGap}</td>
                <td className="px-6 py-4 text-center">{item.preference1}</td>
                <td className="px-6 py-4 text-center">{item.preference2}</td>
                <td className="px-6 py-4 text-center">{item.preference3}</td>
                <td className="px-6 py-4 text-center">{item.placed ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4">
                  <a href={`/students/profile/${item.userId}`} className="font-medium text-blue-600 hover:underline">
                    View
                  </a>
                  <a href="#" className="ml-5 font-medium text-blue-600 hover:underline" onClick={() => handleEditClick(item)}>
                    Edit
                  </a>
                  <a href="#" className="ml-5 font-medium text-red-600 hover:underline" onClick={() => handleDelete(item.userId)}>
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editModalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md overflow-y-auto max-h-96">
            <h2 className="text-xl font-semibold mb-4">Edit Applicant</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.name}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.email}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, email: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.phone}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, phone: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.address}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, address: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm">DOB</label>
                <input
                  type="date"
                  className="w-full px-2 py-1 border rounded-lg text-sm"
                  value={new Date(selectedApplicant.dob).toISOString().split('T')[0]} // Format to iOS standard
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, dob: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Gender</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.gender}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.department}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, department: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">CGPA</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.cgpa}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, cgpa: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Admission Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.admissionType}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, admissionType: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Pass Out Year</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.passOutYear}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, passOutYear: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Live Back</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.liveBack}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, liveBack: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Dead Back</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.deadBack}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, deadBack: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Year Gap</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.yearGap}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, yearGap: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Preference 1</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.preference1}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, preference1: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Preference 2</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.preference2}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, preference2: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Preference 3</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.preference3}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, preference3: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Placed</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={selectedApplicant.placed ? "Yes" : "No"}
                  onChange={(e) => setSelectedApplicant({ ...selectedApplicant, placed: e.target.value === "Yes" })}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
