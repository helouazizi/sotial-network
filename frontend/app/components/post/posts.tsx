"use client";
import { useState, useEffect, useRef } from "react";
import CreatePostForm from "./addPost";
import { Post } from "@/app/types/post";
import PostCard from "./postcrad";

const LIMIT = 10;

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const page = useRef(0)

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/posts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: 0 * LIMIT,
          limit: LIMIT,
        }),
      });
      const data = await res.json();
      if (data) {
        console.log(data, "data")
        setPosts(data)
      }

    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };


  useEffect(() => { fetchPosts() }, [])

  // lets craete the add posts componnent here to accec the posts state
  const addPost = (newPost: Post) => {
    setPosts(prev => {
      const nextId = prev.length + 1
      return [{ ...newPost, id: nextId }, ...prev];
    });
  }
  /* ---------- local updates ---------- */
  const updatePost = (postId: number, updated: Partial<Post>) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, ...updated } : p))
    );
  };

  return (
    <>
      <section className="create-post">
        <CreatePostForm onCreated={addPost} />
      </section>
      <section className="posts-list">
        {Array.isArray(posts) && posts.length > 0 ? (
          <>
            {posts.map((p) => (
              <PostCard key={p.id} post={p} onPostUpdate={updatePost} />
            ))}
          </>
        ) : (
          <p>No posts available.</p> // Optional fallback
        )}
      </section>

    </>

  );
}
