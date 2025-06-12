export default function StudentTable(props) {
    return (
      <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {props.columns.map((column, i) => (
                <th scope="col" key={i} className="px-1 py-2 sm:px-6 sm:py-3 text-center">
                  {column}
                </th>
              ))}
              <th scope="col" className="px-1 sm:px-6 sm:py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((item, i) => (
              <tr className="odd:bg-white even:bg-gray-50 border-b" key={i}>
                <th scope="row" className="text-center px-2 sm:px-6 sm:py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.prn}
                </th>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.name}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.email}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.phone}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.address}</td>
                <td className="px-2 sm:px-6 sm:py-4 ">{item.dob}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.gender}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.department}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.cgpa}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.admissionType}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.passOutYear}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.liveBacklogs}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.deadBacklogs}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.yearGap}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.preference1}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.preference2}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.preference3}</td>
                <td className="px-2 sm:px-6 sm:py-4 text-center">{item.placed ? 'Yes' : 'No'}</td>
                <td className="px-2 sm:px-6 sm:py-4">
                  <a href={`/students/profile/${item.userId}`} className="font-medium text-blue-600 hover:underline">
                    View
                  </a>
                  <a href={`student/profile/edit/${item.userId}`} className="ml-5 font-medium text-blue-600 hover:underline">
                    Edit
                  </a>
                  <a href="#" className="ml-5 font-medium text-red-600 hover:underline">
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  