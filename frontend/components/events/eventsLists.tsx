'use client'

import React, { useEffect, useState, useContext } from 'react';
import { GetEvents } from '@/services/eventsServices';
import type { Event } from '@/types/events'; // Ensure you renamed the Event type to avoid conflict
import EventForm from '@/components/events/EventForm'
import { FaPenToSquare } from "react-icons/fa6";
import EventCard from './eventCard';

import { PopupContext } from '@/context/PopupContext';

interface EventsListProps {
  groupId: number;
}


const EventsList = ({ groupId }: EventsListProps) => {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false)
  const Popup = useContext(PopupContext)

  const AddEvent = (newEvent: Event) => {
    setEvents(prev => Array.isArray(prev) ? [newEvent, ...prev] : [newEvent]);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await GetEvents(groupId);
        setEvents(data);
        console.log(data, "events");
        
      } catch (err: any) {
        Popup?.showPopup("faild", 'Something went wrong. Try again.')
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [groupId]);


  const displayEvents = () => {
    return (
      events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))
    )
  }


  return (
    <div>
      <section className="create-post">
        <div className="add-post-holder">
          <button className="addPostBtn" onClick={toggleForm}>
            <FaPenToSquare className="addPostIcon" style={{ background: 'var(--card-bg)' }} /> Add-Event
          </button>
        </div>
        {showForm && <EventForm group_id={groupId} onCreate={AddEvent} />}
      </section>

      <section className='events-list'>
        {events ? displayEvents() : <div className='no-posts-yet'>No Events Yet</div>}
      </section>
    </div>
  );
};

export default EventsList;
