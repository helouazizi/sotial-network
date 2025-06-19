export default function PostBody({
  title,
  content,
  media,
}: {
  title: string;
  content: string;
  media: string;
}) {
  const dataUrl = media ? `data:image/jpeg;base64,${media}` : null;

  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {dataUrl && (
        <img
          src={dataUrl}
          alt={title}
          className="w-full h-auto rounded"
        />
      )}
    </div>
  );
}

