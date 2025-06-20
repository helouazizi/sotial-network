import { Post, Comment } from "@/app/types/post";
import { useState } from "react";
import PostMeta from "./postMeta";
import PostBody from "./postBody";

export default function PostActions({
  post,
  onPostUpdate,

}: {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;
 
}) {
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (userVote === "like") {
      onPostUpdate(post.id, { likes: post.likes - 1 });
      setUserVote(null);
    } else if (userVote === "dislike") {
      onPostUpdate(post.id, {
        dislikes: post.dislikes - 1,
        likes: post.likes + 1,
      });
      setUserVote("like");
    } else {
      onPostUpdate(post.id, { likes: post.likes + 1 });
      setUserVote("like");
    }
  };

  const handleDislike = () => {
    if (userVote === "dislike") {
      onPostUpdate(post.id, { dislikes: post.dislikes - 1 });
      setUserVote(null);
    } else if (userVote === "like") {
      onPostUpdate(post.id, {
        likes: post.likes - 1,
        dislikes: post.dislikes + 1,
      });
      setUserVote("dislike");
    } else {
      onPostUpdate(post.id, { dislikes: post.dislikes + 1 });
      setUserVote("dislike");
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev); // toggle state
  };

  return (
    <div className="post-actions">
      <div>
        <button onClick={handleLike}>
          👍 {post.likes} <span className="extra"> Like</span>
        </button>
        <button onClick={handleDislike}>
          👎 {post.dislikes} <span className="extra"> Dislike</span>
        </button>
        <button onClick={toggleComments}>
          💬 {post.total_comments} <span className="extra">Comment</span>
        </button>
      </div>

      {showComments && post.comments.length > 0 && (
        <div className="comments-list">
          <ul>
            {post.comments.map((c: Comment, i: number) => (
              <li key={i}>
                <PostMeta
                  author={`user-${c.author}`}
                  createdAt="2025-06-11T13:45:00Z"
                  avatarUrl="/avatar.png"
                />{" "}
                <PostBody content={c.comment} title="" media="" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
