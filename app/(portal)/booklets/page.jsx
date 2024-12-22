'use client'
import Booklet from '@/components/dashboard/Booklet'
import NewHeader from '@/components/dashboard/NewHeader'
import { getRequest } from '@/lib/apiRequest'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function BookletsPage() {
  const [booklets, setBooklets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooklets = async () => {
      // booklets
      const data = await getRequest('booklets')

      setBooklets(data);

    }
    fetchBooklets();
    setLoading(false)
  }, []);


  return (
    <div>
      <NewHeader title={"Booklet"} link={'/booklets/new'}/>
      <div className="px-16 grid grid-cols-2 gap-y-6 sm:grid-cols-4">
        {booklets.map((drive, i) => (
          <Booklet key={i} id={drive.id} title={drive.title} img={drive.imageUrl||'/logo.jpg'}  />
        ))}
      </div>
    </div>
  )
}