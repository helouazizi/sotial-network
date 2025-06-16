export default function PostBody({ title, content }: { title: string; content: string }) {
  return (
    <div className="post-body">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}
