'use client'

import { useState, useEffect } from "react"
import { Post } from "@/types/post";
import PostCard from "./postcrad";



export default function Posts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data)
                setLoading(false)
            }).catch(err => {
                console.error('Error fetching posts:', err);
                setLoading(false);
            })
    }, [])

    if (isLoading) return <p>Loading...</p>;
    return (
        <div className="posts-page">
            <ul className="posts-list">
                {posts.map(post => (
                    <PostCard key={post.id} post={post}/>
                ))}
            </ul>
        </div>
    );
}