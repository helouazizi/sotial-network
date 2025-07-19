// frontend/app/components/post/postCrad.tsx
import PostHeader from './postHeader';
import PostBody from './postBody';
import PostActions from './postActions';
import CommentPostForm from './commentForm';
import { getComments, addComment, votePost } from '@/services/postsServices';
import { Post, Comment } from '@/types/post';
import { useState } from 'react';
import { BuildMediaLinkCAS } from '@/utils/posts';
import { SocketContext } from "@/context/socketContext"; // Adjust path if different
import { useContext } from 'react';

type postProps = {
  post: Post

}

export default function PostCard({ post }: postProps) {
  const { user } = useContext(SocketContext) ?? {}
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [total_comments, setTotal_comments] = useState(post.total_comments);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(post.user_vote === "like" || post.user_vote === "dislike" ? post.user_vote : null);

  const fetchComments = async () => {
    const res = await getComments(post.id);
    setComments(res);
  };

  const newComment = async (comment: string, img: File | null) => {
   const data = await addComment(post.id, comment, img);
   
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
        id: 0
      },
      created_at: new Date().toISOString(),
   
      media_link: data.media_link  
    };
    setComments((prev) => [new_comment, ...(prev || [])]);
    setTotal_comments((prev) => prev + 1);
  };

  const handleVote = async (action: "like" | "dislike") => {
    try {
      if (action === "like") {
        if (userVote === "like") {
          await votePost(post.id, "unlike");

          setLikes(likes - 1);
          setUserVote(null);
        } else {
          if (userVote === "dislike") {
            await votePost(post.id, "undislike");
            setDislikes(dislikes - 1);
          }
          await votePost(post.id, "like");
          setLikes(likes + 1);
          setUserVote("like");
        }
      }

      if (action === "dislike") {
        if (userVote === "dislike") {
          await votePost(post.id, "undislike");
          setDislikes(dislikes - 1);
          setUserVote(null);
        } else {
          if (userVote === "like") {
            await votePost(post.id, "unlike");
            setLikes(likes - 1);
          }
          await votePost(post.id, "dislike");
          setDislikes(dislikes + 1);
          setUserVote("dislike");
        }
      }
    } catch (err) {
      console.error("Vote failed", err);
    }
  };


  return (
    <div className="post-card">
      <PostHeader author={post.author.nickname ? post.author.nickname : post.author.firstname + "-" + post.author.lastname} firstname={post.author.firstname} lastname={post.author.lastname} createdAt={post.created_at} avatarUrl={post.author.avatar} />
      <PostBody title={post.title} content={post.content} media={post.media_link} body_type='post' />
      <CommentPostForm onSubmit={newComment} />
      <PostActions
        likes={likes}
        dislikes={dislikes}
        total_comments={total_comments}
        userVote={userVote}
        onVote={handleVote}
        comments={comments}
        fetchComments={fetchComments}
      />
    </div>
  );
}

