import { Comment } from "@/types/post";
import PostHeader from "./postHeader";
import PostBody from "./postBody";
import PostGroupBody from "../groups/PostGroupBody";
interface CommentListProps {
    comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
    console.log(comments,'commonts');
    
    return (
        <div className="comments-list">
            {comments && comments.map((c, idx) => (
                <div key={idx} className="comment">
                    <PostHeader
                        author={c.author.nickname}
                        firstname= {c.author.firstname}
                        lastname= {c.author.lastname}
                        createdAt={c.created_at}
                        avatarUrl={c.author.avatar ? c.author.avatar: undefined}
                    />
                    <PostGroupBody content={c.comment} title="" media={c.media_link || ""} body_type="comment" />
                </div>
            ))}
        </div>
    );
}
