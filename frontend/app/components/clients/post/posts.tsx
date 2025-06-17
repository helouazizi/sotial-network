// components/Posts.tsx
"use client";
import { useState, useEffect, Component } from "react";
import { Post } from "@/app/types/post";
import PostCard from "./postcrad";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(true);
  //https://jsonplaceholder.typicode.com/posts
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/posts")
      .then((res) => res.json())
      .then((data) => {
        // Add dummy likes/comments to each post
        let enriched: Post[] = [];
        if (data)
          enriched = data.map((post: Post) => ({
            ...post,
            likes: 0,
            dislikes: 0,
            comments: post.comments,
            totalComments: 0,
          }));

        setPosts(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setLoading(false);
      });
  }, []);

  const updatePost = (postId: number, updatedPost: Partial<Post>) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updatedPost } : p))
    );
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="posts-page">
      {posts && posts.length > 0 ? (
        <ul className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
          ))}
        </ul>
      ) : (
        <div className="no-posts-message">
          <h2>No posts yet</h2>
          <p>Looks like there’s nothing here. Start by creating a new post!</p>
        </div>
      )}
    </div>
  );
}
