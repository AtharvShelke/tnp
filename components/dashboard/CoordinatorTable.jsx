

export default function CoordinatorTable(props) {
  return (
    

<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
                {(props.columns).map((column,i)=>(
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
            {(props.data).map((item, i)=>(
                <tr className="odd:bg-white  even:bg-gray-50  border-b " key={i}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                    {item.Coordinator_ID}
                </th>
                <td className="px-6 py-4">
                    {item.Name}
                </td>
                <td className="px-6 py-4">
                    {item.Phone_no}
                </td>
                <td className="px-6 py-4">
                    {item.Email}
                </td>
                <td className="px-6 py-4">
                    {item.Institute}
                </td>
                <td className="px-6 py-4">
                    {item.Branch}
                </td>
                
                <td className="px-6 py-4">
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
