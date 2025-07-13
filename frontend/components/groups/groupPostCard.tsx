


import { Post, Comment } from '@/types/post';
import { useState } from 'react';
import { BuildMediaLinkCAS } from '@/utils/posts';
import { SocketContext } from "@/context/socketContext"; // Adjust path if different
import { useContext } from 'react';
import { addGroupComment, getGroupComments } from '@/services/groupcommentservices';
import CommentPostForm from '../post/commentForm';
import PostBody from '../post/postBody';
import PostHeader from '../post/postHeader';
import PostGroupActions from './Postaction';
import PostGroupBody from './PostGroupBody';


type postProps = {
  post: Post

}

export default function PostGroupCard({ post }: postProps) {
  const { user } = useContext(SocketContext) ?? {}
  const [comments, setComments] = useState<Comment[]>([]);
 
  const [total_comments, setTotal_comments] = useState(post.total_comments);
 
  const fetchComments = async () => {
    const res = await getGroupComments(post.id);
    setComments(res);
  };

  const newComment = async (comment: string, img: File | null) => {
    await addGroupComment(post.id, comment, img);
    const new_comment: Comment = {
      comment,
      author: {
        firstname: user?.firstname ?? "",
        lastname: user?.lastname ?? "",
        avatar: user?.avatar ?? "",
        nickname: user?.nickname ?? "",
        aboutme: "",
        email: "",
        dateofbirth: "",
        id: user?.id ?? 0
      },
      created_at: new Date().toISOString(),
      media_link: img ? BuildMediaLinkCAS(img) : ""
    };
    setComments((prev) => [new_comment, ...(prev || [])]);
    setTotal_comments((prev) => prev + 1);
  };
return (
    <div className="post-card">
      <PostHeader author={post.author.nickname} firstname={post.author.firstname} lastname={post.author.lastname} createdAt={post.created_at} avatarUrl={post.author.avatar} />
      <PostGroupBody title={post.title} content={post.content} media={post.media_link} />
      <CommentPostForm onSubmit={newComment} />
      <PostGroupActions
        total_comments={total_comments}
        comments={comments}
        fetchComments={fetchComments}
      />
    </div>
  );


 
}