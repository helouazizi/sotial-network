"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import CreatePostForm from "./addPost";
import { Post } from "@/app/types/post";
import PostCard from "./postcrad";

const LIMIT = 10;
//  bbbbbbbbbbbbbbbbbbbbbbbbbbe care full the posts duplacetesd

/* ---- Throttle utility ---- */
function throttle<T extends (...args: any[]) => void>(fn: T, delay = 500): T {
  let lastCall = 0;
  // @ts-ignore
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}


export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const page = useRef(0);

  /* ---- Fetch Posts ---- */
const fetchPosts = useCallback(async () => {
  if (isLoading || !hasMore) return;
  setIsLoading(true);

  try {
    const res = await fetch("http://localhost:8080/api/v1/posts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        offset: page.current * LIMIT,
        limit: LIMIT,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const data = await res.json();

    if (Array.isArray(data)) {
      // 👉 On first load (page.current === 0), replace; otherwise append
      console.log(data,"posts")
      setPosts(prev =>
        page.current === 0
          ? data
          : [...prev, ...data.filter(p => !prev.some(post => post.id === p.id))]
      );

      page.current += 1;

      if (data.length < LIMIT) setHasMore(false);
    } else {
      setHasMore(false);
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  } finally {
    setIsLoading(false);
    setLoadedOnce(true);
  }
}, [isLoading, hasMore]);

  /* ---- Initial Load ---- */
  useEffect(() => {
    fetchPosts();
  }, []);

  /* ---- Scroll Event with Throttle ---- */
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= docHeight - 150 && hasMore && !isLoading) {
        fetchPosts();
      }
    }, 1000);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts, hasMore, isLoading]);

  /* ---- Helpers ---- */
  const addPost = (newPost: Post) => {
    setPosts(prev => [{ ...newPost, id: prev.length + 1 }, ...prev]);
  };

  const updatePost = (postId: number, updated: Partial<Post>) => {
    setPosts(prev =>
      prev.map(post => (post.id === postId ? { ...post, ...updated } : post))
    );
  };

  /* ---- Render ---- */
  return (
    <>
      <section className="create-post">
        <CreatePostForm onCreated={addPost} />
      </section>

      <section className="posts-list space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onPostUpdate={updatePost} />
        ))}

        {isLoading && <p className="loading">Loading...</p>}

        {!isLoading && loadedOnce && posts.length === 0 && (
          <p className="no-posts">No posts available.</p>
        )}

        {!isLoading && !hasMore && posts.length > 0 && (
          <p className="no-posts">No more posts.</p>
        )}
      </section>
    </>
  );
}
