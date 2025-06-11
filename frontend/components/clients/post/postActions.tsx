export default function PostActions({ postId }: { postId: number }) {
  return (
    <div className="post-actions">
      <div>
        <button>👍 <span className="extra"> Like</span></button>
        <button>👎 <span className="extra"> Dislike</span></button>
        <button>💬 <span className="extra"> Comment</span></button>
      </div>
      <div>
        <button>📤 <span className="extra"> Send</span></button> {/* Paper plane for send */}
      </div>
    </div>
  );
}

