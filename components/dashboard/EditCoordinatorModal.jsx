import { useState, useEffect } from "react";
import { updateRequest } from '@/lib/apiRequest';


const EditCoordinatorModal = ({ isOpen, onClose, coordinator, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
  });

  useEffect(() => {
    if (coordinator) {
      setFormData({
        name: coordinator.name || "",
        email: coordinator.email || "",
        phoneNo: coordinator.phoneNo || "",
      });
    }
  }, [coordinator]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedData = {
      name: formData.name,
      email: formData.email,
      phoneNo: formData.phoneNo,
    };
  
    // const result = await updateRequest(`coordinator/${coordinator.id}`, updatedData);
  
    // if (result) {
    //   onUpdate(result);
    //   onClose();
    onUpdate({ ...coordinator, ...updatedData }); // Pass the updated data to parent
    onClose();
  
  
  };
  
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Coordinator</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            placeholder="Phone No"
            className="border p-2 rounded"
          />
          
          <div className="flex justify-end gap-2 mt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoordinatorModal;
