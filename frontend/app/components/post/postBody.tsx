export default function PostBody({
  title,
  content,
  media,
}: {
  title: string;
  content: string;
  media: string;
}) {
  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {media && (
        <img
          src={media}
          alt={title}
          className="postImg"
        />
      )}
    </div>
  );
}

