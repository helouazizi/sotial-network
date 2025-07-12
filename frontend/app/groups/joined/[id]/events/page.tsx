
'use client'

import React from 'react'
import EventForm from '@/components/events/EventForm'
import EventsList from '@/components/events/eventsLists'
import { useParams } from 'next/navigation'

function Events() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
        <EventForm/>
        <EventsList groupId={id? parseInt(id,10): 0}/>
    </div>
  )
}

export default Events