export default function StudentTable(props) {
    return (
      <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
              <tr className="odd:bg-white even:bg-gray-50 border-b" key={i}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.prn}
                </th>
                <td className="px-6 py-4">{item.firstName}</td>
                <td className="px-6 py-4">{item.middleName}</td>
                <td className="px-6 py-4">{item.lastName}</td>
                <td className="px-6 py-4">{item.dob}</td>
                <td className="px-6 py-4">{item.gender}</td>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.personalEmail}</td>
                <td className="px-6 py-4">{item.age}</td>
                <td className="px-6 py-4">{item.mobileNo}</td>
                <td className="px-6 py-4">{item.alternateMobileNo}</td>
                <td className="px-6 py-4">{item.localAddress}</td>
                <td className="px-6 py-4">{item.permanentAddress}</td>
                <td className="px-6 py-4">{item.nativePlace}</td>
                <td className="px-6 py-4">{item.xPercentage}</td>
                <td className="px-6 py-4">{item.xYearOfPassing}</td>
                <td className="px-6 py-4">{item.xBoard}</td>
                <td className="px-6 py-4">{item.xiiPercentage}</td>
                <td className="px-6 py-4">{item.xiiYearOfPassing}</td>
                <td className="px-6 py-4">{item.xiiBoard}</td>
                <td className="px-6 py-4">{item.diplomaPercentage}</td>
                <td className="px-6 py-4">{item.diplomaYearOfPassing}</td>
                <td className="px-6 py-4">{item.diplomaCollege}</td>
                <td className="px-6 py-4">{item.diplomaBranch}</td>
                <td className="px-6 py-4">{item.admissionType}</td>
                <td className="px-6 py-4">{item.passOutYear}</td>
                <td className="px-6 py-4">{item.department}</td>
                <td className="px-6 py-4">{item.sem1Sgpa}</td>
                <td className="px-6 py-4">{item.sem2Sgpa}</td>
                <td className="px-6 py-4">{item.sem3Sgpa}</td>
                <td className="px-6 py-4">{item.sem4Sgpa}</td>
                <td className="px-6 py-4">{item.sem5Sgpa}</td>
                <td className="px-6 py-4">{item.sem6Sgpa}</td>
                <td className="px-6 py-4">{item.sem7Sgpa}</td>
                <td className="px-6 py-4">{item.sem8Sgpa}</td>
                <td className="px-6 py-4">{item.avgCgpa}</td>
                <td className="px-6 py-4">{item.avgSemPercentage}</td>
                <td className="px-6 py-4">{item.liveBacklogs}</td>
                <td className="px-6 py-4">{item.deadBacklogs}</td>
                <td className="px-6 py-4">{item.yearGap}</td>
                <td className="px-6 py-4">{item.languagesKnown.join(', ')}</td>
                <td className="px-6 py-4">{item.minorProject}</td>
                <td className="px-6 py-4">{item.majorProject}</td>
                <td className="px-6 py-4">{item.preference1}</td>
                <td className="px-6 py-4">{item.preference2}</td>
                <td className="px-6 py-4">{item.preference3}</td>
                <td className="px-6 py-4">{item.placed ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4">
                  <a href="#" className="font-medium text-blue-600 hover:underline">
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
  