import { Comment } from "@/app/types/post";
import { useState } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import CommentList from "./commentList";

interface PostActionsProps {
  likes: number;
  dislikes: number;
  total_comments: number;
  userVote: "like" | "dislike" | null;
  onVote: (action: "like" | "dislike") => void;
  comments: Comment[];
  fetchComments: () => Promise<void>;
}

export default function PostActions({
  likes,
  dislikes,
  total_comments,
  userVote,
  onVote,
  comments,
  fetchComments,
}: PostActionsProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentsFetched, setCommentsFetched] = useState(false);
  console.log(comments, "jjjjjj")
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
        <button
          onClick={() => onVote("like")}
          className={`vote-btn like ${userVote === "like" ? "voted" : ""}`}
        >
          <AiFillLike /> {likes}
        </button>

        <button
          onClick={() => onVote("dislike")}
          className={`vote-btn dislike ${userVote === "dislike" ? "voted" : ""}`}
        >
          <AiFillDislike /> {dislikes}
        </button>

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
