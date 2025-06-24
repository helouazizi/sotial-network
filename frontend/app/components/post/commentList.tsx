// app/components/commentList.tsx
import { useEffect, useState } from "react";
import { Comment } from "@/app/types/post";
import PostMeta from "./postMeta";
import PostBody from "./postBody";

export default function CommentList({ postId }: { postId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/posts/getComments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        post_id: postId,
                    }),
                });

                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setComments(data);
            } catch (err: any) {
                console.error("Failed to load comments:", err);

            }
        };

        fetchComments();
    }, [postId]);


    return (
        <div className="comments-list">
            {comments && comments.map((c, i) => (
                <div className="comment" key={i}>
                    <PostMeta
                        author={c.author.user_name || `${c.author.first_name}-${c.author.last_name}`}
                        createdAt={c.created_at}
                        avatarUrl={`http://localhost:8080/images/Auth/${c.author.avatar}`}
                    />
                    <PostBody content={c.comment} title="" media="" />
                </div>
            ))}
        </div>
    );
}
