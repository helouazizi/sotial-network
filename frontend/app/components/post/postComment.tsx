import { useState } from "react";
import { Post } from "@/app/types/post";
import { BsFillSendFill } from "react-icons/bs";

type PostCommentProps = {
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;
};

export default function PostComment({ post, onPostUpdate }: PostCommentProps) {
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleAddComment = async () => {
    const trimmed = commentText.trim();
    if (isSending) return;

    setIsSending(true);

    const optimisticComment = {
      comment: trimmed,
      author: {user_name :"you",first_name : "You",last_name:"You",avatar : "avatar.png"},
      created_at: new Date().toISOString(),
    };

    // Optimistically update UI
    const previousComments = post.comments || [];
    onPostUpdate(post.id, {
      comments: [optimisticComment, ...previousComments],
      total_comments: post.total_comments + 1,
    });

    setCommentText("");

    try {
      const response = await fetch("http://localhost:8080/api/v1/posts/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          post_id: post.id,
          comment: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("❌ Failed to post comment:", error);
      // Roll back optimistic update
      onPostUpdate(post.id, {
        comments: previousComments,
        total_comments: post.total_comments,
      });

      setCommentText(trimmed); // Restore input
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="post-comment">
      <input
        type="text"
        placeholder="Write a comment…"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        disabled={isSending}
      />
      <button
        onClick={handleAddComment}
        disabled={isSending || commentText.trim().length < 3}
        title="Post comment"
      >
        <BsFillSendFill />
      </button>
    </div>
  );
}
