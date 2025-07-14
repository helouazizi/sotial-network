
import {Comment } from '@/types/post';
import { useState } from 'react';
import CommentList from '../post/commentList';
import { FaComment } from 'react-icons/fa';



interface PostActionsProps {
  
  total_comments: number;
  comments: Comment[];
  fetchComments: () => Promise<void>;
}

export default function PostGroupActions({

  total_comments,


  comments,
  fetchComments,
}: PostActionsProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentsFetched, setCommentsFetched] = useState(false);
  const toggleComments = async () => {
    if (!showComments && !commentsFetched) {
      await fetchComments();
      setCommentsFetched(true);
    }
    setShowComments((prev) => !prev);
  };

  return (
    <div className="post-actions">
      <div className="post-btns">
        <button className="vote-btn" onClick={toggleComments}>
          <FaComment /> {total_comments}
        </button>
      </div>

      {showComments && (
        <div className="comments-section mt-4">
          <CommentList comments={comments} />
        </div>
      )}
    </div>
  );
}
