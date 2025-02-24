'use client';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CoordinatorReq(props) {
  const router = useRouter();

  const handleErrorResponse = (status, responseData) => {
    if (status === 409) {
      toast.error("User with this Email already exists");
    } else {
      console.error("Server Error:", responseData.message || "No message provided");
      toast.error("Oops! Something went wrong.");
    }
  };

  const approve = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: "APPROVED" }),
        }
      );
      if (response.ok) {
        toast.success("Coordinator status updated successfully");
        router.refresh(); // Refresh the current route to update data
      } else {
        const responseData = await response.json();
        handleErrorResponse(response.status, responseData);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Oops! Something went wrong.");
    }
  };

  const reject = async (id) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: "REJECTED" }),
        }
      );
      if (response.ok) {
        toast.success("User Rejected Successfully");
        router.refresh(); // Refresh the current route to update data
      } else {
        const responseData = await response.json();
        handleErrorResponse(response.status, responseData);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Oops! Something went wrong.");
    }
  };

  const handleApproveClick = async (id) => {
    await approve(id);
  };

  const handleRejectClick = async (id) => {
    await reject(id);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                {item.id}
              </th>
              <td className="px-6 py-4">{item.name}</td>
              <td className="px-6 py-4">{item.email}</td>
              <td className="px-6 py-4">{item.status}</td>
              <td className="px-6 py-4">
                {item.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleApproveClick(item.id)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectClick(item.id)}
                      className="ml-5 font-medium text-red-600 hover:underline"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <button className="font-medium text-blue-600 hover:underline">
                    View
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
