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

type VoteType = 'going' | 'not going';

const EventCard = ({ event }: EventCardProps) => {
  const [vote, setVote] = useState<VoteType | null>(
    event.vote === 'going' || event.vote === 'not going' ? event.vote : null
  );
  const [totalGoing, setTotalGoing] = useState(event.total_going);
  const [totalNotGoing, setTotalNotGoing] = useState(event.total_not_going);
  const [loadingVote, setLoadingVote] = useState<VoteType | null>(null);

  const Popup = useContext(PopupContext);

  const handleVote = async (event_id: number, type: VoteType) => {
    setLoadingVote(type);
    try {
      const res = await VoteEvent({ id: event_id, vote: type });

      if (res.message) {
        setVote(type);
        if (type === 'going') {
          setTotalGoing((prev) => prev + 1);
          if (vote === 'not going') setTotalNotGoing((prev) => prev - 1);
        } else {
          setTotalNotGoing((prev) => prev + 1);
          if (vote === 'going') setTotalGoing((prev) => prev - 1);
        }
        Popup?.showPopup('success', res.message);
      } else {
        Popup?.showPopup('faild', res.error || 'Something went wrong');
      }
    } catch (err: any) {
      Popup?.showPopup('faild', err.message || 'Request failed');
    } finally {
      setLoadingVote(null);
    }
  };

  const totalVotes = totalGoing + totalNotGoing;
  const goingPercent = totalVotes > 0 ? (totalGoing / totalVotes) * 100 : 0;
  const notGoingPercent = totalVotes > 0 ? (totalNotGoing / totalVotes) * 100 : 0;

  return (
    <div className="event-card">
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

      <p className="event-date">📅 Date: {FormatDate(event.event_date)}</p>

      <div className="vote-bars">
        <div className="vote-label">✅ Going: {totalGoing}</div>
        <div className="vote-bar">
          <div className="vote-bar-fill going" style={{ width: `${goingPercent}%` }} />
        </div>

        <div className="vote-label">❌ Not Going: {totalNotGoing}</div>
        <div className="vote-bar">
          <div className="vote-bar-fill not-going" style={{ width: `${notGoingPercent}%` }} />
        </div>
      </div>

      <div className="vote-buttons">
        <button
          onClick={() => handleVote(event.id, 'going')}
          disabled={loadingVote !== null}
          className={`vote-btn going-btn ${vote === 'going' ? 'active' : ''} ${
            loadingVote === 'going' ? 'loading' : ''
          }`}
        >
          {loadingVote === 'going' ? 'Voting...' : '✅ Going'}
        </button>

        <button
          onClick={() => handleVote(event.id, 'not going')}
          disabled={loadingVote !== null}
          className={`vote-btn not-going-btn ${vote === 'not going' ? 'active' : ''} ${
            loadingVote === 'not going' ? 'loading' : ''
          }`}
        >
          {loadingVote === 'not going' ? 'Voting...' : '❌ Not Going'}
        </button>
      </div>

      {vote && (
        <p className="user-vote">
          You voted: <strong>{vote === 'going' ? '✅ Going' : '❌ Not Going'}</strong>
        </p>
      )}
    </div>
  );
};

export default EventCard;
