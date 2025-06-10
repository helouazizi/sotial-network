export default function PostActions({ postId }: { postId: number }) {
  return (
    <div className="post-actions">
      <button>👍 Like</button>
      <button>👎 Dislike</button>
      <button>💬 Comment</button>
    </div>
  );
}
