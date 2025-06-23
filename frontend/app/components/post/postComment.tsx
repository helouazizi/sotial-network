import { useState } from "react";
import { Post } from "@/app/types/post";
import { BsFillSendFill } from "react-icons/bs";
export default function PostComment({
  post,
  onPostUpdate,
}: {


  
  post: Post;
  onPostUpdate: (id: number, updatedPost: Partial<Post>) => void;
}) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleAddComment = async () => {
    const txt = comment.trim();

    if (txt.length < 3 || sending) return;           
    setSending(true);

    const tempComment = {
      comment: txt,
      author: "you",                                 
      created_at: new Date().toISOString(),
    };
    onPostUpdate(post.id, {
      comments: [tempComment, ...(post.comments || [])],
      total_comments: post.total_comments + 1,
    });
    setComment("");

    try {
      const res = await fetch("http://localhost:8080/api/v1/posts/addComment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",                    
        body: JSON.stringify({
          post_id: post.id,
          comment: txt,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
     
    } catch (err) {
      console.error("❌ comment failed:", err);
      onPostUpdate(post.id, {
        comments: post.comments,                    // restore original slice
        total_comments: post.total_comments,
      });
      alert("Could not save your comment. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="post-comment">
      <input
        placeholder="Write a comment…"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={sending}
      />
      <button onClick={handleAddComment} disabled={sending}>
      <BsFillSendFill />
      </button>
    </div>
  );
}
