
import { useState } from "react";
export default function PostActions({
  post,
  onPostUpdate
}: {
  post: any;
  onPostUpdate: (id: number, updatedPost: Partial<any>) => void;
}) {

   const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    onPostUpdate(post.id, { likes: post.likes + 1 });
  };

  const handDislike = () => {
    onPostUpdate(post.id, { dislikes: post.dislikes + 1 });
  };
  return (
    <div className="post-actions">
      <div>
        <button onClick={handleLike}>👍 <span className="extra">{post.likes}   Like</span></button>
        <button onClick={handDislike}>👎 <span className="extra">{post.dislikes} Dislike</span></button>
        <button onClick={() => setShowComments(!showComments)}>💬 <span className="extra">{post.comments.length} Comment</span></button>
      </div>
      
    </div>
  );
}

