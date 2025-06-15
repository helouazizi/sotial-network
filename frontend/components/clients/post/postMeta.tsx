
export default function PostMeta({ author, createdAt, avatarUrl }: { author: string; createdAt: string, avatarUrl: string }) {

  return (
    <div className="post-meta">
      <img src={avatarUrl} alt={`${author}'s avatar`} className="avatar" />
      <span>
        By {author} • {new Date(createdAt).toLocaleTimeString()}
      </span>
    </div>
  );
}
