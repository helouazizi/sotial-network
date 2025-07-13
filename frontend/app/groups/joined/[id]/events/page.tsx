
'use client'

import React from 'react'
import EventsList from '@/components/events/eventsLists'
import { useParams } from 'next/navigation'

function Events() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
        
        <EventsList groupId={id? parseInt(id,10): 0}/>
    </div>
  )
}

export default Events