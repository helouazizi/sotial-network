import { useState, useRef } from "react";
import { BsFillSendFill } from "react-icons/bs";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

export default function CommentPostForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [img, setImg] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentErr , setCommentErr] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setCommentErr("unsuported file type")
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size >= maxSize){
        setCommentErr("file too large")
      }
      setImg(file);
    }
  };


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
        className="vote-btn"
      >
        <BsFillSendFill />
      </button>
    </form>
  );
}
