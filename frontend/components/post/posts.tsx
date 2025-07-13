// frontend/app/components/post/posts.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import CreatePostForm from "./addPost";
import { Post } from "@/types/post";
import PostCard from "./postCrad";
import NoPostsYet from "./noPostsYet";
import { FaPenToSquare } from "react-icons/fa6";
import NoMorePosts from "./noMorePosts";

const LIMIT = 10;

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
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const page = useRef(0);


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
        setPosts((prev) =>
          page.current === 0
            ? data
            : [
              ...prev,
              ...data.filter((p) => !prev.some((post) => post.id === p.id)),
            ]
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

  
  useEffect(() => {
    fetchPosts();
  }, []);

  
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



  const addPost = (newPost: Post ) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowForm(false);
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev); 
  };

  return (
    <>
      <section className="create-post">
        <div className="add-post-holder">
          <button className="addPostBtn" onClick={toggleForm}>
            <FaPenToSquare className="addPostIcon" /> Add-Post
          </button>
        </div>
        {showForm && <CreatePostForm onCreated={addPost}  />}
      </section>

      <section className="posts-list ">
        {posts.map((post) => (
          <PostCard key={post.id} post={post}  />
        ))}
        {!isLoading && loadedOnce && posts.length === 0 && <NoPostsYet />}
        {!isLoading && !hasMore && posts.length > 0 && <NoMorePosts />}
      </section>
    </>
  );
}
