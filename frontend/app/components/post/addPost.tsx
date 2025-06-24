"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Post, PostErrors } from "@/app/types/post";


type Props = {
  onCreated: (newPost: Post) => void;
};
export default function CreatePostForm({ onCreated }: Props) {
  const [errors, setErrors] = useState<PostErrors>({})
  const[ privacy,setPrivacy] = useState("public");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("privacy", privacy);
    
    // ============ validate data in front ================//
    const fileInput = form.elements.namedItem("media") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev: PostErrors) => ({
          ...prev,
          image_error: "Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev: PostErrors) => ({
          ...prev,
          image_error: "File too large. Max 5MB allowed.",
        }));
        return;
      }

      // Optional: Check dimensions
      // await validateImageDimensions(file);
    }

    const title = formData.get("title")?.toString().trim();
    if (typeof title !== "string" || title.length < 1 || title.length > 255) {
      setErrors((prev: PostErrors) => ({
        ...prev,
        title_error: "Title must be betwen {1-255} characters",
      }));
      return;
    }

    const body = formData.get("content")?.toString().trim();
    if (typeof body !== "string" || body.length < 1 || body.length > 500) {
      setErrors((prev: PostErrors) => ({
        ...prev,
        body_error: "TBody must be betwen {1-500} characters",
      }));
      return;
    }

    const allowedPrivacy = [
      "public",
      "almost_private",
      "private",
    ];
    const privacyy = formData.get("privacy")?.toString().trim();
    if (
      !allowedPrivacy.includes(privacy)
    ) {
      setErrors((prev: PostErrors) => ({
        ...prev,
        body_error: "The privacy you provided it's not suported",
      }));
      return;
    }

    const res = await fetch("http://localhost:8080/api/v1/posts/create", {
      method: "POST",
      body: formData,
      credentials : 'include'
    });

    if (res.ok) {
      // now lets update the posta state to hold the new postscreated 
      let newPost: Post = {
        id :0,
        title: title,
        content: body,
        media_link :file?.name ? file.name: "",
        author : "test1",
        likes: 0,
        dislikes : 0,
        comments: [],
        total_comments : 0 ,
        createdAt :"2025-06-11T13:45:00Z",
        media : "",
        user_vote : null

      }
      onCreated(newPost)
      console.log(res.status)
      router.push("/");
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <>
     
     <form onSubmit={handleSubmit} className="post-form">
      <h2>Create a Post</h2>
      <label>
        Title
        <input type="text" name="title" required maxLength={255} />
        {errors.title_error && (<p className="errors">{errors.title_error}</p>)}
      </label>

      <label>
        Body
        <textarea name="content" rows={4} required maxLength={500} />
        {errors.body_error && (<p className="errors">{errors.body_error}</p>)}
      </label>

      <label>
        Image or GIF
        <input type="file" name="media" accept="image/*,image/gif" />
        {errors.image_error && (<p className="errors">{errors.image_error}</p>)}
      </label>

      <label>
        Privacy
        <select
          name="privacy"
          value={privacy}
          onChange={(e) => (setPrivacy(e.target.value))}
        >
          <option value="public">Public (for all users)</option>
          <option value="almost_private">
            Almost Private (for followers onlly)
          </option>
          <option value="private">Private (for specific folowers)</option>
        </select>
        {errors.privacy_error && (<p className="errors">{errors.privacy_error}</p>)}
      </label>

      <button type="submit" className="submit-post-btn">Submit Post</button>
    </form>
    </>
  );
}



