import { useState } from "react";

export default function ApplicantTable(props) {
  const [editingId, setEditingId] = useState(null);
  const [editedStatus, setEditedStatus] = useState("");

  const handleEditClick = (id, currentStatus) => {
    setEditingId(id);
    setEditedStatus(currentStatus);
  };

  const handleStatusChange = (e) => {
    setEditedStatus(e.target.value);
  };

  const handleStatusSubmit = (userId) => {
    props.onStatusUpdate(userId, editedStatus);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

   return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            {props.columns.map((column, i) => (
              <th 
                scope="col" 
                key={i} 
                className="px-6 py-3 text-center font-medium"
              >
                {column}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-center font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, i) => (
            <tr 
              className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`} 
              key={i}
            >
              <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                {item.PRN}
              </td>
              <td className="px-6 py-4 text-center">{item.name}</td>
              <td className="px-6 py-4 text-center text-gray-600">{item.email}</td>
              <td className="px-6 py-4 text-center">{item.phone}</td>
              <td className="px-6 py-4 text-center">{item.department}</td>
              <td className="px-6 py-4 text-center font-medium">{item.cgpa}</td>
              <td className="px-6 py-4 text-center">{item.passOutYear}</td>
              
              <td className="px-6 py-4 text-center">
                {editingId === item.userId ? (
                  <div className="flex flex-col items-center space-y-2">
                    <input
                      type="text"
                      value={editedStatus}
                      onChange={handleStatusChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-xs"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusSubmit(item.userId)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status}
                  </span>
                )}
              </td>
              
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center space-x-3">
                  {editingId !== item.userId && (
                    <>
                      <button
                        onClick={() => handleEditClick(item.userId, item.status)}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        title="Edit Status"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <a 
                        href={`/students/profile/${item.userId}`} 
                        className="font-medium text-green-600 hover:text-green-800 hover:underline transition-colors"
                        title="View Profile"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                       <button
                      onClick={() => props.onDeleteClick(item.userId)}
                      className="font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
                      title="Delete Application"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}