import PostMeta from './postMeta';
import PostBody from './postBody';
import PostActions from './postActions';
import PostComment from './postComment';
import { Post } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  return (
    <li className="post-card">
      <PostMeta author={`user-${post.userId}`} createdAt="2025-06-11T13:45:00Z" avatarUrl="/avatar.png" />
      <PostBody title={post.title} content={post.body} />
      <PostComment />
      <PostActions postId={post.id} />
    </li>
  );
}
