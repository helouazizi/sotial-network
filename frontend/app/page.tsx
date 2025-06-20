"use client";
import Posts from "@/app/components/post/posts";
import CreatePostForm from "./components/post/addPost";

export default function Home() {

  return (
    <main>
      <section className="create-post">
        <CreatePostForm />
      </section>
      <Posts />
    </main>

  );
}
