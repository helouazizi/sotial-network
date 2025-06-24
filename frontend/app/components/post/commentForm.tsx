import { useState } from "react";
// import { Post } from "@/app/types/post";
import { BsFillSendFill } from "react-icons/bs";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

export default function CommentPostForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    onSubmit(comment);
    setComment(""); // Clear input after submission
  };

  return (

    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className=""
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      <button
        type="submit"
        className=""
      >
        <BsFillSendFill />
      </button>
    </form>
    // <div className="post-comment">
    //   <input
    //     type="text"
    //     placeholder="Write a comment…"
    //     value={comment}
    //     onChange={(e) => setComment(e.target.value)}
    //   />
    //   <button
    //     onClick={()=>{onSubmit}}
    //     title="Post comment"
    //   >
    //     <BsFillSendFill />
    //   </button>
    // </div>
  );
}
