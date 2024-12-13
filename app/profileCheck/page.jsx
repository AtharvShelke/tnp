'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN" || "COORDINATOR") {
      router.replace("/dashboard");
    }
    else if (status === "authenticated" && session?.user?.role === "STUDENT") {
      router.replace("/drives");
    }
  }, [status, session, router]);

  const handleRoleChange = async (apiUrl, successMessage, redirect = false) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    const userId = session?.user?.id;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to update user role');
      
      const result = await response.json();
      setMessage({ text: result.message, type: 'success' });
      if (redirect) {
        signOut();
        router.push('/login');
        
        toast.success(successMessage);
      }
    } catch (error) {
      setMessage({ text: error.message || 'An error occurred', type: 'error' });
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {session?.user?.role === "USER" ? (
        <div className="grid grid-cols-3 px-10 py-10 gap-10 border">
          <Link href={"/students/new"}>
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
              Create New Student
            </div>
          </Link>

          <button
            onClick={() => handleRoleChange('/api/coordinatorApproval', 'Successfully sent the coordinator request to admin. Wait for confirmation', true)}
            disabled={loading}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center "
          >
            Make Coordinator
          </button>

          {/* <button
            onClick={() => handleRoleChange('/api/changeRole', 'Successfully made admin. Login again to work as an admin', true)}
            disabled={loading}
            className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center "
          >
            Make Admin
          </button> */}

          {message.text && (
            <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
              {message.text}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Page;
