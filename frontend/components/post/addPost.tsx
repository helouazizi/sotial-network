"use client";
import React, { useState, useEffect, useRef } from "react";
import { Post, PostErrors, Follower } from "@/types/post";
import { GetFolowers } from "@/services/postsServices";
import PostHeader from "./postHeader";
import { FaImage } from "react-icons/fa";
import { SocketContext } from "@/context/socketContext"; // Adjust path if different
import { useContext } from 'react';
type Props = {
  onCreated: (newPost: Post) => void,

};

export default function CreatePostForm({ onCreated }: Props) {
  const { user } = useContext(SocketContext) ?? {}
  const [errors, setErrors] = useState<PostErrors>({});
  const [privacy, setPrivacy] = useState("public");
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [sharedWith, setSharedWith] = useState<number[]>([]);
  const [img, setImg] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearError = (field: keyof PostErrors) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  useEffect(() => {
    if (privacy !== "private") {
      setFollowers([]);
      setSharedWith([]);
      return;
    }

    GetFolowers()
      .then((data) => setFollowers(data))
      .catch((err) => console.error("Failed to load followers", err));


  }, [privacy]);

  const handleToggleFollower = (id: number, checked: boolean) => {
    setSharedWith((prev) =>
      checked ? [...prev, id] : prev.filter((uid) => uid !== id)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("privacy", privacy);

    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 10 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image_error:
            "Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.",
        }));
        return;
      } else {
        clearError("image_error");
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image_error: "File too large. Max 5MB allowed.",
        }));
        return;
      } else {
        clearError("image_error");
      }
    }

    // Validate title
    const title = formData.get("title")?.toString().trim();
    if (typeof title !== "string" || title.length < 1 || title.length > 255) {
      setErrors((prev) => ({
        ...prev,
        title_error: "Title must be between 1 and 255 characters",
      }));
      return;
    } else {
      clearError("title_error");
    }

    // Validate body/content
    const body = formData.get("content")?.toString().trim();
    if (typeof body !== "string" || body.length < 1 || body.length > 500) {
      setErrors((prev) => ({
        ...prev,
        body_error: "Body must be between 1 and 500 characters",
      }));
      return;
    } else {
      clearError("body_error");
    }

    // Validate privacy
    const allowedPrivacy = ["public", "almost_private", "private"];
    if (!allowedPrivacy.includes(privacy)) {
      setErrors((prev) => ({
        ...prev,
        privacy_error: "The privacy you provided is not supported",
      }));
      return;
    } else {
      clearError("privacy_error");
    }

    // Append shared_with ids if private
    if (privacy === "private" && sharedWith.length > 0) {
      sharedWith.forEach((id) => {
        formData.append("shared_with", id.toString());
      });
    }

    // Submit the form
    const res = await fetch("http://localhost:8080/api/v1/posts/create", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      const savedPost = await res.json();
      if (!user) {
        alert("User information is missing. Cannot create post.");
        return;
      }
      let newPost: Post = {
        id: savedPost.id,
        title: title!,
        content: body!,
        media_link: savedPost.media_link ?? "",
        author: user,
        likes: 0,
        dislikes: 0,
        total_comments: 0,
        created_at: savedPost.createdAt ?? new Date().toISOString(),
        user_vote: null,
      };
      onCreated(newPost);
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
          <input
            type="text"
            name="title"
            required
            maxLength={255}
            onChange={() => clearError("title_error")}
          />
          {errors.title_error && <p className="errors">{errors.title_error}</p>}
        </label>

        <label>
          Body
          <textarea
            name="content"
            rows={4}
            required
            maxLength={500}
            onChange={() => clearError("body_error")}
          />
          {errors.body_error && <p className="errors">{errors.body_error}</p>}
        </label>

        <label>
          Image or GIF
          <button
            type="button"
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image or GIF"
          >
            <FaImage />
            {img && <span className="comment-img-name">{img.name}</span>}
          </button>
          <input
            type="file"
            name="image"
            accept="image/*,image/gif"
            ref={fileInputRef}
            className="hidden-file-input"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImg(file);
              clearError("image_error");
            }}
          />
          {errors.image_error && <p className="errors">{errors.image_error}</p>}
        </label>

        <label>
          Privacy
          <select
            name="privacy"
            value={privacy}
            onChange={(e) => {
              setPrivacy(e.target.value.trim());
              clearError("privacy_error");
            }}
          >
            <option value="public">Public (for all users)</option>
            <option value="almost_private">
              Almost Private (for followers only)
            </option>
            <option value="private">Private (for specific followers)</option>
          </select>
          {errors.privacy_error && (
            <p className="errors">{errors.privacy_error}</p>
          )}
        </label>

        {privacy === "private" && (
          <div className="share-with-users">
            <label className="share-with-label">
              Share with specific followers
            </label>
            <ul className="user-checkbox-list">
              {followers.length > 0 && followers.map((f) => (
                <li key={f.id} className="user-checkbox-item">
                  <label id="follower-checkbox-label">
                    <PostHeader
                      author={`${f.first_name} ${f.last_name}`}
                      createdAt=""
                      avatarUrl={f.avatar}
                    />
                    <input
                      type="checkbox"
                      checked={sharedWith.includes(f.id)}
                      onChange={(e) =>
                        handleToggleFollower(f.id, e.target.checked)
                      }
                      title={`Share with ${f.first_name} ${f.last_name}`}
                      placeholder={`Select follower ${f.first_name} ${f.last_name}`}
                      aria-label={`Share with ${f.first_name} ${f.last_name}`}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="submit-post-btn">
          Submit Post
        </button>
      </form>
    </>
  );
}
