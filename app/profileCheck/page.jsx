'use client';
import { Link2 } from "lucide-react";
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
    if (status === "authenticated") {
      if (session.user.role === "ADMIN" || session.user.role === "COORDINATOR") {
        router.replace("/dashboard");
      } else if (session.user.role === "STUDENT") {
        router.replace("/drives");
      }
    }else if (status === "unauthenticated") {
      router.replace("/login");
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

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const result = await response.json();
      setMessage({ text: result.message, type: 'success' });

      if (redirect) {
        toast.success(successMessage);
        signOut();
        router.push('/login');
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setMessage({ text: errorMessage, type: 'error' });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <button
          className="text-sm bg-black text-white border border-gray-200 rounded-lg shadow flex items-center justify-center gap-2 px-2 py-1 absolute top-2 right-2 hover:bg-white hover:text-black transition-all duration-150"
          onClick={signOut}
        >
          <Link2 className="w-4" /> Logout
        </button> 
        {session?.user?.role === "USER" ? (
          <div className="grid grid-cols-3 px-10 py-10 gap-10 border">
            <Link href="/students/new">
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center">
                Create New Student
              </div>
            </Link>

            <button
              onClick={() =>
                handleRoleChange(
                  '/api/coordinatorApproval',
                  'Successfully sent the coordinator request to admin. Wait for confirmation',
                  true
                )
              }
              disabled={loading}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center"
            >
              {loading ? 'Processing...' : 'Make Coordinator'}
            </button>

            {message.text && (
              <p
                className={`mt-4 ${
                  message.type === 'error' ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  
};

export default Page;
