import RegisterForm from "@/components/auth/RegisterForm";
import { Warehouse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen px-6 mx-auto bg-slate-100">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
        {/* Left Image Section */}
        <Image
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          src='/login_page.avif'
          width={800}
          height={1000}
          alt=""
          priority />

        {/* Right Form Section */}
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          <Link href="/">
            <div className="flex justify-center mx-auto h-16">
              <Image src="/logo.jpg" alt="Logo" className="h-full w-auto" width={120} height={60} priority />
            </div>
          </Link>
          <p className="mt-3 text-xl text-center text-gray-600 ">
            Create New Account
          </p>

          <RegisterForm />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm font-light text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
