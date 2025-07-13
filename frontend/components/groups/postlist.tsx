"use client";
import { Post } from "@/types/post";
import PostHeader from "../post/postHeader";

import PostGroupBody from "./PostGroupBody";

type postProps = {
  post: Post;
};

export default function Postlist({ post }: postProps) {
  return (
    <div className="post-card">
      <PostHeader
        author={
          post.author.nickname
            ? post.author.nickname
            : post.author.firstname + "-" + post.author.lastname
        }
        firstname={post.author.firstname}
        lastname={post.author.lastname}
        createdAt={new Date().toISOString()}
        avatarUrl={post.author.avatar}
      />
        <PostGroupBody title={post.title} content={post.content} media={post.media_link}  />
    </div>
  
  );
}
