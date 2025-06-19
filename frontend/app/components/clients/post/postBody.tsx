export default function PostBody({ title, content, media }: { title: string; content: string; media: string }) {
  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>

      {media && (
        <img
          src={`data:image/jpeg;base64,${media}`}
          alt={title}
          className="w-full h-auto rounded"
        />
      )}
    </div>
  );
}
