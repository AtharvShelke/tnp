import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function EditDriveModal({ show, handleClose, drive, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    industryType: '',
    referenceNumber: '',
    location: '',
    role: '',
    ctc: '',
    bond: '',
    link: '',
    downloadlink: '',
    about: '',
    description: '',
    eligibility: '',
    minCGPA: 0,
    maxBacklogs: 0,
    driveDate: '',
    lastDriveDate: '',
    rounds: [],
    driveDepartments: []
  });

  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/departments`);
      const data = await response.json();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (drive) {
      setFormData({
        title: drive.title || '',
        industryType: drive.industryType || '',
        referenceNumber: drive.referenceNumber || '',
        location: drive.location || '',
        role: drive.role || '',
        ctc: drive.ctc || '',
        bond: drive.bond || '',
        link: drive.link || '',
        downloadlink: drive.downloadlink || '',
        about: drive.about || '',
        description: drive.description || '',
        eligibility: drive.eligibility || '',
        minCGPA: drive.minCGPA || 0,
        maxBacklogs: drive.maxBacklogs || 0,
        driveDate: drive.driveDate?.split('T')[0] || '',
        lastDriveDate: drive.lastDriveDate?.split('T')[0] || '',
        rounds: drive.rounds || [],
      });
      setSelectedDepartments(drive.driveDepartments || []);
    }
  }, [drive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (department) => {
    setSelectedDepartments((prev) => {
      const exists = prev.some((dept) => dept.id === department.id);
      if (exists) {
        return prev.filter((dept) => dept.id !== department.id);
      } else {
        return [...prev, { id: department.id, title: department.title }];
      }
    });
  };

  const handleRoundChange = (index, field, value) => {
    const updatedRounds = [...formData.rounds];
    updatedRounds[index] = { ...updatedRounds[index], [field]: value };
    setFormData(prev => ({ ...prev, rounds: updatedRounds }));
  };

  const addRound = () => {
    setFormData(prev => ({
      ...prev,
      rounds: [...prev.rounds, { title: '' }]
    }));
  };

  const removeRound = (index) => {
    setFormData(prev => ({
      ...prev,
      rounds: prev.rounds.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/drives/${drive.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          driveDepartments: selectedDepartments
        }),
      });

      if (response.ok) {
        const updatedDrive = await response.json();
        onUpdate(updatedDrive);
        toast.success('Drive updated successfully!');
        handleClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update drive');
      }
    } catch (error) {
      console.error('Error updating drive:', error);
      toast.error('An error occurred while updating the drive');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Drive</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-semibold text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="referenceNumber" className="text-sm font-semibold text-gray-700">Reference Number</label>
              <input
                type="text"
                id="referenceNumber"
                name="referenceNumber"
                placeholder="Reference Number"
                value={formData.referenceNumber}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-sm font-semibold text-gray-700">Departments</label>
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-full px-3 py-2 border rounded text-left"
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

            <div className="space-y-2">
              <label htmlFor="industryType" className="text-sm font-semibold text-gray-700">Industry Type</label>
              <input
                type="text"
                id="industryType"
                name="industryType"
                placeholder="Industry Type"
                value={formData.industryType}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ctc" className="text-sm font-semibold text-gray-700">Job CTC</label>
              <input
                type="text"
                id="ctc"
                name="ctc"
                placeholder="CTC"
                value={formData.ctc}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bond" className="text-sm font-semibold text-gray-700">Bond</label>
              <input
                type="text"
                id="bond"
                name="bond"
                placeholder="Bond"
                value={formData.bond}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-semibold text-gray-700">Job Role</label>
              <input
                type="text"
                id="role"
                name="role"
                placeholder="Job Role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-semibold text-gray-700">Application Link</label>
              <input
                type="text"
                id="link"
                name="link"
                placeholder="Application Link"
                value={formData.link}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="downloadlink" className="text-sm font-semibold text-gray-700">Download Link</label>
              <input
                type="text"
                id="downloadlink"
                name="downloadlink"
                placeholder="Download Link"
                value={formData.downloadlink}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="minCGPA" className="text-sm font-semibold text-gray-700">Minimum CGPA</label>
              <input
                type="number"
                id="minCGPA"
                name="minCGPA"
                step="0.1"
                min="0"
                max="10"
                value={formData.minCGPA}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxBacklogs" className="text-sm font-semibold text-gray-700">Maximum Backlogs Allowed</label>
              <input
                type="number"
                id="maxBacklogs"
                name="maxBacklogs"
                min="0"
                value={formData.maxBacklogs}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="about" className="text-sm font-semibold text-gray-700">About</label>
            <textarea
              id="about"
              name="about"
              placeholder="About"
              value={formData.about}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-gray-700">Job Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Job Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="eligibility" className="text-sm font-semibold text-gray-700">Job Eligibility</label>
            <textarea
              id="eligibility"
              name="eligibility"
              placeholder="Job Eligibility"
              value={formData.eligibility}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Rounds</h3>
            {formData.rounds.map((round, index) => (
              <div key={index} className="mb-3 p-3 border rounded">
                <div className="space-y-2">
                  <label htmlFor={`round-${index}`} className="text-sm text-gray-700">Round Name</label>
                  <input
                    type="text"
                    id={`round-${index}`}
                    value={round.title || ''}
                    onChange={(e) => handleRoundChange(index, 'title', e.target.value)}
                    className="w-full border rounded-md p-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRound(index)}
                  className="mt-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Round
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRound}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Add Round
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="driveDate" className="text-sm font-semibold text-gray-700">Drive Date</label>
              <input
                type="date"
                id="driveDate"
                name="driveDate"
                value={formData.driveDate}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastDriveDate" className="text-sm font-semibold text-gray-700">Last Date to Apply</label>
              <input
                type="date"
                id="lastDriveDate"
                name="lastDriveDate"
                value={formData.lastDriveDate}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border border-gray-600 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}