import React from 'react'
import Link from "next/link";
export default function Navbar() {
  return (
    <div className='w-full flex items-center justify-between px-28 h-20 border-b'>
        {/* logo */}
        
            <img src="/logo.jpg" alt="" className='h-5/6'/>
        
        {/* link to dashboard */}
        <Link href={'/dashboard'}>Dashboard</Link>
    </div>
  )
}
