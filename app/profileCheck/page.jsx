'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    console.log(session?.user)
    if (status === "authenticated") {
      if (session?.user?.role !== "USER") {
        router.replace("/dashboard");
      }
    }
  }, [status, session, router]);


  if (status === "loading") {
    return <p>Loading...</p>;
  }
  const changeRole = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const userId = session?.user?.id
    try {
      const response = await fetch('/api/changeRole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      const result = await response.json();
      setSuccess(result.message);
      router.push('/login')
      signOut();
      toast.success('Successfully made admin. Login again to work as an admin')
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error || 'An error occurred'}`);
    } finally {
      setLoading(false);
    }
  };
  const coordinatorApproval = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const userId = session?.user?.id
    try {
      const response = await fetch('/api/coordinatorApproval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }
      const result = await response.json();
      setSuccess(result.message);
      router.push('/login')
      signOut();
      toast.success('Successfully sent the coordinator request to admin. Wait for confirmation')
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error || 'An error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  if (session?.user?.role === "USER") {
    return (
      <>
        <div className="h-screen w-screen flex items-center justify-center">

          <div className="grid grid-cols-3 px-10 py-10 gap-10 border">
            <Link href={"/students/new"}>
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
                Create New Student
              </div>
            </Link>
            <button onClick={coordinatorApproval} disabled={loading} className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
              {loading ? 'Updating...' : 'Make Coordinator'}
            </button>


            <button onClick={changeRole} disabled={loading} className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center ">
              {loading ? 'Updating...' : 'Make Admin'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

          </div>
        </div>
      </>
    )
  }


  return null;
}
