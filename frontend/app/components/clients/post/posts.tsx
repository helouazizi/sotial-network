"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Post } from "@/app/types/post";
import PostCard from "./postcrad";
import { NoPostsMessage } from "./noPosts";

const LIMIT = 10;

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts?start=${0 * LIMIT}&limit=${LIMIT}`
      );
      const data = await res.json();
      // let virtualPosts: Post[]
      if (data) {
        console.log(data, "data")
        // virtualPosts = data.map((post: Post) => ({
        //   ...post,
        //   likes: post.likes ?? 0,
        //   dislikes: post.dislikes ?? 0,
        //   totalComments: post.totalComments ?? 0,
        //   comments: post.comments ?? [],
        // }));
        setPosts(data)
      }

    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };


  useEffect(() => { fetchPosts() }, [])


  /* ---------- local updates ---------- */
  const updatePost = (postId: number, updated: Partial<Post>) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, ...updated } : p))
    );
  };


  return (
    <section className="posts-list">
      {posts.length > 0 ? (
        <>
          {posts.map(p => (
            <PostCard key={p.id} post={p} onPostUpdate={updatePost} />
          ))}

        </>
      ) : (
        <NoPostsMessage />
      )}
    </section>
  );
}
