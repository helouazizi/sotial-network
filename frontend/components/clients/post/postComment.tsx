import { useState } from 'react';
export default function PostComment({
    post,
    onPostUpdate
}: {
    post: any;
    onPostUpdate: (id: number, updatedPost: Partial<any>) => void;
}) {

    const [comment, setComment] = useState('');

  const handleAddComment = () => {
    if (comment.trim()) {
      const updatedComments = [...post.comments, { content: comment }];
      onPostUpdate(post.id, { comments: updatedComments });
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
      <div className="comments-list">
        {post.comments.map((c: any, i: number) => (
          <p key={i}>💬 {c.content}</p>
        ))}
      </div>
    </div>

    );
}