"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Post } from "@/app/types/post";
import PostCard from "./postcrad";
import { NoPostsMessage } from "./noPosts";

const LIMIT = 10;

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setLoading] = useState(false);

  /* ---------- refs so we can read/update synchronously ---------- */
  const pageRef = useRef(0);
  const isFetchingRef = useRef(false);

  /* ---------- atomic fetch ---------- */
  const fetchPosts = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    const page = pageRef.current;               // snapshot current page
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/posts?start=${page * LIMIT}&limit=${LIMIT}`
      );
      const data = await res.json();

      if (data && data.length < LIMIT) setHasMore(false);
      // console.log(data.length,"post length")
      let virtualPosts: Post[]
      if (data) {
        console.log(data,"data")
        virtualPosts = data.map((post: Post) => ({
          ...post,
          likes: post.likes ?? 0,
          dislikes: post.dislikes ?? 0,
          totalComments: post.totalComments ?? 0,
          comments: post.comments ?? [],
        }));
      }


      /* dedupe just in case the API returns overlapping rows */
      setPosts(prev => {
        const seen = new Set(prev.map(p => p.id));
        const merged = [...prev];
        if (virtualPosts) {
          virtualPosts.forEach(p => {
            if (!seen.has(p.id)) merged.push(p);
          });
        }

        return merged;
      });

      pageRef.current += 1;                     // bump page **once** per call
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  /* ---------- initial load ---------- */
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* ---------- infinite scroll listener ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 120;
      if (nearBottom) fetchPosts();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts]);

  /* ---------- local updates ---------- */
  const updatePost = (postId: number, updated: Partial<Post>) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, ...updated } : p))
    );
  };

  /* ---------- UI ---------- */
  return (
    <section className="posts-list">
      {posts.length ? (
        <>
          {posts.map(p => (
            <PostCard key={p.id} post={p} onPostUpdate={updatePost} />
          ))}
          {isLoading && <p>Loading…</p>}
          {!hasMore && <p style={{ textAlign: "center" }}>No more posts</p>}
        </>
      ) : isLoading ? (
        <p>Loading…</p>
      ) : (
        <NoPostsMessage />
      )}
    </section>
  );
}
