import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen px-6 bg-gradient-to-r from-blue-50 to-gray-100">
      <div className="flex w-full max-w-4xl overflow-hidden bg-white rounded-2xl shadow-2xl">
        {/* Left Image Section */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
          }}
        ></div>

        {/* Right Form Section */}
        <div className="w-full px-10 py-12 md:px-12 lg:w-1/2">
          <Link href="/">
            <div className="flex justify-center mx-auto h-16">
              <img src="/logo.jpg" alt="Logo" className="h-full w-auto" />
            </div>
          </Link>

          <h2 className="mt-6 text-3xl font-bold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-center text-gray-500">
            Sign in to continue
          </p>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
