import { Comment } from "@/types/post";
import PostHeader from "./postHeader";
import PostBody from "./postBody";
interface CommentListProps {
    comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
    return (
        <div className="comments-list">
            {comments && comments.map((c, idx) => (
                <div key={idx} className="comment">
                    <PostHeader
                        author={c.author.user_name || `${c.author.first_name}-${c.author.last_name}`}
                        createdAt={c.created_at}
                        avatarUrl={c.author.avatar ? c.author.avatar : "avatar.png"}
                    />
                    <PostBody content={c.comment} title="" media={c.media_link || ""} body_type="comment" />
                </div>
            ))}
        </div>
    );
}
