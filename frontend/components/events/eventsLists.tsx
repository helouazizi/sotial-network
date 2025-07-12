'use client'

import React, { useEffect, useState, useContext } from 'react';
import { GetEvents } from '@/services/eventsServices';
import type { Event } from '@/types/events'; // Ensure you renamed the Event type to avoid conflict
import EventCard from './eventCard';

import { PopupContext } from '@/context/PopupContext';

interface EventsListProps {
  groupId: number;
}

const EventsList = ({ groupId }: EventsListProps) => {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const Popup = useContext(PopupContext)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await GetEvents(groupId);
        console.log(data, "events");

        setEvents(data);
      } catch (err: any) {
        // setError(err.message || 'Failed to load events');
        console.log(err);
        Popup?.showPopup("faild", 'Something went wrong. Try again.')
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [groupId]);

  if (loading) return <p>Loading...</p>;
  if (events && events.length === 0) return <div className='no-more-posts'>No events yet.</div>;

  return (
    <div>
      <div>
        {events && events.length > 0 && events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
};

export default EventsList;
