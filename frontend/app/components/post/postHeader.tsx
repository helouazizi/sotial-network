
export default function PostHeader({ author, createdAt, avatarUrl }: { author: string; createdAt: string, avatarUrl: string }) {
  const baseUrl = "http://localhost:8080/images/user/"
  return (
    <div className="post-meta">
      <img src={baseUrl+avatarUrl} alt={`${author}'s avatar`} className="post-avatar" />
      <span>
      {author} • {createdAt ? new Date(createdAt).toLocaleTimeString():""}
      </span>
    </div>
  );
}
