import { useState, useRef } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FaImage } from "react-icons/fa";

interface CommentFormProps {
  onSubmit: (text: string) => void;
}

export default function CommentPostForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [img, setImg] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [commentErr, setCommentErr] = useState("")

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
      if (file.size >= maxSize) {
        setCommentErr("file too large")
      }
      setImg(file);
      console.log(file.name, "comment file")
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() && !img) return;
    onSubmit(comment);
    setComment(""); // Clear input after submission
    setImg(null);
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form ">
      <div className="input-row">
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="button"
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Upload image or GIF"
        >
          <FaImage />
         {img&& (<span className="comment-img-name">{img.name}</span>)}
        </button>
        <input
          type="file"
          name="media"
          accept="image/*,image/gif"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </div>
      <button type="submit" className="vote-btn">
        <BsFillSendFill />
      </button>
    </form>

  );
}
