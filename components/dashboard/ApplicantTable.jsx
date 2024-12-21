import formDateFromString from "@/lib/formDateFromString";

export default function ApplicantTable(props) {
    return (
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
                  <a href="#" className="ml-5 font-medium text-blue-600 hover:underline">
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
  