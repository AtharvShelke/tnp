// components/EditDriveModal.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function EditDriveModal({ show, handleClose, drive, setDrive }) {
  const [formData, setFormData] = useState({
    title: '',
    industryType: '',
    referenceNumber: '',
    location: '',
    role: '',
    ctc: '',
    bond: '',
    link: '',
    about: '',
    description: '',
    eligibility: '',
  });

  useEffect(() => {
    if (drive) {
      setFormData({
        id: drive.id,
        title: drive.title || '',
        industryType: drive.industryType || '',
        referenceNumber: drive.referenceNumber || '',
        location: drive.location || '',
        role: drive.role || '',
        ctc: drive.ctc || '',
        bond: drive.bond || '',
        link: drive.link || '',
        about: drive.about || '',
        description: drive.description || '',
        eligibility: drive.eligibility || '',
      });
    }
  }, [drive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/application/${drive.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log(formData);
      if (response.ok) {
        toast.success('Drive updated successfully!');
        const updatedDrive = await response.json();
        setDrive(updatedDrive);
        handleClose();
      } else {
        toast.error('Failed to update drive.');
      }
    } catch (error) {
      console.error('Error updating drive:', error);
      toast.error('An error occurred.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Drive</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="industryType"
            placeholder="Industry Type"
            value={formData.industryType}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="referenceNumber"
            placeholder="Reference Number"
            value={formData.referenceNumber}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="ctc"
            placeholder="CTC"
            value={formData.ctc}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="bond"
            placeholder="Bond"
            value={formData.bond}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="link"
            placeholder="Application Link"
            value={formData.link}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <textarea
            name="about"
            placeholder="About"
            value={formData.about}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <textarea
            name="eligibility"
            placeholder="Job Eligibility"
            value={formData.eligibility}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
