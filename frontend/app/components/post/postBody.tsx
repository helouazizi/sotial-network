export default function PostBody({
  title,
  content,
  media,
}: {
  title: string;
  content: string;
  media: string;
}) {
  const baseMediaPath = "http://localhost:8080/images/posts/undefined";

  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {media && media !== baseMediaPath && (
        <img src={media} alt={title} className="postImg" />
      )}
    </div>
  );
}
