'use client';
import { useParams } from "next/navigation";
import { useContext, useState } from "react";

import { PopupContext } from "@/context/PopupContext";

function CreatPost() {
  const [Title, SetTitle] = useState("");
  const [Content, SetContent] = useState("");
  const [File, SetFile] = useState<File | null>(null);
      const params = useParams();
  const popup = useContext(PopupContext)
  const CreatPostHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("title", Title);
    formdata.append("content", Content);
    if (File) {
      formdata.append("file", File);
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/groups/joined/${params.id}/post/addpost`,
        {
          method: "POST",
          credentials: "include",
      
          body : formdata
        }
      );
      if (!res.ok){
        popup?.showPopup("faild", "Sommething went wrong")
        return 
      }
      const data = await res.json() 
      console.log(data, "data");
      
    } catch (error) {}
  };

  return (
    <form className="post-form"onSubmit={CreatPostHandler}>
      <h2>Create a Post</h2>

      <label>
        Title
        <input
          type="text"
          name="title"
          required
          maxLength={255}
          onChange={(e) => SetTitle(e.target.value)}
        />
      </label>

      <label>
        Content
        <textarea
          name="content"
          rows={4}
          required
          onChange={(e) => SetContent(e.target.value)}
          maxLength={500}
        />
      </label>

      <label>
        Image or GIF
        <div className="upload-section">
          <button
            type="button"
            className="upload-btn"
            title="Upload image or GIF"
          >
            Upload
          </button>
          <input
            type="file"
            name="image"
            accept="image/*,image/gif"
            className="hidden-file-input"
            style={{ display: "none" }}
            onChange={(e) => SetFile(e.target.files?.[0] || null)}
          />
        </div>
      </label>

      <button type="submit" className="submit-post-btn">
        Submit Post
      </button>
    </form>
  );
}
export default CreatPost;
