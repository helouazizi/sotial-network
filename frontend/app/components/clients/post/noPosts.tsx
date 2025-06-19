"use client";
import { useRouter } from "next/navigation";

export const NoPostsMessage = () => {
  const router = useRouter();

  const handleAddPostClick = () => {
    router.push("/addPost");
  };

  return (
    <div className="no-posts-message">
      <h2>No posts yet</h2>
      <p>Looks like there’s nothing here. Start by creating a new post!</p>
      <button className="create-post-button" onClick={handleAddPostClick}>
        Add Post
      </button>
    </div>
  );
};

