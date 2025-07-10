
export default function PostHeader({ author, createdAt, avatarUrl }: { author: string; createdAt: string, avatarUrl: string | undefined }) {
  const baseUrl = avatarUrl ? `http://localhost:8080/images/user/${avatarUrl}` : "avatar.png"
  return (
    <div className="post-meta">
      <img src={baseUrl} alt={`${author}'s avatar`} className="post-avatar" />
      <span>
      {author} • {createdAt ? new Date(createdAt).toLocaleTimeString():""}
      </span>
    </div>
  );
}
