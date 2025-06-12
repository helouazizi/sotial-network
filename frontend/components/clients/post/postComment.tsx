import { useState } from 'react';
import { Post } from '@/types/post';
export default function PostComment({
  post,
  onPostUpdate
}: {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;
}) {

  const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (comment.trim()) {
      const updatedComments = [ { comment: comment },...post.comments];
      onPostUpdate(post.id, { comments: updatedComments,totalComments: post.totalComments + 1 });
      setComment('');
    }
  };
  return (
    <div className="post-comment">
      <input
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleAddComment}>💬 Send</button>
    </div>

  );
}