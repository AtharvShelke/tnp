'use client'
import Activity from '@/components/dashboard/Activity'
import NewHeader from '@/components/dashboard/NewHeader'
import Loader from '@/components/Loader'
import { getRequest } from '@/lib/apiRequest'
import formDateFromString from '@/lib/formDateFromString'
import { Search, Filter, Calendar as CalendarIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function ActivitiesPage() {
  const [allActivities, setAllActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getRequest('activities')
        const activities = response.data.map(activity => ({
          ...activity,
          status: getActivityStatus(activity.date)
        }))
        setAllActivities(activities)
        setFilteredActivities(activities)
      } catch (err) {
        setError("Failed to fetch activities.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchActivities()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [searchTerm, statusFilter, allActivities])

  const getActivityStatus = (activityDate) => {
    const today = new Date()
    const eventDate = new Date(activityDate)

    today.setHours(0, 0, 0, 0)
    eventDate.setHours(0, 0, 0, 0)

    if (eventDate > today) return "upcoming"
    if (eventDate.getTime() === today.getTime()) return "today"
    return "past"
  }

  const filterActivities = () => {
    let filtered = [...allActivities]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.referenceNumber && activity.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(activity => activity.status === statusFilter)
    }
    
    setFilteredActivities(filtered)
  }

  if (loading) return <Loader />
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="container mx-auto p-4 sm:p-6 min-h-screen bg-gray-50">
      <NewHeader title={"Activities"} link={"/activities/new"} />
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search activities by title, description or reference..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              className="bg-gray-50 border border-gray-300 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No activities found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filter criteria."
              : "There are currently no activities available."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredActivities.map((activity) => {
            const formattedDate = formDateFromString(activity.date)
            return (
              <Activity
                key={activity.id}
                title={activity.title}
                img={activity.imageUrl || '/logo.jpg'}
                date={formattedDate}
                id={activity.id}
                status={activity.status}
                description={activity.description}
                referenceNumber={activity.referenceNumber}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}