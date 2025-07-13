// EventCard.jsx
import React, { useState } from 'react';
import { Event } from '@/types/events';
import PostHeader from '../post/postHeader';
import PostBody from '../post/postBody';
import FormatDate from '@/utils/date';

interface EventCardProps {
  event: Event
}

const EventCard = ({ event }: EventCardProps) => {
  const [vote, setVote] = useState(null);

  //   const handleVote = (type:string) => {
  //     setVote(type);
  //     // TODO: optionally send vote to backend
  //   };

  return (
    <div key={event.id} className="event-event-card">
      <PostHeader author={event.author.nickname ? event.author.nickname : event.author.firstname + "-" + event.author.lastname} createdAt={event.created_at} avatarUrl={event.author.avatar} />
      <PostBody title={event.title} content={event.description} media='' body_type='post' />
      {/* <h3>{event.title}</h3>
      <p>{event.description}</p> */}
      <p className='event-date'>Date: {FormatDate(event.event_date)}</p>
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
