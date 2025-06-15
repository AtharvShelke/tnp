export default function StudentTable(props) {
  return (
    <div className="relative overflow-x-auto shadow-sm rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {props.columns.map((column, i) => (
              <th
                key={i}
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {props.data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.prn}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                {item.name}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.dob}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {item.department}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.gender}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <a href={`mailto:${item.email}`} className="text-blue-600 hover:text-blue-800">
                  {item.email}
                </a>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <a href={`tel:${item.phone}`} className="hover:text-blue-600">
                  {item.phone}
                </a>
              </td>
              <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                {item.address}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.cgpa >= 7.5 ? 'bg-green-100 text-green-800' : 
                  item.cgpa >= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.cgpa}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.admissionType}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.passOutYear}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.liveBacklogs > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {item.liveBacklogs}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.deadBacklogs}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.yearGap}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.preference1}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.preference2}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.preference3}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.placed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.placed ? 'Placed' : 'Not Placed'}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <a
                    href={`/students/profile/${item.userId}`}
                    className="text-blue-600 hover:text-blue-900 hover:underline"
                    title="View Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                  {(props.userRole === "ADMIN" || props.userRole === "COORDINATOR") && (
                    <>
                      <a
                        href={`student/profile/edit/${item.userId}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </a>
                      <button
                        onClick={() => props.onDelete && props.onDelete(item.userId)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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