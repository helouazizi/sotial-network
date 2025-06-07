
'use client';
// import { pages } from "next/dist/build/templates/app-page";
// import styles from "./page.module.css";
import { usePosts } from '@/context/PostContext';

export default function Home() {
  const { posts, addPost } = usePosts()

  const handleCreatePost = () => {
    const newPost = {
      id: Date.now(),
      title: 'New post',
      content: 'This is a new post',
      author: 'User123',
      createdAt: new Date().toISOString(),
    };

    addPost(newPost); // updates the context instantly
  };


  return (
    <main>
      <h1>Home Feed</h1>
      <button onClick={handleCreatePost}>Create Post</button>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>By {post.author} on {new Date(post.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </main>
  );
}
