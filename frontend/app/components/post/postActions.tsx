import { Post, Comment } from "@/app/types/post";
import { useState, useEffect } from "react";
import PostMeta from "./postMeta";
import PostBody from "./postBody";

export default function PostActions({
  post,
  onPostUpdate,
}: {
  post: Post;
  onPostUpdate: (id: number, updated: Partial<Post>) => void;
}) {
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [showComments, setShowComments] = useState(false);

  /** keep local state in sync with backend value */
  useEffect(() => {
    setUserVote(
      post.user_vote === "like" || post.user_vote === "dislike"
        ? post.user_vote
        : null
    );
  }, [post.user_vote]);




  const votePost = async (
    action: "like" | "dislike" | "unlike" | "undislike"
  ) => {
    const res = await fetch("http://localhost:8080/api/v1/posts/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ post_id: post.id, action }),
    });
    if (!res.ok) throw new Error(await res.text());
  };


  const handleLike = async () => {
    const prevVote = userVote;
    try {
      if (prevVote === "like") {
        onPostUpdate(post.id, { likes: post.likes - 1, user_vote: null });
        setUserVote(null);
        await votePost("unlike");
      } else if (prevVote === "dislike") {
        onPostUpdate(post.id, {
          dislikes: post.dislikes - 1,
          likes: post.likes + 1,
          user_vote: "like",
        });
        setUserVote("like");
        await votePost("like");
      } else {
        onPostUpdate(post.id, { likes: post.likes + 1, user_vote: "like" });
        setUserVote("like");
        await votePost("like");
      }
    } catch (e) {
      // rollback on error
      onPostUpdate(post.id, { user_vote: prevVote });
      setUserVote(prevVote);
      console.error("Vote error", e);
    }
  };

  /* -------------- Dislike handler ----------- */
  const handleDislike = async () => {
    const prevVote = userVote;
    try {
      if (prevVote === "dislike") {
        onPostUpdate(post.id, { dislikes: post.dislikes - 1, user_vote: null });
        setUserVote(null);
        await votePost("undislike");
      } else if (prevVote === "like") {
        onPostUpdate(post.id, {
          likes: post.likes - 1,
          dislikes: post.dislikes + 1,
          user_vote: "dislike",
        });
        setUserVote("dislike");
        await votePost("dislike");
      } else {
        onPostUpdate(post.id, {
          dislikes: post.dislikes + 1,
          user_vote: "dislike",
        });
        setUserVote("dislike");
        await votePost("dislike");
      }
    } catch (e) {
      onPostUpdate(post.id, { user_vote: prevVote });
      setUserVote(prevVote);
      console.error("Vote error", e);
    }
  };

  return (
    <div className="post-actions">
      <button
        onClick={handleLike}
        className={userVote === "like" ? "vote-btn active" : "vote-btn"}
      >
        👍 {post.likes} <span className="extra">Like</span>
      </button>

      <button
        onClick={handleDislike}
        className={userVote === "dislike" ? "vote-btn active" : "vote-btn"}
      >
        👎 {post.dislikes} <span className="extra">Dislike</span>
      </button>

      <button onClick={() => setShowComments(!showComments)}>
        💬 {post.total_comments} <span className="extra">Comment</span>
      </button>

      {showComments && post.comments && (
        <ul className="comments-list">
          {post.comments.map((c: Comment, i) => (
            <li key={i}>
              <PostMeta
                author={`user-${c.author}`}
                createdAt={c.created_at}
                avatarUrl="/avatar.png"
              />
              <PostBody content={c.comment} title="" media="" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
