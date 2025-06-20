export default function PostBody({
  title,
  content,
  media,
}: {
  title: string;
  content: string;
  media: string;
}) {

  console.log("=>>>>>>>>>>>", media)

  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {media && (
        <img
          src={`http://localhost:8080/images/posts/${media}`}
          alt={title}
          className="postImg"
        />
      )}
    </div>
  );
}

