// components/Posts.tsx
"use client";
import { useState, useEffect } from "react";
import { Post } from "@/app/types/post";
import PostCard from "./postcrad";
import { NoPostsMessage } from "./noPosts";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setLoading] = useState(true);
  //https://jsonplaceholder.typicode.com/posts
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/posts")
      .then((res) => res.json())
      .then((data) => {
        // Add dummy likes/comments to each post
        let vertualPosts: Post[] = [];
        if (data)
          vertualPosts = data.map((post: Post) => ({
            ...post,
            likes: post.likes || 0,
            dislikes: post.dislikes || 0,
            totalComments: post.totalComments || 0,
            comments: post.comments || [],
          }));

        setPosts(vertualPosts);
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
        <NoPostsMessage />
      )}
    </div>
  );
}
