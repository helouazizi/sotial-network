export default function PostMeta({ author, createdAt }: { author: string; createdAt: string }) {
  return (
    <div className="post-meta">
      By {author} • {new Date(createdAt).toLocaleString()}
    </div>
  );
}
