import React, { useState, useContext } from 'react';
import { Event } from '@/types/events';
import PostHeader from '../post/postHeader';
import PostBody from '../post/postBody';
import FormatDate from '@/utils/date';
import { VoteEvent } from '@/services/eventsServices';
import { PopupContext } from '@/context/PopupContext';

interface EventCardProps {
  event: Event;
}

type VoteType = "going" | "not going";

const EventCard = ({ event }: EventCardProps) => {
  const [vote, setVote] = useState<VoteType | null>(
    event.vote === "going" || event.vote === "not going" ? event.vote : null
  );
  const Popup = useContext(PopupContext);

  const handleVote = async (event_id: number, type: VoteType) => {
    try {
      const res = await VoteEvent({id : event_id, vote: type });
      if (res.message) {
        setVote(type);
        Popup?.showPopup("success", res.message);
      } else {
        Popup?.showPopup("faild", res.error || "Something went wrong");
      }
    } catch (err: any) {
      Popup?.showPopup("faild", err.message || "Request failed");
    }
  };

  return (
    <div key={event.id} className="event-event-card">
      <PostHeader
        author={
          event.author.nickname
            ? event.author.nickname
            : `${event.author.firstname}-${event.author.lastname}`
        }
        createdAt={event.created_at}
        avatarUrl={event.author.avatar}
      />
      <PostBody
        title={event.title}
        content={event.description}
        media=""
        body_type="post"
      />

      <p className="event-date">Date: {FormatDate(event.event_date)}</p>

      <div className="event-vote-buttons">
        <button
          onClick={() => handleVote(event.id, "going")}
          className={vote === "going" ? "active" : ""}
        >
          ✅ Going
        </button>
        <button
          onClick={() => handleVote(event.id, "not going")}
          className={vote === "not going" ? "active" : ""}
        >
          ❌ Not Going
        </button>
      </div>

      {vote && (
        <p>
          You voted:{" "}
          <strong>{vote === "going" ? "✅ Going" : "❌ Not Going"}</strong>
        </p>
      )}
    </div>
  );
};

export default EventCard;
