import { API_URL } from "@/services";

export default function PostGroupBody({
  title,
  content,
  media,
  body_type,
}: {
  title: string;
  content: string;
  media: string;
  body_type: string;
}) {
  let baseMediaPath =
    body_type == "post"
      ? `${API_URL}images/posts/`
      : `${API_URL}images/comments/`;

  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {media && (
        <img src={baseMediaPath + media} alt={title} className="postImg" />
      )}
    </div>
  );
}
