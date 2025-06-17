"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostForm() {
  const [privacy, setPrivacy] = useState("public");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("privacy", privacy);
    formData.append("user_id", "1");

    // ============ validate data in front ================//
    // --- Validate Media File ---
    const fileInput = form.elements.namedItem("media") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        alert("Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.");
        return;
      }

      if (file.size > maxSize) {
        alert("File too large. Max 5MB allowed.");
        return;
      }

      // Optional: Check dimensions
      // await validateImageDimensions(file);
    }

    const title = formData.get("title")?.toString().trim();
    if (typeof title !== "string" || title.length < 1 || title.length > 255) {
      alert("Title must be betwen {1-255} characters");
      return;
    }

    const body = formData.get("content")?.toString().trim();
    if (typeof body !== "string" || body.length < 1 || body.length > 500) {
      alert("Body must be betwen {1-500} characters");
      return;
    }

    const privacyy = formData.get("privacy")?.toString().trim();
    if (
      privacyy !== "public" &&
      privacyy !== "almost_private" &&
      privacyy !== "private"
    ) {
      alert("The privacy you provided it's not exist");
      return;
    }

    // alert('Post created!');
    const res = await fetch("http://localhost:8080/api/v1/posts/create", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
    //   form.reset();
    //   setPrivacy("public");
      router.push("/");
    } else {
      alert("Failed to create post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>Create a Post</h2>

      <label>
        Title
        <input type="text" name="title" required maxLength={255} />
      </label>

      <label>
        Body
        <textarea name="content" rows={4} required maxLength={500} />
      </label>

      <label>
        Image or GIF
        <input type="file" name="media" accept="image/*,image/gif" />
      </label>

      <label>
        Privacy
        <select
          name="privacy"
          value={privacy}
          onChange={(e) => setPrivacy(e.target.value)}
        >
          <option value="public">Public (for all users)</option>
          <option value="almost_private">
            Almost Private (for followers onlly)
          </option>
          <option value="private">Private (for creator)</option>
        </select>
      </label>

      <button type="submit">Submit Post</button>
    </form>
  );
}
