
export default function MyApplicationTable(props) {
    return (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-700 bg-white border border-gray-200 rounded-lg">
          <thead className="text-xs uppercase bg-gray-100 border-b">
            <tr>
              {props.columns.map((column, i) => (
                <th scope="col" key={i} className="px-6 py-3 text-gray-900">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {props.data.map((item, i) => (
              <tr className="odd:bg-white even:bg-gray-50 border-b" key={i}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.referenceNumber}
                </th>
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4">{item.dateOfApplication}</td>
                <td className="px-6 py-4">{item.status}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  