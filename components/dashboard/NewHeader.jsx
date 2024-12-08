import { Plus } from 'lucide-react'
import React from 'react'

export default function NewHeader({title, link}) {
  return (
    <div className='flex justify-between px-16 py-10'>
        <h1 className=' font-bold text-2xl'>{title}</h1>
        <a href={link} className='flex gap-2  items-center px-2 py-1 pr-3 rounded-md font-semibold text-white bg-blue-700'><Plus/>New</a>
      </div>
  )
}
