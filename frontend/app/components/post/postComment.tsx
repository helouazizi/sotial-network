import { useState } from "react";
import { Post } from "@/app/types/post";
export default function PostComment({
  post,
  onPostUpdate,
}: {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;
}) {
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        comment: comment,
        author: "Anonymous", // Replace with actual author if available
        created_at: new Date().toISOString(),
      };
      const updatedComments = [newComment, ...(post.comments || [])];
      onPostUpdate(post.id, {
        comments: updatedComments,
        total_comments: post.total_comments + 1,
      });
      setComment("");
    }
  };



  return (
    <div className="post-comment">
      <input
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value.trim())}
      />
      <button onClick={handleAddComment}>
        💬 <span className="extra"> Send</span>
      </button>
    </div>
  );
}
