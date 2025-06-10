import PostMeta from './postMeta';
import PostBody from './postBody';
import PostActions from './postActions';
import { Post } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  return (
    <li className="post-card">
      <PostBody title={post.title} content={post.body} />
      <PostMeta author={post.author} createdAt={post.createdAt} />
      <PostActions postId={post.id} />
    </li>
  );
}
