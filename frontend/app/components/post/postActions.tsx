import { Post } from "@/app/types/post";
import { useState, useEffect } from "react";

import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import CommentList from "./commentList";


export default function PostActions({
  post,
  onPostUpdate,
}: {
  post: Post;
  onPostUpdate: (id: number, updated: Partial<Post>) => void;
}) {
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null);
  const [showComments, setShowComments] = useState(false);

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
      <div className="post-btns">
        <button
          onClick={handleLike}
          className={`vote-btn like ${userVote === "like" ? "voted" : ""}`}
        >
          <AiFillLike /> {post.likes}
        </button>

        <button
          onClick={handleDislike}
          className={`vote-btn dislike ${userVote === "dislike" ? "voted" : ""}`}
        >
          <AiFillDislike /> {post.dislikes}
        </button>

        <button className="vote-btn" onClick={() => setShowComments(!showComments)}>
          <FaComment /> {post.total_comments}
        </button>
      </div>

      {showComments && (
        <CommentList postId={post.id} />
      )}
    </div>
  );
}
