import LoginForm from '@/components/auth/LoginForm';
import { Warehouse } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-screen px-6 mx-auto bg-slate-100">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
        {/* Left Image Section */}
        <div
          className="hidden lg:block lg:w-1/2"
          style={{
            backgroundImage: "url(https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        {/* Right Form Section */}
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          
          <div className="flex justify-center mx-auto h-16">
            <img src="/logo.jpg" alt="" />
          </div>
            
          

          <p className="mt-3 text-xl text-center text-gray-600 ">
            Login
          </p>

          <LoginForm />
        </div>
      </div>
    </section>
  );
}
