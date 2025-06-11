// components/Posts.tsx
'use client';
import { useState, useEffect } from "react";
import { Post } from "@/types/post";
import PostCard from "./postcrad";

export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                // Add dummy likes/comments to each post
                const enriched = data.map((post: Post) => ({
                    ...post,
                    likes: 0,
                    dislikes: 0,
                    comments: [],
                    totalComments: 0
                }));
                setPosts(enriched);
                setLoading(false);
            }).catch(err => {
                console.error('Error fetching posts:', err);
                setLoading(false);
            });
    }, []);

    const updatePost = (postId: number, updatedPost: Partial<Post>) => {
        setPosts(prev =>
            prev.map(p => p.id === postId ? { ...p, ...updatedPost } : p)
        );
    };

    if (isLoading) return <p>Loading...</p>;

    return (
        <div className="posts-page">
            <ul className="posts-list">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
                ))}
            </ul>
        </div>
    );
}
