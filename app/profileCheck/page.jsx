'use client';

import { Link2, Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [processingRole, setProcessingRole] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    console.log(session?.user?.role)
    if (status === "authenticated") {
      if (session.user.role === "ADMIN" || session.user.role === "COORDINATOR" || session.user.role === "RECRUITER") {
        router.replace("/dashboard");
      } else if (session.user.role === "STUDENT") {
        router.replace("/drives");
      }
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, session, router]);

  const handleRoleChange = async (apiUrl, successMessage, redirect = false) => {
    setProcessingRole(apiUrl);
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

      toast.success(successMessage);
      if (redirect) {
        signOut();
        router.push('/login');
      }
    } catch (error) {
      setMessage({ text: error.message || 'An error occurred', type: 'error' });
      toast.error(error.message || 'An error occurred');
    } finally {
      setProcessingRole(null);
    }
  };

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 px-6">
        {/* Logout Button */}
        <button
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg shadow hover:bg-white hover:text-black border border-gray-200 transition-all duration-150"
          onClick={signOut}
        >
          <Link2 className="w-4" /> Logout
        </button>

        {session?.user?.role === "USER" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl bg-white p-8 rounded-lg shadow-lg">
            {/* Create New Student */}
            <Link href="/students/new">
              <div className="p-6 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-all cursor-pointer text-center">
                Student
              </div>
            </Link>

            {/* Request Coordinator Role */}
            <button
              onClick={() =>
                handleRoleChange(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval`,
                  'Successfully sent the coordinator request to admin. Wait for confirmation',
                  true
                )
              }
              disabled={processingRole === `${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval`}
              className="p-6 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-all flex items-center justify-center"
            >
              {processingRole === `${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinatorApproval` ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Coordinator"
              )}
            </button>

           
            <Link href="/recruiter/new">
              <div className="p-6 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-all flex items-center justify-center">
                Recruiter
              </div>
            </Link>
          </div>
        ) : null}

        {/* Display Message */}
        {message.text && (
          <p className={`mt-4 text-lg font-medium ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message.text}
          </p>
        )}
      </div>
    );
  }
};

export default Page;
