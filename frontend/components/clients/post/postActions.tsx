import { Post } from "@/types/post";
import { useState } from "react";
export default function PostActions({
  post,
  onPostUpdate
}: {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<any>) => void;
}) {

  // lest create likes state 
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null)

  const handleLike = () => {
   if (userVote === 'like') {
      // Remove like
      onPostUpdate(post.id, { likes: post.likes - 1 });
      setUserVote(null);
    } else if (userVote === 'dislike') {
      // Remove dislike and add like
      onPostUpdate(post.id, {
        dislikes: post.dislikes - 1,
        likes: post.likes + 1
      });
      setUserVote('like');
    } else {
      // First time liking
      onPostUpdate(post.id, { likes: post.likes + 1 });
      setUserVote('like');
    }
  };

  const handDislike = () => {
    if (userVote === 'dislike') {
      // Remove dislike
      onPostUpdate(post.id, { dislikes: post.dislikes - 1 });
      setUserVote(null);
    } else if (userVote === 'like') {
      // Remove like and add dislike
      onPostUpdate(post.id, {
        likes: post.likes - 1,
        dislikes: post.dislikes + 1
      });
      setUserVote('dislike');
    } else {
      // First time disliking
      onPostUpdate(post.id, { dislikes: post.dislikes + 1 });
      setUserVote('dislike');
    }
  };
  return (
    <div className="post-actions">
      <div>
        <button onClick={handleLike}>👍 <span className="extra">{post.likes}   Like</span></button>
        <button onClick={handDislike}>👎 <span className="extra">{post.dislikes} Dislike</span></button>
        <button >💬 <span className="extra">{post.comments.length} Comment</span></button>
      </div>

    </div>
  );
}

