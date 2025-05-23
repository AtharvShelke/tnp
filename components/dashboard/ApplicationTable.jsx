

export default function ApplicationTable(props) {
    return (
      
  
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
              <tr>
                  {(props.columns).map((column,i)=>(
                      <th scope="col" key={i} className="px-1 py-2 sm:px-6 sm:py-3">
                      {column}
                  </th>
                  ))}
                  
                  <th scope="col" className="px-1 py-2 sm:px-6 sm:py-3">
                      Action
                  </th>
              </tr>
          </thead>
          <tbody>
              {(props.data).map((item, i)=>(
                  <tr className="odd:bg-white  even:bg-gray-50  border-b " key={i}>
                  <th scope="row" className="px-3 py-1 sm:px-6 sm:py-4 font-medium text-gray-900 whitespace-nowrap ">
                      {item.referenceNumber}
                  </th>
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      {item.title}
                  </td>
                  
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      {item.prn}
                  </td>
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      {item.name}
                  </td>
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      {item.department}
                  </td>
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      {item.status}
                  </td>
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      {item.isplaced?'True':'False'}
                  </td>
                  
                  <td className="px-3 py-1 sm:px-6 sm:py-4">
                      <a href="#" className="font-medium text-blue-600  hover:underline">Edit</a>
                      <a href="#" className="ml-5 font-medium text-red-600  hover:underline">Delete</a>
                  </td>
              </tr>
              ))}
              
          </tbody>
      </table>
  </div>
  
    )
  }
  