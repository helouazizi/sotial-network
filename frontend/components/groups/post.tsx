// frontend/app/components/post/posts.tsx
"use client";
import { useState, useEffect, useRef, useCallback, useContext } from "react";

import { Post } from "@/types/post";


import { FaPenToSquare } from "react-icons/fa6";
import { API_URL } from "@/services";
import { useParams } from "next/navigation";

import NoPostsYet from "../post/noPostsYet";
import { PopupContext } from "@/context/PopupContext";

import Postlist from "./postlist";
import CreatePostForm from "../post/addPost";
import CreatPost from "./FormCreatpost";


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

export default function PostsContainer() {  
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const page = useRef(0);
  const params = useParams();
    const popup = useContext(PopupContext);

  const fetchPosts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    
    try {
      const res = await fetch( `${API_URL}api/v1/groups/joined/${params.id}/post/getposts`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offset: page.current * LIMIT,
          limit: LIMIT,
        }),
      });

      if (!res.ok){
        popup?.showPopup("faild", "Sommething went wrong");
        return;
}
      const data = await res.json();
      console.log(data, "--------------------------------------------------------------------->data");
      
      if (!data.Post){
        return
      }

if (Array.isArray(data.Post)) {
  setPosts((prev) =>
    page.current === 0
      ? data.Post
      : [
          ...prev,
          ...data.Post.filter((p:Post) => !prev.some((post) => post.id === p.id)),
        ]
  );

  page.current += 1;

  if (data.Post.length < LIMIT) setHasMore(false);
}
else {
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
           {showForm && <CreatPost  onPostCreated={addPost }/>}
      </section>

      <section className="posts-list ">
        {posts.map((post) => (
      <Postlist key={post.id} post={post}/>
        ))}
        {!isLoading && loadedOnce && posts.length === 0 && <NoPostsYet />}
      </section>
    </>
  );
}
