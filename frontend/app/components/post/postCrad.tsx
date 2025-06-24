import PostHeader from './postHeader';
import PostBody from './postBody';
import PostActions from './postActions';
import CommentPostForm from './commentForm';
import { getComments, addComment, votePost } from '@/app/services/postsServices';
import { Post, Comment } from '@/app/types/post';
import { useState } from 'react';


type postProps = {
  post: Post
}

export default function PostCard({ post }: postProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [total_comments, setTotal_comments] = useState(post.total_comments);
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(post.user_vote === "like" || post.user_vote === "dislike" ? post.user_vote : null);

  const fetchComments = async () => {
    const res = await getComments(post.id);
    setComments(res);
  };

  const newComment = async (comment: string , img : File | null) => {
    await addComment(post.id, comment , img );
    const new_comment = {
      comment,
      author: { user_name: "you", first_name: "You", last_name: "You", avatar: "avatar.png" },
      created_at: new Date().toISOString(),
      media_link : img?.name 
    };
    setComments((prev) => [new_comment, ...(prev|| [])]);
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
            setDislikes(dislikes - 1);
            await votePost(post.id, "undislike");
          }
          setLikes(likes + 1);
          setUserVote("like");
          await votePost(post.id, "like");
        }
      }

      if (action === "dislike") {
        if (userVote === "dislike") {
          await votePost(post.id, "undislike");
          setDislikes(dislikes - 1);
          setUserVote(null);
        } else {
          if (userVote === "like") {
            setLikes(likes - 1);
            await votePost(post.id, "unlike");
          }
          setDislikes(dislikes + 1);
          setUserVote("dislike");
          await votePost(post.id, "dislike");
        }
      }
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <div className="post-card">
      <PostHeader author={`test-user`} createdAt="2025-06-11T13:45:00Z" avatarUrl="/avatar.png" />
      <PostBody title={post.title} content={post.content} media={`http://localhost:8080/images/posts/${post.media_link}`} />
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

