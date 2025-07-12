// EventCard.jsx
import React, { useState } from 'react';
import { Event } from '@/types/events';

interface EventCardProps  {
    event : Event
}

const EventCard = ({ event }:EventCardProps) => {
  const [vote, setVote] = useState(null);

//   const handleVote = (type:string) => {
//     setVote(type);
//     // TODO: optionally send vote to backend
//   };

  return (
    <div key={event.id} className="event-event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>

      <div className="event-vote-buttons">
        <button
        //   onClick={() => handleVote('going')}
          className={vote === 'going' ? 'active' : ''}
        >
          ✅ Going
        </button>
        <button
        //   onClick={() => handleVote('not_going')}
          className={vote === 'not_going' ? 'active' : ''}
        >
          ❌ Not Going
        </button>
      </div>

      {vote && <p>You voted: <strong>{vote === 'going' ? 'Going' : 'Not Going'}</strong></p>}
    </div>
  );
};

export default EventCard;
