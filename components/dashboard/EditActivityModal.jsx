import React, { useState, useEffect } from "react";
import { getRequest } from "@/lib/apiRequest";

export default function EditActivityModal({ isOpen, onClose, activity, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await getRequest('departments');
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || "");
      setDescription(activity.description || "");
      setLink(activity.link || "");
      setReferenceNumber(activity.referenceNumber || "");
      setDate(activity.date ? new Date(activity.date).toISOString().split("T")[0] : "");
      setImageUrl(activity.imageUrl || "");
      setSelectedDepartments(
        activity.activityDepartments?.map((ad) => ({
          id: ad.departmentId
        })) || []
      );
    }
  }, [activity]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prev) => {
      const exists = prev.some((dept) => dept.id === department.id);
      if (exists) {
        return prev.filter((dept) => dept.id !== department.id);
      } else {
        return [...prev, { id: department.id }];
      }
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...activity,
      title,
      description,
      link,
      referenceNumber,
      date,
      imageUrl,
      activityDepartments: selectedDepartments,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto">
        <div className="px-4 py-3 border-b">
          <h2 className="text-xl font-bold">Edit Activity</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Link</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Reference Number</label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">Departments</label>
            <button
              type="button"
              onClick={toggleDropdown}
              className="w-full px-3 py-2 border rounded"
            >
              {selectedDepartments.length > 0
                ? `${selectedDepartments.length} selected`
                : "Select Departments"}
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 w-full bg-white border rounded shadow mt-1 z-10 max-h-60 overflow-y-auto">
                {departments.map((department) => (
                  <label
                    key={department.id}
                    className="flex items-center p-2 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDepartments.some((dept) => dept.id === department.id)}
                      onChange={() => handleCheckboxChange(department)}
                      className="mr-2"
                    />
                    {department.title}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}