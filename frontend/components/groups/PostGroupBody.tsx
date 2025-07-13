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
      ? "http://localhost:8080/images/groupePost/"
      : "http://localhost:8080/images/groupeComment/";

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
